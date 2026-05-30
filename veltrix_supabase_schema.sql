-- =========================================================================
-- VELTRIX - DEPLOYMENT SCHEMA FOR SUPABASE DATABASE
-- 
-- Kouri script SQL sa a nan "SQL Editor" nan tablodbò Supabase ou a.
-- Li pral kreye tab profile yo, konfigirasyon deba yo, ak sistèm otomatik
-- debalans kredi pou itilizatè yo.
-- =========================================================================

-- 1. KREYE TAB PROFILE LA (PROFILES TABLE)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    credits BIGINT NOT NULL DEFAULT 50 CHECK (credits >= 0),
    tier TEXT NOT NULL DEFAULT 'STANDARD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. KREYE YON DEKLANCHE OTOMATIK (AUTOMATED TRIGGER) POU KREYE PROFILS YO
-- Lè yon itilizatè enskri nan auth.users, sistèm nan ap otomatikman kreye
-- yon ranje (row) korespondan nan profiles la ak 50 Kredi kòm kado byenveni !
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, credits, tier)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Itilizatè Veltrix'),
        50,
        'STANDARD'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kouri trigger a apre chak nouvo itilizatè enskri
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. JERE SEKIRITE DE PATI (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Itilizatè yo gen dwa wè tout profiles (pou yo ka wè debatan ak lòt Entel yo)
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated USING (true);

-- Itilizatè a kapab modifye SÈLMAN pwòp profile pa li
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 4. KREYE WOUT RAPID POU DEDIKSYON KREDI (CREDIT DEBIT FUNCTION)
-- Yon fonksyon ki asire dediksyon kredi yo fèt byen san okenn triche nan frontend la
CREATE OR REPLACE FUNCTION public.deduct_user_credits(user_id UUID, amount INT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET credits = credits - amount
    WHERE id = user_id AND credits >= amount;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Balans kredi pa sifizan oswa itilizatè a pa egziste.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
