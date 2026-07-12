/*
# Platform Collections - Sections 12 & 13

## Purpose
Creates the remaining database tables required by the Tutors Link specification:
subject categories, pages, homepage content, platform settings, notification
preferences, and Discord account links. Also adds soft-delete columns and
additional status fields to existing tables.

## New Tables

1. **subject_categories** — Groups related subjects (Mathematics, Sciences, Languages, etc.)
   - id, name, slug, description, display_order, is_active, created_at

2. **pages** — Editable informational website pages (About, Privacy, Terms, FAQ)
   - id, title, slug, content, seo_title, seo_description, status, published_at, updated_at, is_deleted

3. **homepage_content** — Homepage CMS content (hero, stats, featured tutors, testimonials)
   - id, hero_headline, hero_subheadline, cta_primary, cta_secondary, stats, featured_tutors, testimonials, is_published, updated_at

4. **platform_settings** — Centralized configurable business settings
   - id, key, value (JSONB), updated_at, updated_by

5. **notification_preferences** — Per-user notification preferences
   - id, user_id, email_notifications, push_notifications, lesson_reminders, announcements, marketing, updated_at

6. **discord_links** — Discord account linking
   - id, user_id, discord_id, discord_username, linked_at, updated_at

## Modified Tables
- **advertisements** — Added: teaching_format, monthly_price, is_featured, is_deleted, published_at, advertisement_status
- **tutor_profiles** — Added: slug, is_deleted, profile_status
- **reviews** — Added: is_deleted
- **tutor_applications** — Added: is_deleted
- **recruitment_applications** — Added: is_deleted
- **notifications** — Added: is_deleted
- **lessons** — Added: subject, academic_level, created_by, is_deleted

## Security
- RLS enabled on all new tables
- Public read on subject_categories, pages (published), homepage_content (published)
- Owner-scoped CRUD on notification_preferences, discord_links
- Manager-only on platform_settings, pages (write), homepage_content (write)
*/

-- =========================================================================
-- SUBJECT CATEGORIES (Section 13.10)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.subject_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subject_categories TO anon, authenticated;
GRANT ALL ON public.subject_categories TO service_role;
ALTER TABLE public.subject_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Subject categories public read" ON public.subject_categories;
CREATE POLICY "Subject categories public read" ON public.subject_categories
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Managers manage subject categories" ON public.subject_categories;
CREATE POLICY "Managers manage subject categories" ON public.subject_categories
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- Add category reference to subjects
DO $$ BEGIN
  ALTER TABLE public.subjects ADD COLUMN category_id UUID REFERENCES public.subject_categories(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- =========================================================================
-- PAGES (Section 13.14)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon, authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published pages public read" ON public.pages;
CREATE POLICY "Published pages public read" ON public.pages
  FOR SELECT TO anon, authenticated USING (status = 'published' AND is_deleted = false);
DROP POLICY IF EXISTS "Managers manage pages" ON public.pages;
CREATE POLICY "Managers manage pages" ON public.pages
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- HOMEPAGE CONTENT (Section 13.15)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_headline TEXT,
  hero_subheadline TEXT,
  cta_primary TEXT,
  cta_secondary TEXT,
  stats JSONB DEFAULT '{}'::jsonb,
  featured_tutors JSONB DEFAULT '[]'::jsonb,
  testimonials JSONB DEFAULT '[]'::jsonb,
  promotional_sections JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_content TO anon, authenticated;
GRANT ALL ON public.homepage_content TO service_role;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published homepage public read" ON public.homepage_content;
CREATE POLICY "Published homepage public read" ON public.homepage_content
  FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "Managers manage homepage" ON public.homepage_content;
CREATE POLICY "Managers manage homepage" ON public.homepage_content
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- PLATFORM SETTINGS (Section 13.17)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff read platform settings" ON public.platform_settings;
CREATE POLICY "Staff read platform settings" ON public.platform_settings
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Managers manage platform settings" ON public.platform_settings;
CREATE POLICY "Managers manage platform settings" ON public.platform_settings
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- NOTIFICATION PREFERENCES (Section 17.11)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  lesson_reminders BOOLEAN NOT NULL DEFAULT true,
  announcements BOOLEAN NOT NULL DEFAULT true,
  marketing BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;
GRANT ALL ON public.notification_preferences TO service_role;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own notification prefs" ON public.notification_preferences;
CREATE POLICY "Users read own notification prefs" ON public.notification_preferences
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users insert own notification prefs" ON public.notification_preferences;
CREATE POLICY "Users insert own notification prefs" ON public.notification_preferences
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users update own notification prefs" ON public.notification_preferences;
CREATE POLICY "Users update own notification prefs" ON public.notification_preferences
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =========================================================================
-- DISCORD LINKS (Section 18.4)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.discord_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  discord_id TEXT NOT NULL UNIQUE,
  discord_username TEXT,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discord_links TO authenticated;
GRANT ALL ON public.discord_links TO service_role;
ALTER TABLE public.discord_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own discord link" ON public.discord_links;
CREATE POLICY "Users read own discord link" ON public.discord_links
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users insert own discord link" ON public.discord_links;
CREATE POLICY "Users insert own discord link" ON public.discord_links
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users update own discord link" ON public.discord_links;
CREATE POLICY "Users update own discord link" ON public.discord_links
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users delete own discord link" ON public.discord_links;
CREATE POLICY "Users delete own discord link" ON public.discord_links
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- =========================================================================
-- SOFT DELETE & ADDITIONAL COLUMNS ON EXISTING TABLES
-- =========================================================================

-- Advertisements: add teaching_format, monthly_price, is_featured, is_deleted, published_at, advertisement_status
DO $$ BEGIN
  ALTER TABLE public.advertisements ADD COLUMN teaching_format TEXT DEFAULT 'online';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.advertisements ADD COLUMN monthly_price NUMERIC(10,2);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.advertisements ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.advertisements ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.advertisements ADD COLUMN published_at TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.advertisements ADD COLUMN advertisement_status TEXT NOT NULL DEFAULT 'pending' CHECK (advertisement_status IN ('pending', 'active', 'paused', 'rejected'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Tutor profiles: add slug, is_deleted, profile_status
DO $$ BEGIN
  ALTER TABLE public.tutor_profiles ADD COLUMN slug TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.tutor_profiles ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.tutor_profiles ADD COLUMN profile_status TEXT NOT NULL DEFAULT 'active' CHECK (profile_status IN ('active', 'hidden', 'archived'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Reviews: add is_deleted
DO $$ BEGIN
  ALTER TABLE public.reviews ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Tutor applications: add is_deleted
DO $$ BEGIN
  ALTER TABLE public.tutor_applications ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Recruitment applications: add is_deleted
DO $$ BEGIN
  ALTER TABLE public.recruitment_applications ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Notifications: add is_deleted
DO $$ BEGIN
  ALTER TABLE public.notifications ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Lessons: add subject, academic_level, created_by, is_deleted
DO $$ BEGIN
  ALTER TABLE public.lessons ADD COLUMN subject TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.lessons ADD COLUMN academic_level TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.lessons ADD COLUMN created_by UUID REFERENCES auth.users(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.lessons ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- =========================================================================
-- INDEXES FOR NEW TABLES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);
CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON public.platform_settings(key);
CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON public.notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_links_user ON public.discord_links(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_links_discord ON public.discord_links(discord_id);
CREATE INDEX IF NOT EXISTS idx_subject_categories_slug ON public.subject_categories(slug);
CREATE INDEX IF NOT EXISTS idx_advertisements_status ON public.advertisements(advertisement_status);

-- =========================================================================
-- SEED DATA
-- =========================================================================
INSERT INTO public.subject_categories (name, slug, description, display_order) VALUES
  ('Mathematics', 'mathematics', 'All mathematics-related subjects', 1),
  ('Sciences', 'sciences', 'Natural and physical sciences', 2),
  ('Languages', 'languages', 'Language learning and literature', 3),
  ('Humanities', 'humanities', 'History, geography, social studies', 4),
  ('Business', 'business', 'Business and economics', 5),
  ('Computing', 'computing', 'Computer science and programming', 6),
  ('Test Preparation', 'test-preparation', 'SAT, ACT, GRE, IELTS preparation', 7)
ON CONFLICT (name) DO NOTHING;

-- Seed default platform settings
INSERT INTO public.platform_settings (key, value) VALUES
  ('ai_config', '{"enabled": true, "welcome_message": "Hi! I am the Tutors Link Assistant.", "lead_capture": true}'::jsonb),
  ('discord_config', '{"enabled": false, "notification_channel": ""}'::jsonb),
  ('scheduling_rules', '{"min_duration_minutes": 30, "max_duration_minutes": 120, "buffer_minutes": 15}'::jsonb),
  ('notification_defaults', '{"email_on_lesson": true, "email_on_application": true, "push_on_lesson": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed default homepage content
INSERT INTO public.homepage_content (hero_headline, hero_subheadline, cta_primary, cta_secondary, stats, is_published)
VALUES (
  'Unlock Your Academic Potential with Premier Private Tutors',
  'Connect with certified Ivy League and Oxbridge tutors for personalized, high-impact learning.',
  'Find the Perfect Tutor',
  'Apply as a Tutor',
  '{"tutors": 124, "students": 1450, "lessons": 9240, "subjects": 45, "rating": 4.9}'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- Seed default pages
INSERT INTO public.pages (title, slug, content, status, published_at) VALUES
  ('About Us', 'about', 'Tutors Link connects students with certified high-quality tutors.', 'published', now()),
  ('Privacy Policy', 'privacy', 'Our privacy policy details how we handle user data.', 'published', now()),
  ('Terms of Service', 'terms', 'Our terms of service outline the rules for using our platform.', 'published', now()),
  ('FAQ', 'faq', 'Frequently asked questions about Tutors Link.', 'published', now())
ON CONFLICT (slug) DO NOTHING;
