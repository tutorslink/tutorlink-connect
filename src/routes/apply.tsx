import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { CheckCircle, UploadCloud, FileText, AlertCircle, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIChatbot } from "@/components/AIChatbot";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply as a Tutor · Tutors Link" },
      {
        name: "description",
        content:
          "Join our elite community of private tutors. Earn competitive rates, enjoy flexible schedules, and teach passionate students.",
      },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    rate: "",
    subjects: "",
    levels: "",
    experience: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".docx")
      ) {
        setCvFile(file);
      } else {
        setError("Only PDF or DOCX resume formats are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.subjects ||
      !formData.levels ||
      !formData.experience
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!cvFile) {
      setError("Please upload your CV/Resume to complete your application verification.");
      return;
    }

    setLoading(true);
    try {
      await DataStore.submitTutorApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        expected_rate: Number(formData.rate) || 45,
        subjects: formData.subjects.split(",").map((s) => s.trim()),
        levels: formData.levels.split(",").map((l) => l.trim()),
        years_experience: Number(formData.experience) || 1,
        cv_name: cvFile.name,
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        bio: "",
        rate: "",
        subjects: "",
        levels: "",
        experience: "",
      });
      setCvFile(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred while submitting your application.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Intro */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 text-xs font-semibold border border-blue-100/30">
            <Sparkles className="h-3.5 w-3.5" /> Empowering the Next Generation of Scholars
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Apply as a Private Tutor</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Become part of our elite community of private tutors. Share your academic excellence,
            earn competitive flexible rates, and inspire scholars globally.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/15 dark:border-emerald-900/40 p-8 rounded-2xl text-center space-y-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                Application Received Successfully
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you for applying to Tutors Link. Our Academic Vetting Panel will review your
                credentials, biography, and experience. We will get in touch via email or phone
                within 48 hours to schedule your live online teaching interview.
              </p>
            </div>
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="text-xs h-9 rounded-xl"
            >
              Submit Another Application
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-background border border-border/80 p-6 md:p-8 rounded-2xl shadow-sm space-y-6"
          >
            <h2 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800/60 pb-3">
              Tutor Registration Form
            </h2>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs flex gap-2 items-start animate-in fade-in">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Incomplete Form</p>
                  <p className="mt-0.5 opacity-90">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Catherine Vance"
                  className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. catherine.v@university.edu"
                  className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                />
              </div>

              {/* Years of Experience */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Years of Teaching Experience <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                />
              </div>

              {/* Expected Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Expected Hourly Rate ($) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  placeholder="e.g. 55"
                  className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                />
              </div>

              {/* Subjects */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Subjects Taught (comma separated) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="e.g. Pure Mathematics, Calculus, Statistics"
                  className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            {/* Academic Levels Taught */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Academic Levels Covered (comma separated) <span className="text-red-500">*</span>
              </label>
              <Input
                name="levels"
                value={formData.levels}
                onChange={handleChange}
                placeholder="e.g. GCSE, A-Level, SAT, University"
                className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
              />
            </div>

            {/* Biography */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Professional Biography / Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Briefly tell us about your educational background, degrees, certifications, and teaching approach..."
                className="w-full bg-background border border-border/80 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* CV Drag-and-Drop file uploader */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Upload CV / Resume (PDF or DOCX) <span className="text-red-500">*</span>
              </label>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center space-y-2.5 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/30"
                    : cvFile
                      ? "border-emerald-300 bg-emerald-50/10"
                      : "border-border hover:border-blue-400 hover:bg-slate-50/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {cvFile ? (
                  <div className="space-y-1.5">
                    <FileText className="h-10 w-10 text-emerald-500 mx-auto" />
                    <p className="text-sm font-semibold">{cvFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <UploadCloud className="h-10 w-10 text-blue-500 mx-auto" />
                    <p className="text-sm font-semibold">
                      Drag & drop your resume here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports standard PDF or Word (.docx) formats up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Academic Application
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}
