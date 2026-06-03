N IF NOT EXISTS debates_count BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS listening_time BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credits_used BIGINT NOT NULL DEFAULT 0;


-- 3. DÉPLOIEMENT DE LA TABLE DES TRANSACTIONS (TRANSACTIONS TABLE)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount BIGINT NOT NULL, -- Négatif pour une dépense, positif pour un achat/recharge
    type TEXT NOT NULL CHECK (type IN ('chat', 'broadcast', 'purchase', 'refund')),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DÉPLOIEMENT DE LA TABLE DES DÉBATS (DEBATES TABLE FOR REAL HISTORY)
CREATE TABLE IF NOT EXISTS public.debates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    left_entel TEXT NOT NULL,
    right_entel TEXT NOT NULL,
    turns INT NOT NULL,-- =========================================================================
-- VELTRIX - DEPLOYMENT SCHEMA FOR SUPABASE DATABASE (UPGRADED VERSION)
-- 
-- Exécutez ce script SQL dans le "SQL Editor" de votre tableau de bord Supabase.
-- Il va créer la table des profils, configurer les débats réels, et mettre en place le système automatique
-- de balance de crédits et d'historique persistant pour les utilisateurs.
-- =========================================================================

-- 1. EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DÉPLOIEMENT DE LA TABLE DES PROFILS (PROFILES TABLE)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    credits BIGINT NOT NULL DEFAULT 50 CHECK (credits >= 0),
    tier TEXT NOT NULL DEFAULT 'STANDARD',
    
    -- STATISTIQUES PERSISTANTES
    debates_count BIGINT NOT NULL DEFAULT 0,
    listening_time BIGINT NOT NULL DEFAULT 0, -- Temps en secondes
    credits_used BIGINT NOT NULL DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GARANTIE DE SCHÉMA : Ajouter explicitement les colonnes si la table existait déjà !
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credits BIGINT NOT NULL DEFAULT 50 CHECK (credits >= 0);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'STANDARD';
ALTER TABLE public.profiles ADD COLUM
    language TEXT NOT NULL DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CRÉATION D'UN DÉCLENCHEUR AUTOMATIQUE (AUTOMATED TRIGGER) POUR LES NOUVEAUX PROFILS ET CADEAU DE BIENVENUE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertion du profil
    INSERT INTO public.profiles (id, full_name, credits, tier, debates_count, listening_time, credits_used)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Utilisateur Veltrix'),
        50, -- 50 Crédits offerts en cadeau de bienvenue !
        'STANDARD',
        0,
        0,
        0
    );

    -- Insertion de la transaction initiale de bienvenue (+50 crédits)
    INSERT INTO public.transactions (user_id, amount, type, details)
    VALUES (
        new.id,
        50,
        'purchase',
        'Cadeau de bienvenue pour l''inscription sur Veltrix'
    );

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Sécurité ultime : empêche tout blocage de l'inscription en cas d'erreur de table
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Lancer le trigger après l'inscription de chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Garantir les permissions d'exécution pour le système d'authentification Supabase
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO public;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;


-- 6. SÉCURITÉ ET RLS POUR LES PROFILS (ROW LEVEL SECURITY)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Nouvelle politique d'insertion en urgence (permet de créer la ligne si le trigger a été manqué)
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);


-- 7. SÉCURITÉ ET RLS POUR LES TRANSACTIONS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transactions_select_policy" ON public.transactions;
CREATE POLICY "transactions_select_policy" ON public.transactions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_insert_policy" ON public.transactions;
CREATE POLICY "transactions_insert_policy" ON public.transactions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);


-- 8. SÉCURITÉ ET RLS POUR LES DÉBATS
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "debates_select_policy" ON public.debates;
CREATE POLICY "debates_select_policy" ON public.debates
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "debates_insert_policy" ON public.debates;
CREATE POLICY "debates_insert_policy" ON public.debates
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);


-- 9. FONCTION POUR DÉDUIRE DES CRÉDITS ET ENREGISTRER UNE TRANSACTION (ATOMIQUE EN MODE PESSIMISTE)
-- Cette fonction effectue les deux opérations de manière atomique et met à jour les stats du profil !
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
    user_id UUID, 
    amount INT, 
    tx_type TEXT DEFAULT 'chat', 
    tx_details TEXT DEFAULT ''
)
RETURNS VOID AS $$
BEGIN
    -- S'assurer que l'utilisateur connecté ne peut débiter que son propre compte
    IF auth.uid() IS NOT NULL AND user_id <> auth.uid() THEN
        RAISE EXCEPTION 'Action non autorisée. Vous ne pouvez débiter que vos propres crédits.';
    END IF;

    -- Mise à jour du profil (déduction des crédits)
    UPDATE public.profiles
    SET credits = credits - amount,
        credits_used = credits_used + amount,
        debates_count = debates_count + (CASE WHEN tx_type = 'chat' THEN 1 ELSE 0 END)
    WHERE id = user_id AND credits >= amount;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solde de crédits insuffisant ou utilisateur inexistant.';
    END IF;

    -- Journalisation de la transaction correspondante (valeur négative car dépense)
    INSERT INTO public.transactions (user_id, amount, type, details)
    VALUES (user_id, -amount, tx_type, tx_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Accorder les permissions d'exécution
REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT, TEXT, TEXT) FROM public;
REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT, TEXT, TEXT) TO service_role;
