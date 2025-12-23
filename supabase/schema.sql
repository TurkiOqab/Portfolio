-- ============================================================================
-- DFOLIO DATABASE SCHEMA
-- Version: 2.0
-- Last Updated: 2024-12-23
--
-- This is the single source of truth for the database schema.
-- Run this in Supabase SQL Editor for a fresh setup.
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 PROFILES (linked to auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2.2 PORTFOLIOS (main portfolio data)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    name TEXT,
    title TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    contact JSONB DEFAULT '{}',
    theme TEXT DEFAULT 'slate',
    font TEXT DEFAULT 'outfit',
    is_published BOOLEAN DEFAULT TRUE,
    education JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    cv_url TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2.3 PROJECTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    image_url TEXT,
    display_order INT4 DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2.4 PORTFOLIO VIEWS (analytics)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2.5 PORTFOLIO LIKES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, visitor_id)
);

-- ----------------------------------------------------------------------------
-- 2.6 VERIFICATION TOKENS (email verification)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON public.projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_portfolio_id ON public.portfolio_views(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_created_at ON public.portfolio_views(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_visitor_portfolio ON public.portfolio_views(portfolio_id, visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_portfolio_id ON public.portfolio_likes(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_visitor_id ON public.portfolio_likes(visitor_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.verification_tokens(token);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 4.1 PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (TRUE);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 4.2 PORTFOLIOS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Published portfolios are viewable by everyone"
    ON public.portfolios FOR SELECT
    USING (is_published = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio"
    ON public.portfolios FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio"
    ON public.portfolios FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio"
    ON public.portfolios FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4.3 PROJECTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Projects are viewable with published portfolio"
    ON public.projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE id = portfolio_id AND (is_published = TRUE OR user_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert own projects"
    ON public.projects FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE id = portfolio_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own projects"
    ON public.projects FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE id = portfolio_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own projects"
    ON public.projects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE id = portfolio_id AND user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 4.4 PORTFOLIO VIEWS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can view views count"
    ON public.portfolio_views FOR SELECT
    USING (TRUE);

CREATE POLICY "Anyone can insert views"
    ON public.portfolio_views FOR INSERT
    WITH CHECK (TRUE);

-- ----------------------------------------------------------------------------
-- 4.5 PORTFOLIO LIKES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can view likes count"
    ON public.portfolio_likes FOR SELECT
    USING (TRUE);

CREATE POLICY "Anyone can insert likes"
    ON public.portfolio_likes FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Anyone can delete likes"
    ON public.portfolio_likes FOR DELETE
    USING (TRUE);

-- ----------------------------------------------------------------------------
-- 4.6 VERIFICATION TOKENS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Service role can manage tokens"
    ON public.verification_tokens FOR ALL
    USING (TRUE);

-- ============================================================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Auto-create profile on user signup
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 5.2 Auto-update updated_at timestamp
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 6. UTILITY QUERIES (Reference only - don't run automatically)
-- ============================================================================

-- Delete all data for fresh start:
-- TRUNCATE public.portfolio_likes, public.portfolio_views, public.projects,
--          public.verification_tokens, public.portfolios, public.profiles CASCADE;

-- Then delete auth users from Supabase Dashboard > Authentication > Users

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
