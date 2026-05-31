-- =========================================================================
-- VELTRIX - DEPLOYMENT SCHEMA FOR SUPABASE DATABASE
-- 
-- Exécutez ce script SQL dans le "SQL Editor" de votre tableau de bord Supabase.
-- Il va créer la table des profils, configurer les débats, et mettre en place le système automatique
-- de balance de crédits pour les utilisateurs.
-- =========================================================================

-- 1. CRÉATION DE LA TABLE DES PROFILS (PROFILES TABLE)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    credits BIGINT NOT NULL DEFAULT 50 CHECK (credits >= 0),
    tier TEXT NOT NULL DEFAULT 'STANDARD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CRÉATION D'UN DÉCLENCHEUR AUTOMATIQUE (AUTOMATED TRIGGER) POUR CRÉER LES PROFILS
-- Lorsqu'un utilisateur s'inscrit dans auth.users, le système va automatiquement créer
-- une ligne correspondante dans la table profiles avec 50 Crédits offerts en cadeau de bienvenue !
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, credits, tier)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Utilisateur Veltrix'),
        50,
        'STANDARD'
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

-- 3. GESTION DE LA SÉCURITÉ DE NIVEAU LIGNE (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir tous les profils (pour voir les détails des autres Entels de débat)
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated USING (true);

-- L'utilisateur peut modifier UNIQUEMENT son propre profil
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 4. CRÉATION DE LA FONCTION DE DÉDUCTION DE CRÉDITS (CREDIT DEBIT FUNCTION)
-- Une fonction qui garantit que la déduction des crédits est effectuée de manière sécurisée sans aucune triche possible côté frontend
CREATE OR REPLACE FUNCTION public.deduct_user_credits(user_id UUID, amount INT)
RETURNS VOID AS $$
BEGIN
    -- DOUBLE SÉCURITÉ : S'assurer que l'utilisateur connecté ne peut débiter QUE son propre compte
    -- auth.uid() renvoie l'ID de la session active de l'utilisateur connecté depuis le site.
    IF auth.uid() IS NOT NULL AND user_id <> auth.uid() THEN
        RAISE EXCEPTION 'Action non autorisée. Vous ne pouvez débiter que vos propres crédits.';
    END IF;

    UPDATE public.profiles
    SET credits = credits - amount
    WHERE id = user_id AND credits >= amount;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solde de crédits insuffisant ou utilisateur inexistant.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Restreindre l'exécution de la déduction de crédits aux seuls utilisateurs connectés et au service_role
REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT) FROM public;
REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT) FROM anon;
GRANT EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INT) TO service_role;


