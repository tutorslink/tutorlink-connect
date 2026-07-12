/* eslint-disable @typescript-eslint/no-explicit-any, no-empty */
import { supabase } from "@/integrations/supabase/client";

export interface Tutor {
  id: string;
  name: string;
  avatar_url: string;
  headline: string;
  about: string;
  hourly_rate: number;
  rating_avg: number;
  rating_count: number;
  years_experience: number;
  languages: string[];
  subjects: string[];
  levels: string[];
  is_featured: boolean;
  is_verified: boolean;
  availability: string;
}

export interface Review {
  id: string;
  student_name: string;
  rating: number;
  comment: string;
  created_at: string;
  tutor_id: string;
  status: "pending" | "approved" | "rejected";
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  role: string;
  is_featured: boolean;
}

export interface CMSContent {
  homepage: {
    hero: {
      headline: string;
      subheadline: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    stats: {
      tutors: number;
      students: number;
      lessons: number;
      subjects: number;
      rating: number;
    };
  };
  about: {
    mission: string;
    vision: string;
    values: { title: string; description: string }[];
  };
  faqs: { question: string; answer: string; category: string }[];
}

// 1. Polished Default Static Data
const defaultTutors: Tutor[] = [
  {
    id: "tutor_1",
    name: "Dr. Alexander Sterling",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    headline: "Oxford Graduate & Experienced Mathematics Professor",
    about:
      "I hold a PhD in Mathematics from Oxford University and have spent over 12 years helping students master advanced calculus, algebra, and physics. My teaching style focuses on understanding core principles rather than memorization, making complex topics accessible and engaging.",
    hourly_rate: 65,
    rating_avg: 4.95,
    rating_count: 84,
    years_experience: 12,
    languages: ["English", "French"],
    subjects: ["Mathematics", "Physics", "Calculus"],
    levels: ["A-Level", "IB", "University", "IGCSE"],
    is_featured: true,
    is_verified: true,
    availability: "Mondays & Wednesdays (14:00 - 18:00 UTC)",
  },
  {
    id: "tutor_2",
    name: "Sophia Martinez",
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    headline: "Bilingual Literature Scholar & English Essay Specialist",
    about:
      "Specializing in SAT English, AP Literature, and academic writing. I work closely with students to polish their essay writing skills, vocabulary, and literary analysis. I am passionate about literature and helping students express themselves clearly.",
    hourly_rate: 45,
    rating_avg: 4.88,
    rating_count: 62,
    years_experience: 8,
    languages: ["English", "Spanish"],
    subjects: ["English Literature", "Creative Writing", "SAT Verbal"],
    levels: ["GCSE", "SAT", "High School", "Secondary"],
    is_featured: true,
    is_verified: true,
    availability: "Tuesdays & Thursdays (15:00 - 20:00 UTC)",
  },
  {
    id: "tutor_3",
    name: "Marcus Chen",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    headline: "Software Engineer & Computer Science Tutor",
    about:
      "Ex-Google Engineer teaching Python, Java, web development, and data structures. I believe in hands-on, project-based learning. Whether you are prepping for AP Computer Science, university exams, or coding interviews, I've got you covered.",
    hourly_rate: 55,
    rating_avg: 4.92,
    rating_count: 47,
    years_experience: 6,
    languages: ["English", "Mandarin"],
    subjects: ["Computer Science", "Programming (Python/Java)", "Web Dev"],
    levels: ["University", "GCSE", "A-Level", "Professional"],
    is_featured: true,
    is_verified: true,
    availability: "Saturdays (09:00 - 17:00 UTC)",
  },
  {
    id: "tutor_4",
    name: "Elena Rostova",
    avatar_url:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    headline: "Biochemistry Ph.D. & Pre-Med Mentor",
    about:
      "Teaching Biology and Chemistry for medical school aspirants and high school students. I use illustrative diagrams, concept maps, and practical medical scenarios to help make biology and biochemistry understandable and fun.",
    hourly_rate: 50,
    rating_avg: 4.91,
    rating_count: 39,
    years_experience: 7,
    languages: ["English", "Russian"],
    subjects: ["Chemistry", "Biology", "Biochemistry"],
    levels: ["IB", "A-Level", "University", "GCSE"],
    is_featured: false,
    is_verified: true,
    availability: "Fridays (13:00 - 18:00 UTC)",
  },
];

const defaultTestimonials: Testimonial[] = [
  {
    id: "test_1",
    name: "Sarah Jenkins",
    rating: 5,
    comment:
      "Dr. Sterling completely turned around my son's attitude towards calculus. He went from failing to getting an A in his IB exams!",
    role: "Parent of IB Student",
    is_featured: true,
  },
  {
    id: "test_2",
    name: "Liam O'Connor",
    rating: 5,
    comment:
      "The Computer Science tutoring from Marcus was incredible. His practical industry insights helped me secure a software engineering internship.",
    role: "University Sophomore",
    is_featured: true,
  },
  {
    id: "test_3",
    name: "Amira Patel",
    rating: 5,
    comment:
      "Tutors Link connected me with Sophia, who helped me raise my SAT Verbal score by 140 points in just six weeks. I'm so grateful!",
    role: "SAT Aspirant",
    is_featured: true,
  },
];

const defaultCMS: CMSContent = {
  homepage: {
    hero: {
      headline: "Unlock Your Academic Potential with Premier Private Tutors",
      subheadline:
        "Connect with certified Ivy League and Oxbridge tutors for personalized, high-impact learning. We help students achieve academic excellence through curated matching.",
      ctaPrimary: "Find the Perfect Tutor",
      ctaSecondary: "Apply as a Tutor",
    },
    stats: {
      tutors: 124,
      students: 1450,
      lessons: 9240,
      subjects: 45,
      rating: 4.9,
    },
  },
  about: {
    mission:
      "To democratize elite, bespoke education and bridge the gap between world-class educators and ambitious students globally.",
    vision:
      "To become the global standard for premium, high-trust academic mentorship and personal tutoring.",
    values: [
      {
        title: "Academic Rigor",
        description:
          "We hold our tutors and curriculum to the highest global educational standards.",
      },
      {
        title: "Personalized Care",
        description:
          "No two students learn the same way. We structure custom pathways for every mind.",
      },
      {
        title: "Uncompromising Integrity",
        description:
          "Clear, transparent communication, vetted safety, and professional excellence.",
      },
    ],
  },
  faqs: [
    {
      category: "General",
      question: "How does Tutors Link match students with tutors?",
      answer:
        "We analyze the student's subject requirements, academic level, timezone, and budget, then recommend 3 certified tutors who best fit their criteria. Our team also reviews each connection for optimal alignment.",
    },
    {
      category: "Billing",
      question: "How do payments and lesson scheduling work?",
      answer:
        "Once a tutor is assigned, lesson packages can be purchased. All payments are securely processed, and lessons are logged automatically. Remaining balance is tracked in the Student Portal in real-time.",
    },
    {
      category: "Tutors",
      question: "Are Tutors Link tutors fully vetted?",
      answer:
        "Absolutely. Every tutor undergoes a strict verification process, including identity verification, academic credential audits, a live teaching interview, and a background check.",
    },
  ],
};

const defaultSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English Literature",
  "Economics",
  "History",
];
const defaultLevels = [
  "Primary",
  "Secondary",
  "GCSE",
  "IGCSE",
  "A-Level",
  "IB",
  "SAT",
  "University",
  "Professional",
];

// 2. Local Storage Keys
const KEYS = {
  TUTORS: "tl_tutors",
  TESTIMONIALS: "tl_testimonials",
  CMS: "tl_cms",
  REVIEWS: "tl_reviews",
  APPLICATIONS: "tl_applications",
  RECRUITMENT: "tl_recruitment",
  ASSIGNMENTS: "tl_assignments",
  LESSONS: "tl_lessons",
  NOTIFICATIONS: "tl_notifications",
};

// Helper: Safely get from localStorage or fallback
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper: Safely set to localStorage
function setLocal(key: string, data: any) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage save error", e);
  }
}

// 3. API Data Service with Dual Supabase / Local Storage Fallback
export const DataStore = {
  // --- TUTORS ---
  getTutors: async (): Promise<Tutor[]> => {
    try {
      const { data: profiles, error: pErr } = await supabase.from("tutor_profiles").select(`
        id,
        about,
        headline,
        hourly_rate,
        is_active,
        is_featured,
        is_verified,
        languages,
        rating_avg,
        rating_count,
        timezone,
        years_experience
      `);

      if (!pErr && profiles && profiles.length > 0) {
        // We also need display name from profiles table
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url");
        const mapped = profiles.map((tp) => {
          const profile = profs?.find((p) => p.id === tp.id);
          return {
            id: tp.id,
            name: profile?.display_name || "Certified Tutor",
            avatar_url:
              profile?.avatar_url ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            headline: tp.headline || "Tutors Link Educator",
            about: tp.about || "",
            hourly_rate: tp.hourly_rate || 40,
            rating_avg: tp.rating_avg || 5.0,
            rating_count: tp.rating_count || 0,
            years_experience: tp.years_experience || 5,
            languages: tp.languages || ["English"],
            subjects: ["Mathematics"], // Default
            levels: ["High School"], // Default
            is_featured: tp.is_featured || false,
            is_verified: tp.is_verified || false,
            availability: "Flexible schedule (contact us)",
          } as Tutor;
        });
        return mapped;
      }
    } catch (e) {
      console.warn("Supabase tutor fetch failed, using localized data:", e);
    }
    return getLocal<Tutor[]>(KEYS.TUTORS, defaultTutors);
  },

  getTutorById: async (id: string): Promise<Tutor | null> => {
    const tutors = await DataStore.getTutors();
    return tutors.find((t) => t.id === id) || null;
  },

  saveTutor: async (tutor: Tutor): Promise<void> => {
    const tutors = await DataStore.getTutors();
    const idx = tutors.findIndex((t) => t.id === tutor.id);
    if (idx !== -1) tutors[idx] = tutor;
    else tutors.push(tutor);
    setLocal(KEYS.TUTORS, tutors);

    try {
      await supabase.from("tutor_profiles").upsert({
        id: tutor.id,
        about: tutor.about,
        headline: tutor.headline,
        hourly_rate: tutor.hourly_rate,
        is_featured: tutor.is_featured,
        is_verified: tutor.is_verified,
        languages: tutor.languages,
        years_experience: tutor.years_experience,
        timezone: "UTC",
      });
    } catch {}
  },

  // --- SUBJECTS & LEVELS ---
  getSubjects: async (): Promise<string[]> => {
    try {
      const { data } = await supabase.from("subjects").select("name");
      if (data && data.length > 0) return data.map((d) => d.name);
    } catch {}
    return defaultSubjects;
  },

  getLevels: async (): Promise<string[]> => {
    try {
      const { data } = await supabase.from("academic_levels").select("name");
      if (data && data.length > 0) return data.map((d) => d.name);
    } catch {}
    return defaultLevels;
  },

  // --- TESTIMONIALS ---
  getTestimonials: async (): Promise<Testimonial[]> => {
    return getLocal<Testimonial[]>(KEYS.TESTIMONIALS, defaultTestimonials);
  },

  saveTestimonial: async (test: Testimonial): Promise<void> => {
    const testimonials = await DataStore.getTestimonials();
    const idx = testimonials.findIndex((t) => t.id === test.id);
    if (idx !== -1) testimonials[idx] = test;
    else testimonials.push(test);
    setLocal(KEYS.TESTIMONIALS, testimonials);
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    const testimonials = await DataStore.getTestimonials();
    const filtered = testimonials.filter((t) => t.id !== id);
    setLocal(KEYS.TESTIMONIALS, filtered);
  },

  // --- CMS ---
  getCMS: async (): Promise<CMSContent> => {
    return getLocal<CMSContent>(KEYS.CMS, defaultCMS);
  },

  saveCMS: async (cms: CMSContent): Promise<void> => {
    setLocal(KEYS.CMS, cms);
  },

  // --- APPLICATIONS (TUTOR) ---
  submitTutorApplication: async (app: {
    name: string;
    email: string;
    phone: string;
    bio?: string;
    expected_rate?: number;
    subjects: string[];
    levels: string[];
    languages?: string[];
    years_experience?: number;
    cover_letter?: string;
    cv_name?: string;
    userId?: string;
  }) => {
    const id = "app_" + Math.random().toString(36).substr(2, 9);
    const newApp = {
      id,
      applicant_user_id: app.userId || null,
      full_name: app.name,
      email: app.email,
      phone: app.phone,
      subjects: app.subjects,
      levels: app.levels,
      languages: app.languages || ["English"],
      years_experience: app.years_experience || 0,
      cover_letter: app.cover_letter || app.bio || "",
      internal_notes: null as string | null,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reviewed_at: null as string | null,
      reviewed_by: null as string | null,
    };

    const list = getLocal<any[]>(KEYS.APPLICATIONS, []);
    list.push(newApp);
    setLocal(KEYS.APPLICATIONS, list);

    try {
      await supabase.from("tutor_applications").insert({
        applicant_user_id: app.userId || null,
        full_name: app.name,
        email: app.email,
        phone: app.phone,
        subjects: app.subjects,
        levels: app.levels,
        languages: app.languages || ["English"],
        years_experience: app.years_experience || 0,
        cover_letter: app.cover_letter || app.bio || "",
        status: "pending",
      });
    } catch {}

    return newApp;
  },

  submitContactInquiry: async (inquiry: {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    level?: string;
    tutor_id?: string;
    message: string;
  }) => {
    const id = "inquiry_" + Math.random().toString(36).substr(2, 9);
    const newInquiry = {
      id,
      ...inquiry,
      status: "new" as const,
      created_at: new Date().toISOString(),
    };

    const list = getLocal<any[]>("tl_contact_inquiries", []);
    list.push(newInquiry);
    setLocal("tl_contact_inquiries", list);

    return newInquiry;
  },

  getTutorApplications: async (): Promise<any[]> => {
    try {
      const { data } = await supabase.from("tutor_applications").select("*");
      if (data && data.length > 0) return data;
    } catch {}
    return getLocal<any[]>(KEYS.APPLICATIONS, []);
  },

  updateTutorApplicationStatus: async (
    id: string,
    status: "pending" | "under_review" | "approved" | "rejected",
    notes?: string,
  ) => {
    const list = getLocal<any[]>(KEYS.APPLICATIONS, []);
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (notes) list[idx].internal_notes = notes;
      setLocal(KEYS.APPLICATIONS, list);

      // If approved, create tutor profile and add tutor role to user!
      if (status === "approved" && list[idx].applicant_user_id) {
        const userId = list[idx].applicant_user_id;
        // Add "tutor" role to roles list
        await DataStore.assignUserRole(userId, "tutor");
        // Create profile
        await DataStore.saveTutor({
          id: userId,
          name: list[idx].full_name,
          avatar_url:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          headline: "Professional Educator",
          about: list[idx].cover_letter || "",
          hourly_rate: 45,
          rating_avg: 5.0,
          rating_count: 0,
          years_experience: list[idx].years_experience || 5,
          languages: list[idx].languages || ["English"],
          subjects: list[idx].subjects || [],
          levels: list[idx].levels || [],
          is_featured: false,
          is_verified: true,
          availability: "Available",
        });
      }
    }

    try {
      await supabase
        .from("tutor_applications")
        .update({
          status,
          internal_notes: notes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch {}
  },

  // --- RECRUITMENT APPLICATIONS ---
  submitRecruitmentApplication: async (app: {
    fullName: string;
    email: string;
    phone: string;
    roleAppliedFor: string;
    coverLetter: string;
    userId?: string;
  }) => {
    const id = "rec_" + Math.random().toString(36).substr(2, 9);
    const newApp = {
      id,
      applicant_user_id: app.userId || null,
      full_name: app.fullName,
      email: app.email,
      phone: app.phone,
      role_applied_for: app.roleAppliedFor,
      cover_letter: app.coverLetter,
      status: "pending" as const,
      created_at: new Date().toISOString(),
    };

    const list = getLocal<any[]>(KEYS.RECRUITMENT, []);
    list.push(newApp);
    setLocal(KEYS.RECRUITMENT, list);

    try {
      await supabase.from("recruitment_applications").insert({
        applicant_user_id: app.userId || null,
        full_name: app.fullName,
        email: app.email,
        phone: app.phone,
        role_applied_for: app.roleAppliedFor,
        cover_letter: app.coverLetter,
        status: "pending",
      });
    } catch {}

    return newApp;
  },

  getRecruitmentApplications: async (): Promise<any[]> => {
    try {
      const { data } = await supabase.from("recruitment_applications").select("*");
      if (data && data.length > 0) return data;
    } catch {}
    return getLocal<any[]>(KEYS.RECRUITMENT, []);
  },

  updateRecruitmentApplicationStatus: async (
    id: string,
    status: "pending" | "under_review" | "approved" | "rejected",
    notes?: string,
  ) => {
    const list = getLocal<any[]>(KEYS.RECRUITMENT, []);
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (notes) list[idx].internal_notes = notes;
      setLocal(KEYS.RECRUITMENT, list);

      // If approved, assign recruitment role
      if (status === "approved" && list[idx].applicant_user_id) {
        await DataStore.assignUserRole(list[idx].applicant_user_id, "recruitment");
      }
    }

    try {
      await supabase
        .from("recruitment_applications")
        .update({
          status,
          internal_notes: notes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch {}
  },

  // --- USER ROLES & PROFILES ---
  getUserRoles: async (userId: string): Promise<string[]> => {
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (data && data.length > 0) return data.map((d) => d.role);
    } catch {}

    // Local fallback
    const mockRoles = getLocal<Record<string, string[]>>("user_roles_map", {});
    return mockRoles[userId] || ["student"];
  },

  assignUserRole: async (userId: string, role: string): Promise<void> => {
    try {
      await supabase.from("user_roles").insert({
        user_id: userId,
        role: role as any,
      });
    } catch {}

    const mockRoles = getLocal<Record<string, string[]>>("user_roles_map", {});
    if (!mockRoles[userId]) mockRoles[userId] = ["student"];
    if (!mockRoles[userId].includes(role)) mockRoles[userId].push(role);
    setLocal("user_roles_map", mockRoles);
  },

  removeUserRole: async (userId: string, role: string): Promise<void> => {
    try {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    } catch {}

    const mockRoles = getLocal<Record<string, string[]>>("user_roles_map", {});
    if (mockRoles[userId]) {
      mockRoles[userId] = mockRoles[userId].filter((r) => r !== role);
      setLocal("user_roles_map", mockRoles);
    }
  },

  // --- STUDENT TUTOR ASSIGNMENTS & SCHEDULES ---
  getStudentAssignments: async (studentId: string): Promise<any[]> => {
    // Return tutors assigned to student
    const tutors = await DataStore.getTutors();
    const localAss = getLocal<any[]>(KEYS.ASSIGNMENTS, [
      {
        id: "ass_1",
        student_id: studentId,
        tutor_id: "tutor_1",
        remaining_classes: 8,
        is_active: true,
      },
      {
        id: "ass_2",
        student_id: studentId,
        tutor_id: "tutor_2",
        remaining_classes: 4,
        is_active: true,
      },
    ]);

    const studentAssignments = localAss.filter((a) => a.student_id === studentId && a.is_active);
    return studentAssignments.map((a) => {
      const tutor = tutors.find((t) => t.id === a.tutor_id);
      return {
        ...a,
        tutor: tutor || {
          name: "Unassigned Tutor",
          headline: "Professional Tutor",
          avatar_url:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          hourly_rate: 40,
          rating_avg: 5.0,
          rating_count: 0,
        },
      };
    });
  },

  getLessons: async (userId: string, isTutor = false): Promise<any[]> => {
    const tutors = await DataStore.getTutors();
    const localLessons = getLocal<any[]>(KEYS.LESSONS, [
      {
        id: "less_1",
        student_id: userId,
        tutor_id: "tutor_1",
        starts_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Tomorrow
        ends_at: new Date(Date.now() + 25 * 3600 * 1000).toISOString(),
        status: "scheduled",
        notes: "Introduction to Advanced Linear Algebra & Calculus",
        subject: "Mathematics",
      },
      {
        id: "less_2",
        student_id: userId,
        tutor_id: "tutor_2",
        starts_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // 2 days ago
        ends_at: new Date(Date.now() - 47 * 3600 * 1000).toISOString(),
        status: "completed",
        notes: "SAT Verbal Mock Test & Essay Revision",
        subject: "English Literature",
      },
    ]);

    const filtered = isTutor
      ? localLessons.filter((l) => l.tutor_id === userId)
      : localLessons.filter((l) => l.student_id === userId);

    return filtered.map((l) => {
      const tutor = tutors.find((t) => t.id === l.tutor_id);
      return {
        ...l,
        tutor_name: tutor?.name || "Dr. Alexander Sterling",
        tutor_avatar:
          tutor?.avatar_url ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      };
    });
  },

  scheduleLesson: async (lesson: {
    student_id: string;
    tutor_id: string;
    starts_at: string;
    ends_at: string;
    notes?: string;
    subject: string;
  }) => {
    const list = getLocal<any[]>(KEYS.LESSONS, []);
    const newLess = {
      id: "less_" + Math.random().toString(36).substr(2, 9),
      ...lesson,
      status: "scheduled",
    };
    list.push(newLess);
    setLocal(KEYS.LESSONS, list);
    return newLess;
  },

  // --- REVIEWS ---
  submitReview: async (review: {
    student_id: string;
    student_name: string;
    tutor_id: string;
    rating: number;
    comment: string;
  }) => {
    const list = getLocal<Review[]>(KEYS.REVIEWS, []);
    const newRev: Review = {
      id: "rev_" + Math.random().toString(36).substr(2, 9),
      student_name: review.student_name,
      rating: review.rating,
      comment: review.comment,
      created_at: new Date().toISOString(),
      tutor_id: review.tutor_id,
      status: "pending",
    };
    list.push(newRev);
    setLocal(KEYS.REVIEWS, list);

    try {
      await supabase.from("reviews").insert({
        student_id: review.student_id,
        tutor_id: review.tutor_id,
        rating: review.rating,
        comment: review.comment,
        status: "pending",
      });
    } catch {}

    return newRev;
  },

  getReviews: async (tutorId?: string): Promise<Review[]> => {
    const localRevs = getLocal<Review[]>(KEYS.REVIEWS, [
      {
        id: "rev_1",
        student_name: "Sarah Jenkins",
        rating: 5,
        comment: "Excellent explanation. Really helps build fundamental skills.",
        created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        tutor_id: "tutor_1",
        status: "approved",
      },
    ]);
    if (tutorId) return localRevs.filter((r) => r.tutor_id === tutorId && r.status === "approved");
    return localRevs;
  },

  updateReviewStatus: async (id: string, status: "pending" | "approved" | "rejected") => {
    const list = getLocal<Review[]>(KEYS.REVIEWS, []);
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      setLocal(KEYS.REVIEWS, list);
    }
  },

  // --- AUDIT LOGS ---
  logAction: async (action: string, actorId: string | null, details: any) => {
    const list = getLocal<any[]>("tl_audit_logs", []);
    list.push({
      id: "audit_" + Math.random().toString(36).substr(2, 9),
      action,
      actor_id: actorId,
      metadata: details,
      created_at: new Date().toISOString(),
    });
    setLocal("tl_audit_logs", list);

    try {
      await supabase.from("audit_log").insert({
        action,
        actor_id: actorId,
        metadata: details,
      });
    } catch {}
  },

  getAuditLogs: async (): Promise<any[]> => {
    return getLocal<any[]>("tl_audit_logs", []);
  },
};
