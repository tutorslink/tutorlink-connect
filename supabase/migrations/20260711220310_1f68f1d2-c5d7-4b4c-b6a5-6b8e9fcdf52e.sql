
-- =========================================================================
-- ENUMS
-- =========================================================================
CREATE TYPE public.app_role AS ENUM ('student', 'tutor', 'recruitment', 'website_manager', 'owner');
CREATE TYPE public.application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'withdrawn');
CREATE TYPE public.lesson_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- =========================================================================
-- UTILITY FUNCTIONS
-- =========================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =========================================================================
-- PROFILES
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  timezone TEXT,
  language TEXT DEFAULT 'en',
  discord_id TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- default role: student
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =========================================================================
-- USER ROLES (separate table — never on profiles)
-- =========================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('recruitment','website_manager','owner')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_manager(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('website_manager','owner')
  );
$$;

-- Signup trigger (after user_roles exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile policies
CREATE POLICY "Profiles readable to authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public may view tutor profiles" ON public.profiles
  FOR SELECT TO anon USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = profiles.id AND role = 'tutor')
  );
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Managers update any profile" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_manager(auth.uid()));

-- user_roles policies
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Managers manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- SUBJECTS / LEVELS (reference)
-- =========================================================================
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subjects TO anon, authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subjects public read" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Managers manage subjects" ON public.subjects
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

CREATE TABLE public.academic_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academic_levels TO anon, authenticated;
GRANT ALL ON public.academic_levels TO service_role;
ALTER TABLE public.academic_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Levels public read" ON public.academic_levels FOR SELECT USING (true);
CREATE POLICY "Managers manage levels" ON public.academic_levels
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- TUTOR PROFILES
-- =========================================================================
CREATE TABLE public.tutor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  headline TEXT,
  about TEXT,
  hourly_rate NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  languages TEXT[] DEFAULT '{}',
  timezone TEXT,
  years_experience INT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tutor_profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.tutor_profiles TO authenticated;
GRANT ALL ON public.tutor_profiles TO service_role;
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tutor_profiles_updated_at BEFORE UPDATE ON public.tutor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Active tutor profiles public read" ON public.tutor_profiles
  FOR SELECT USING (is_active = true AND is_verified = true);
CREATE POLICY "Tutor reads own profile" ON public.tutor_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Tutor updates own profile" ON public.tutor_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Managers manage tutor profiles" ON public.tutor_profiles
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- Tutor subjects / levels join
CREATE TABLE public.tutor_subjects (
  tutor_id UUID REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (tutor_id, subject_id)
);
GRANT SELECT ON public.tutor_subjects TO anon, authenticated;
GRANT INSERT, DELETE ON public.tutor_subjects TO authenticated;
GRANT ALL ON public.tutor_subjects TO service_role;
ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutor subjects public read" ON public.tutor_subjects FOR SELECT USING (true);
CREATE POLICY "Tutor manages own subjects" ON public.tutor_subjects
  FOR ALL TO authenticated USING (tutor_id = auth.uid() OR public.is_manager(auth.uid()))
  WITH CHECK (tutor_id = auth.uid() OR public.is_manager(auth.uid()));

CREATE TABLE public.tutor_levels (
  tutor_id UUID REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  level_id UUID REFERENCES public.academic_levels(id) ON DELETE CASCADE,
  PRIMARY KEY (tutor_id, level_id)
);
GRANT SELECT ON public.tutor_levels TO anon, authenticated;
GRANT INSERT, DELETE ON public.tutor_levels TO authenticated;
GRANT ALL ON public.tutor_levels TO service_role;
ALTER TABLE public.tutor_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutor levels public read" ON public.tutor_levels FOR SELECT USING (true);
CREATE POLICY "Tutor manages own levels" ON public.tutor_levels
  FOR ALL TO authenticated USING (tutor_id = auth.uid() OR public.is_manager(auth.uid()))
  WITH CHECK (tutor_id = auth.uid() OR public.is_manager(auth.uid()));

-- =========================================================================
-- ADVERTISEMENTS
-- =========================================================================
CREATE TABLE public.advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.advertisements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advertisements TO authenticated;
GRANT ALL ON public.advertisements TO service_role;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_ads_updated_at BEFORE UPDATE ON public.advertisements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Active ads public read" ON public.advertisements
  FOR SELECT USING (is_active = true);
CREATE POLICY "Tutor manages own ads" ON public.advertisements
  FOR ALL TO authenticated USING (tutor_id = auth.uid() OR public.is_manager(auth.uid()))
  WITH CHECK (tutor_id = auth.uid() OR public.is_manager(auth.uid()));

-- =========================================================================
-- APPLICATIONS
-- =========================================================================
CREATE TABLE public.tutor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subjects TEXT[] DEFAULT '{}',
  levels TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  timezone TEXT,
  years_experience INT,
  cover_letter TEXT,
  document_ids TEXT[] DEFAULT '{}',
  status public.application_status NOT NULL DEFAULT 'pending',
  internal_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.tutor_applications TO authenticated;
GRANT INSERT ON public.tutor_applications TO anon;
GRANT ALL ON public.tutor_applications TO service_role;
ALTER TABLE public.tutor_applications ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tutor_apps_updated_at BEFORE UPDATE ON public.tutor_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone can submit tutor application" ON public.tutor_applications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Applicant reads own tutor application" ON public.tutor_applications
  FOR SELECT TO authenticated USING (applicant_user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Staff updates tutor applications" ON public.tutor_applications
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.recruitment_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role_applied_for TEXT,
  cover_letter TEXT,
  document_ids TEXT[] DEFAULT '{}',
  status public.application_status NOT NULL DEFAULT 'pending',
  internal_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.recruitment_applications TO authenticated;
GRANT INSERT ON public.recruitment_applications TO anon;
GRANT ALL ON public.recruitment_applications TO service_role;
ALTER TABLE public.recruitment_applications ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_recruit_apps_updated_at BEFORE UPDATE ON public.recruitment_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone can submit recruitment application" ON public.recruitment_applications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Applicant reads own recruitment application" ON public.recruitment_applications
  FOR SELECT TO authenticated USING (applicant_user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Staff updates recruitment applications" ON public.recruitment_applications
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================================
-- STUDENT ↔ TUTOR ASSIGNMENTS
-- =========================================================================
CREATE TABLE public.student_tutor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  remaining_classes INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, tutor_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_tutor_assignments TO authenticated;
GRANT ALL ON public.student_tutor_assignments TO service_role;
ALTER TABLE public.student_tutor_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assignment participants read" ON public.student_tutor_assignments
  FOR SELECT TO authenticated USING (
    student_id = auth.uid() OR tutor_id = auth.uid() OR public.is_manager(auth.uid())
  );
CREATE POLICY "Managers manage assignments" ON public.student_tutor_assignments
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- SCHEDULES & LESSONS
-- =========================================================================
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;
GRANT SELECT ON public.schedules TO anon;
GRANT ALL ON public.schedules TO service_role;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schedules public read" ON public.schedules FOR SELECT USING (is_active = true);
CREATE POLICY "Tutor manages own schedule" ON public.schedules
  FOR ALL TO authenticated USING (tutor_id = auth.uid() OR public.is_manager(auth.uid()))
  WITH CHECK (tutor_id = auth.uid() OR public.is_manager(auth.uid()));

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status public.lesson_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Lesson participants read" ON public.lessons
  FOR SELECT TO authenticated USING (
    tutor_id = auth.uid() OR student_id = auth.uid() OR public.is_manager(auth.uid())
  );
CREATE POLICY "Tutor or manager modify lessons" ON public.lessons
  FOR ALL TO authenticated USING (tutor_id = auth.uid() OR public.is_manager(auth.uid()))
  WITH CHECK (tutor_id = auth.uid() OR public.is_manager(auth.uid()));

-- =========================================================================
-- REVIEWS
-- =========================================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status public.review_status NOT NULL DEFAULT 'pending',
  tutor_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tutor_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Approved reviews public read" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Author or tutor reads own review" ON public.reviews
  FOR SELECT TO authenticated USING (
    student_id = auth.uid() OR tutor_id = auth.uid() OR public.is_manager(auth.uid())
  );
CREATE POLICY "Student creates review for assigned tutor" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (
    student_id = auth.uid() AND EXISTS (
      SELECT 1 FROM public.student_tutor_assignments
      WHERE student_id = auth.uid() AND tutor_id = reviews.tutor_id
    )
  );
CREATE POLICY "Student updates own review" ON public.reviews
  FOR UPDATE TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
CREATE POLICY "Tutor responds to own review" ON public.reviews
  FOR UPDATE TO authenticated USING (tutor_id = auth.uid()) WITH CHECK (tutor_id = auth.uid());
CREATE POLICY "Managers moderate reviews" ON public.reviews
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- NOTIFICATIONS
-- =========================================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Managers manage notifications" ON public.notifications
  FOR ALL TO authenticated USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

-- =========================================================================
-- AUDIT LOG
-- =========================================================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read audit log" ON public.audit_log
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- =========================================================================
-- INDEXES
-- =========================================================================
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_tutor_profiles_active ON public.tutor_profiles(is_active, is_verified);
CREATE INDEX idx_ads_tutor ON public.advertisements(tutor_id);
CREATE INDEX idx_lessons_tutor ON public.lessons(tutor_id, starts_at);
CREATE INDEX idx_lessons_student ON public.lessons(student_id, starts_at);
CREATE INDEX idx_assignments_student ON public.student_tutor_assignments(student_id);
CREATE INDEX idx_assignments_tutor ON public.student_tutor_assignments(tutor_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_reviews_tutor ON public.reviews(tutor_id, status);
CREATE INDEX idx_tutor_apps_status ON public.tutor_applications(status);
CREATE INDEX idx_recruit_apps_status ON public.recruitment_applications(status);
