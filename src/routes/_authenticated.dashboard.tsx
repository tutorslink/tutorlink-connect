import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Users,
  Calendar,
  Clock,
  Star,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  Layout,
  MessageSquare,
  HelpCircle,
  Settings,
  Edit,
  Sliders,
} from "lucide-react";
import {
  DataStore,
  Tutor,
  CMSContent,
  TutorApplication,
  LessonLog,
  AssignedTutor,
} from "@/lib/data-store";

type Role = "student" | "tutor" | "recruitment" | "website_manager" | "owner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard · Tutors Link" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [profile, setProfile] = useState<{
    id: string;
    display_name: string | null;
    email: string | null;
  } | null>(null);

  // Active Tab State (will adapt based on primary role)
  const [activeTab, setActiveTab] = useState<string>("");

  // Common Data States
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [allApplications, setAllApplications] = useState<TutorApplication[]>([]);

  // Student Portal Specifics
  const [studentLessons, setStudentLessons] = useState<LessonLog[]>([]);
  const [studentTutors, setStudentTutors] = useState<AssignedTutor[]>([]);
  const [newLog, setNewLog] = useState({
    tutorId: "",
    hours: "1.5",
    feedback: "",
    rating: 5,
    subject: "",
  });
  const [loggingSuccess, setLoggingSuccess] = useState(false);

  // CMS Editor Specifics
  const [cmsHeadline, setCmsHeadline] = useState("");
  const [cmsSubheadline, setCmsSubheadline] = useState("");
  const [cmsStatTutors, setCmsStatTutors] = useState(0);
  const [cmsStatStudents, setCmsStatStudents] = useState(0);
  const [cmsStatLessons, setCmsStatLessons] = useState(0);
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });

  // Recruitment desk specifics
  const [selectedApplication, setSelectedApplication] = useState<TutorApplication | null>(null);
  const [recruitmentNote, setRecruitmentNote] = useState("");

  const [loading, setLoading] = useState(true);

  // Core Data Fetcher
  const fetchDashboardData = async (userId: string) => {
    try {
      const [cmsData, tutorsData, appsData, lessonsData, assignedTutorsData] = await Promise.all([
        DataStore.getCMS(),
        DataStore.getTutors(),
        DataStore.getTutorApplications(),
        DataStore.getStudentLessons(userId),
        DataStore.getStudentAssignedTutors(userId),
      ]);

      setCms(cmsData);
      setTutors(tutorsData);
      setAllApplications(appsData);
      setStudentLessons(lessonsData);
      setStudentTutors(assignedTutorsData);

      // Initialize CMS fields
      if (cmsData) {
        setCmsHeadline(cmsData.homepage.hero.headline);
        setCmsSubheadline(cmsData.homepage.hero.subheadline);
        setCmsStatTutors(cmsData.homepage.stats.tutors);
        setCmsStatStudents(cmsData.homepage.stats.students);
        setCmsStatLessons(cmsData.homepage.stats.lessons);
      }
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        navigate({ to: "/auth" });
        return;
      }

      const [{ data: r }, { data: p }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("profiles").select("id,display_name,email").eq("id", uid).maybeSingle(),
      ]);

      const parsedRoles = (r ?? []).map((x) => x.role as Role);
      setRoles(parsedRoles);

      const userProfile = p ? { id: p.id, display_name: p.display_name, email: p.email } : null;
      setProfile(userProfile);

      // Set default tab based on user's highest privilege role
      if (parsedRoles.includes("owner")) {
        setActiveTab("student");
      } else if (parsedRoles.includes("website_manager")) {
        setActiveTab("cms");
      } else if (parsedRoles.includes("recruitment")) {
        setActiveTab("recruitment");
      } else if (parsedRoles.includes("tutor")) {
        setActiveTab("tutor");
      } else {
        setActiveTab("student"); // default to student
      }

      if (uid) {
        await fetchDashboardData(uid);
      }
      setLoading(false);
    })();
  }, [navigate]);

  // Handle New Lesson Log Submit
  const handleLogLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!newLog.tutorId || !newLog.hours || !newLog.subject) {
      alert("Please select a tutor, input lesson hours, and specify the subject.");
      return;
    }

    const tutorObj = tutors.find((t) => t.id === newLog.tutorId);
    const tutorName = tutorObj ? tutorObj.name : "Private Tutor";

    await DataStore.logStudentLesson({
      student_id: profile.id,
      tutor_id: newLog.tutorId,
      tutor_name: tutorName,
      subject: newLog.subject,
      hours: Number(newLog.hours) || 1,
      rating: newLog.rating,
      feedback: newLog.feedback,
    });

    // Refresh
    const freshLessons = await DataStore.getStudentLessons(profile.id);
    setStudentLessons(freshLessons);
    setNewLog({
      tutorId: "",
      hours: "1.5",
      feedback: "",
      rating: 5,
      subject: "",
    });
    setLoggingSuccess(true);
    setTimeout(() => setLoggingSuccess(false), 3000);
  };

  // Handle CMS Metadata Save
  const handleSaveCMSHero = async () => {
    if (!cms) return;
    const updatedCMS = { ...cms };
    updatedCMS.homepage.hero.headline = cmsHeadline;
    updatedCMS.homepage.hero.subheadline = cmsSubheadline;
    updatedCMS.homepage.stats.tutors = cmsStatTutors;
    updatedCMS.homepage.stats.students = cmsStatStudents;
    updatedCMS.homepage.stats.lessons = cmsStatLessons;

    await DataStore.saveCMS(updatedCMS);
    setCms(updatedCMS);
    alert("Homepage CMS parameters updated and persisted successfully!");
  };

  // Add FAQ to CMS
  const handleAddFaq = async () => {
    if (!cms || !newFaq.q || !newFaq.a) return;
    const updatedCMS = { ...cms };
    updatedCMS.faqs.push({ question: newFaq.q, answer: newFaq.a });

    await DataStore.saveCMS(updatedCMS);
    setCms(updatedCMS);
    setNewFaq({ q: "", a: "" });
    alert("New FAQ accordion item appended successfully!");
  };

  // Delete FAQ from CMS
  const handleDeleteFaq = async (index: number) => {
    if (!cms) return;
    const updatedCMS = { ...cms };
    updatedCMS.faqs.splice(index, 1);

    await DataStore.saveCMS(updatedCMS);
    setCms(updatedCMS);
    alert("FAQ accordion item removed successfully!");
  };

  // Handle application update
  const handleUpdateApplicationStatus = async (appId: string, status: string) => {
    await DataStore.updateApplicationStatus(appId, status, recruitmentNote);
    const freshApps = await DataStore.getTutorApplications();
    setAllApplications(freshApps);
    setSelectedApplication(null);
    setRecruitmentNote("");
    alert(`Application status updated to "${status}" with logged reviewer comments.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Calculate student statistics
  const totalLessonsHours = studentLessons.reduce((acc, l) => acc + l.hours, 0);
  const avgRatingGiven = studentLessons.length
    ? (studentLessons.reduce((acc, l) => acc + l.rating, 0) / studentLessons.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-8 selection:bg-blue-100 selection:text-blue-950">
      {/* Welcome & Role Flags */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-border/80">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome Back, {profile?.display_name || "Scholar"}
          </h1>
          <p className="text-muted-foreground text-sm">{profile?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Active Credentials:
          </span>
          {roles.map((r) => (
            <Badge
              key={r}
              className="bg-blue-600 hover:bg-blue-700 text-white capitalize text-xs rounded-lg px-2.5 py-0.5"
            >
              {r.replace("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs navigation list */}
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 overflow-x-auto">
        {(roles.includes("student") || roles.includes("owner")) && (
          <button
            onClick={() => setActiveTab("student")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "student"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground dark:hover:bg-slate-900"
            }`}
          >
            My Student Portal
          </button>
        )}

        {(roles.includes("recruitment") || roles.includes("owner")) && (
          <button
            onClick={() => setActiveTab("recruitment")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "recruitment"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground dark:hover:bg-slate-900"
            }`}
          >
            Recruitment Vetting Desk
          </button>
        )}

        {(roles.includes("website_manager") || roles.includes("owner")) && (
          <button
            onClick={() => setActiveTab("cms")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "cms"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground dark:hover:bg-slate-900"
            }`}
          >
            CMS Portal
          </button>
        )}
      </div>

      {/* ==================== 1. STUDENT PORTAL TAB ==================== */}
      {activeTab === "student" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="rounded-2xl border-border/80 shadow-sm p-5 flex items-center gap-4 bg-background">
              <div className="h-11 w-11 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Completed Classes
                </span>
                <strong className="text-2xl font-black">{studentLessons.length} sessions</strong>
              </div>
            </Card>

            <Card className="rounded-2xl border-border/80 shadow-sm p-5 flex items-center gap-4 bg-background">
              <div className="h-11 w-11 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Hours Completed
                </span>
                <strong className="text-2xl font-black">{totalLessonsHours} hrs</strong>
              </div>
            </Card>

            <Card className="rounded-2xl border-border/80 shadow-sm p-5 flex items-center gap-4 bg-background">
              <div className="h-11 w-11 bg-amber-50 text-amber-500 dark:bg-amber-950/20 rounded-xl flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 fill-amber-500" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Avg Rating Logged
                </span>
                <strong className="text-2xl font-black">{avgRatingGiven} / 5.0</strong>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Logs & Assigned Tutors (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Assigned Tutor Roster */}
              <Card className="rounded-2xl border-border/80 bg-background shadow-sm overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" /> Vetted Tutor Roster
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Your assigned academic advisors and classroom mentors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {studentTutors.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No tutors are currently assigned to your study planner. Please find a tutor to
                      book.
                    </div>
                  ) : (
                    studentTutors.map((st) => (
                      <div
                        key={st.id}
                        className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 border border-border/50 rounded-xl hover:bg-slate-50/30"
                      >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                          <img
                            src={st.avatar_url}
                            alt={st.name}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-100"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {st.name}
                            </h4>
                            <p className="text-xs text-blue-600 font-semibold">
                              {st.subjects.join(", ")}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Joined Tutors Link: {new Date(st.assigned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-center sm:text-right shrink-0">
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                          >
                            {st.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            Rate: {st.rate_agreed}/hr
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Lesson Logs History */}
              <Card className="rounded-2xl border-border/80 bg-background shadow-sm">
                <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" /> Tuition Attendance logs
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Completed hour logs, performance stars, and student feedback registers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {studentLessons.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No attendance logs recorded yet. Complete a class and fill out the session
                      logger to update metrics.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentLessons.map((l) => (
                        <div
                          key={l.id}
                          className="p-4 border border-border/50 rounded-xl space-y-2"
                        >
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <div>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                {l.tutor_name}
                              </h4>
                              <p className="text-xs font-semibold text-blue-600">{l.subject}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                {l.hours} hours
                              </Badge>
                              <div className="flex gap-0.5 text-amber-500 shrink-0">
                                {[...Array(l.rating)].map((_, i) => (
                                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                                ))}
                              </div>
                            </div>
                          </div>
                          {l.feedback && (
                            <p className="text-xs text-muted-foreground italic pl-3 border-l-2 border-slate-200">
                              "{l.feedback}"
                            </p>
                          )}
                          <div className="text-[10px] text-muted-foreground text-right">
                            Logged: {new Date(l.logged_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Interactive Log Form (4 columns) */}
            <div className="lg:col-span-4">
              <Card className="rounded-2xl border-border/80 bg-background shadow-sm p-5 space-y-4 sticky top-20">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" /> Session Logger
                </h3>
                <p className="text-xs text-muted-foreground">
                  Logged classes immediately update completed metrics, payment reports, and tutor
                  statistics.
                </p>

                <hr className="border-border/60" />

                {loggingSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex gap-2 items-start animate-in fade-in">
                    <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>Lesson logged and ratings successfully aggregated!</span>
                  </div>
                )}

                <form onSubmit={handleLogLesson} className="space-y-4 text-xs">
                  {/* Select Tutor */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Academic Tutor
                    </label>
                    <select
                      value={newLog.tutorId}
                      onChange={(e) => setNewLog((prev) => ({ ...prev, tutorId: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-2.5 h-9 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">-- Choose Tutor --</option>
                      {tutors.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Academic Subject
                    </label>
                    <Input
                      value={newLog.subject}
                      onChange={(e) => setNewLog((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g. A-Level Pure Physics"
                      className="rounded-xl h-9 border-border/80"
                    />
                  </div>

                  {/* Lesson Duration */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Tuition Hours
                    </label>
                    <select
                      value={newLog.hours}
                      onChange={(e) => setNewLog((prev) => ({ ...prev, hours: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-2.5 h-9 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="1.0">1.0 Hour</option>
                      <option value="1.5">1.5 Hours</option>
                      <option value="2.0">2.0 Hours</option>
                      <option value="2.5">2.5 Hours</option>
                      <option value="3.0">3.0 Hours</option>
                    </select>
                  </div>

                  {/* Feedback rating */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Tutor Star Rating
                    </label>
                    <select
                      value={newLog.rating}
                      onChange={(e) =>
                        setNewLog((prev) => ({ ...prev, rating: Number(e.target.value) }))
                      }
                      className="w-full bg-background border border-border rounded-xl px-2.5 h-9 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                      <option value={3}>⭐⭐⭐ (Average)</option>
                      <option value={2}>⭐⭐ (Needs Improvement)</option>
                      <option value={1}>⭐ (Poor)</option>
                    </select>
                  </div>

                  {/* Feedback text */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Lesson Feedback / Comments
                    </label>
                    <textarea
                      value={newLog.feedback}
                      onChange={(e) => setNewLog((prev) => ({ ...prev, feedback: e.target.value }))}
                      rows={3}
                      placeholder="Explain learning progress, syllabus accomplishments, or homework set..."
                      className="w-full bg-background border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 font-semibold text-xs mt-2"
                  >
                    Submit Attendance Log
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. RECRUITMENT DESK TAB ==================== */}
      {activeTab === "recruitment" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-150">
          {/* Applications Listing List (Left - 7 columns) */}
          <main className="lg:col-span-7 space-y-6">
            <Card className="rounded-2xl border-border/80 bg-background shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" /> Registered Applications (
                  {allApplications.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Review applicant resumes, expected rates, and move them through the evaluation
                  funnel.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 divide-y divide-slate-100 dark:divide-slate-800">
                {allApplications.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    No active educator registrations submitted yet.
                  </div>
                ) : (
                  allApplications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedApplication(app);
                        setRecruitmentNote(app.reviewer_notes || "");
                      }}
                      className={`py-4 flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/20 px-3 rounded-xl transition-colors ${
                        selectedApplication?.id === app.id
                          ? "bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/40"
                          : ""
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {app.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {app.email} • Exp: {app.years_experience} Yrs
                        </p>
                        <p className="text-[10px] text-blue-600 font-semibold truncate max-w-sm">
                          Subjects: {app.subjects.join(", ")}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === "Approved"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/20"
                              : app.status === "Rejected"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/20"
                                : app.status === "Interviewing"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {app.status}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          ${app.expected_rate}/hr expected
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </main>

          {/* Detailed Reviewer Panel Right (5 columns) */}
          <aside className="lg:col-span-5">
            {selectedApplication ? (
              <Card className="rounded-2xl border-blue-200 dark:border-slate-800 bg-background shadow-lg p-6 space-y-5 sticky top-20">
                <div className="space-y-2">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full text-[10px] font-bold">
                    Vetting Funnel
                  </Badge>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                    {selectedApplication.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Registered: {new Date(selectedApplication.created_at).toLocaleString()}
                  </p>
                </div>

                <hr className="border-border/60" />

                <div className="space-y-3.5 text-xs leading-relaxed text-muted-foreground">
                  <p>
                    <strong>Email:</strong>{" "}
                    <span className="text-foreground">{selectedApplication.email}</span>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <span className="text-foreground">{selectedApplication.phone}</span>
                  </p>
                  <p>
                    <strong>Expected Rate:</strong>{" "}
                    <span className="text-foreground">${selectedApplication.expected_rate}/hr</span>
                  </p>
                  <p>
                    <strong>Years Experience:</strong>{" "}
                    <span className="text-foreground">
                      {selectedApplication.years_experience} years
                    </span>
                  </p>
                  <p>
                    <strong>Subjects Taught:</strong>{" "}
                    <span className="text-blue-600 font-semibold">
                      {selectedApplication.subjects.join(", ")}
                    </span>
                  </p>
                  <p>
                    <strong>Academic Levels:</strong>{" "}
                    <span className="text-foreground">{selectedApplication.levels.join(", ")}</span>
                  </p>
                  {selectedApplication.bio && (
                    <p className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-border/40 italic">
                      " {selectedApplication.bio} "
                    </p>
                  )}
                  <p className="flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>
                      Uploaded Resume CV:{" "}
                      <strong className="text-foreground">{selectedApplication.cv_name}</strong>
                    </span>
                  </p>
                </div>

                <hr className="border-border/60" />

                {/* Status Update Form */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Internal Reviewer Notes
                    </label>
                    <textarea
                      value={recruitmentNote}
                      onChange={(e) => setRecruitmentNote(e.target.value)}
                      rows={3}
                      placeholder="Add assessment highlights, mock demo score, CV credentials verification remarks..."
                      className="w-full bg-background border border-border/80 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() =>
                        handleUpdateApplicationStatus(selectedApplication.id, "Interviewing")
                      }
                      className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-9 font-semibold text-[11px]"
                    >
                      Call Interview
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateApplicationStatus(selectedApplication.id, "Auditing")
                      }
                      variant="outline"
                      className="rounded-xl h-9 font-semibold text-[11px]"
                    >
                      Audit Credentials
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateApplicationStatus(selectedApplication.id, "Approved")
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 font-semibold text-[11px]"
                    >
                      Approve & Vette
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateApplicationStatus(selectedApplication.id, "Rejected")
                      }
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/5 border border-destructive/10 rounded-xl h-9 font-semibold text-[11px]"
                    >
                      Reject Application
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-20 bg-slate-50/40 border border-dashed border-border rounded-2xl text-muted-foreground text-sm space-y-2 sticky top-20">
                <Users className="h-8 w-8 text-slate-300 mx-auto" />
                <p>
                  Select an applicant on the left to review resume qualifications and log Vetting
                  results.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ==================== 3. CMS / PORTAL CONTENT TAB ==================== */}
      {activeTab === "cms" && cms && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-150">
          {/* Landing page editor (Left - 7 columns) */}
          <main className="lg:col-span-7 space-y-6">
            <Card className="rounded-2xl border-border/80 bg-background shadow-sm p-5 space-y-5">
              <h3 className="font-bold text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layout className="h-5 w-5 text-blue-600" /> Homepage Copywriting & CMS
              </h3>

              <div className="space-y-4 text-xs">
                {/* Headline input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                    Hero Headline
                  </label>
                  <Input
                    value={cmsHeadline}
                    onChange={(e) => setCmsHeadline(e.target.value)}
                    className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500 text-sm font-semibold"
                  />
                </div>

                {/* Subheadline input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                    Hero Subheadline
                  </label>
                  <textarea
                    value={cmsSubheadline}
                    onChange={(e) => setCmsSubheadline(e.target.value)}
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                  {/* Tutors Stat */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Total Tutors
                    </label>
                    <Input
                      type="number"
                      value={cmsStatTutors}
                      onChange={(e) => setCmsStatTutors(Number(e.target.value))}
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>

                  {/* Students Stat */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Total Students
                    </label>
                    <Input
                      type="number"
                      value={cmsStatStudents}
                      onChange={(e) => setCmsStatStudents(Number(e.target.value))}
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>

                  {/* Lessons Stat */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                      Lessons Logged
                    </label>
                    <Input
                      type="number"
                      value={cmsStatLessons}
                      onChange={(e) => setCmsStatLessons(Number(e.target.value))}
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSaveCMSHero}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-10 flex items-center gap-2"
                  >
                    <Save className="h-4.5 w-4.5" /> Save Copywriting Changes
                  </Button>
                </div>
              </div>
            </Card>
          </main>

          {/* Accordion FAQ Manager (Right - 5 columns) */}
          <aside className="lg:col-span-5 space-y-6">
            {/* FAQ Add Form */}
            <Card className="rounded-2xl border-border/80 bg-background shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" /> FAQ Registry Panel
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                    Accordion Question
                  </label>
                  <Input
                    value={newFaq.q}
                    onChange={(e) => setNewFaq((prev) => ({ ...prev, q: e.target.value }))}
                    placeholder="e.g. Can I cancel a booked tuition package?"
                    className="rounded-xl h-9 border-border/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                    Answer Explanation
                  </label>
                  <textarea
                    value={newFaq.a}
                    onChange={(e) => setNewFaq((prev) => ({ ...prev, a: e.target.value }))}
                    rows={3}
                    placeholder="Specify the terms, support email addresses, refund guidelines..."
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <Button
                  onClick={handleAddFaq}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-9 flex items-center justify-center gap-2"
                >
                  <Plus className="h-4.5 w-4.5" /> Append FAQ Item
                </Button>
              </div>
            </Card>

            {/* List and Delete FAQs */}
            <Card className="rounded-2xl border-border/80 bg-background shadow-sm overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base font-bold">
                  Active FAQ Items ({cms.faqs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                {cms.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border/40 text-xs"
                  >
                    <div className="space-y-1">
                      <strong className="text-slate-800 dark:text-slate-200 block">
                        {faq.question}
                      </strong>
                      <p className="text-muted-foreground font-normal line-clamp-2">{faq.answer}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFaq(index)}
                      className="text-destructive hover:bg-red-50 p-1.5 rounded-lg shrink-0"
                      title="Delete FAQ Accordion"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
