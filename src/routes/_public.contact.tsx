import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  AlertCircle,
  Send,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { DataStore, Tutor, CMSContent } from "@/lib/data-store";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us · Tutors Link" },
      {
        name: "description",
        content:
          "Get in touch with the Tutors Link academic advisory desk or inquire about specific tutor booking packages.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tutorId: (search.tutorId as string) || undefined,
    };
  },
  component: ContactPage,
});

function ContactPage() {
  const searchParams = useSearch({ from: "/_public/contact" });
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    level: "",
    tutorId: searchParams.tutorId || "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [tList, cmsData] = await Promise.all([DataStore.getTutors(), DataStore.getCMS()]);
      setTutors(tList);
      setCms(cmsData);
    })();
  }, []);

  useEffect(() => {
    if (searchParams.tutorId) {
      setFormData((prev) => ({ ...prev, tutorId: searchParams.tutorId }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError("Please fill out all required contact fields.");
      return;
    }

    setLoading(true);
    try {
      await DataStore.submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || "General Academic",
        level: formData.level || "General",
        tutor_id: formData.tutorId,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        level: "",
        tutorId: "General Inquiry",
        message: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred while submitting your inquiry.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Intro */}
      <section className="bg-slate-50 dark:bg-slate-900/10 py-12 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground text-sm max-w-xl mt-1">
            Need help matching with the perfect tutor, or want to discuss syllabus pack
            configurations? Our advisory desk is here to guide you.
          </p>
        </div>
      </section>

      {/* Main Grid split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
        {/* Left Columns - Info & FAQ (5 columns) */}
        <aside className="lg:col-span-5 space-y-8">
          {/* Direct Support Details */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-lg">Direct Advisory Desk</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              We respond to all verified emails and dashboard messages within 24 business hours.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <a
                  href="mailto:support@tutorslink.me"
                  className="text-slate-200 hover:text-white transition-colors"
                >
                  support@tutorslink.me
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-slate-200">+1 (800) 555-TLINK</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-slate-200">London • New York • Global Operations</span>
              </div>
            </div>
          </div>

          {/* Interactive Map placeholder card */}
          <Card className="rounded-2xl border-border/80 bg-background overflow-hidden p-0 relative h-48 shadow-sm">
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
              <MapPin className="h-8 w-8 text-blue-600 animate-bounce mb-2" />
              <h4 className="font-bold text-sm">Global Operations Desk</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                VBS Digital Classroom servers hosted in US & Western Europe
              </p>
            </div>
          </Card>

          {/* Frequently Asked Questions */}
          {cms && (
            <div className="space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" /> Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {cms.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="text-sm font-bold text-left hover:text-blue-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </aside>

        {/* Right Columns - Form (7 columns) */}
        <main className="lg:col-span-7">
          {success ? (
            <div className="bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/15 dark:border-emerald-900/40 p-8 rounded-2xl text-center space-y-4 shadow-sm h-full flex flex-col justify-center items-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                  Inquiry Received Successfully
                </h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  Thank you for contacting Tutors Link. Our Academic Advisory Desk has received your
                  lesson package inquiry. An advisor will contact you by email or phone within 12
                  hours with customized tutor recommendations.
                </p>
              </div>
              <Button
                onClick={() => setSuccess(false)}
                variant="outline"
                className="text-xs h-9 rounded-xl"
              >
                Submit Another Inquiry
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-background border border-border/80 p-6 md:p-8 rounded-2xl shadow-sm space-y-5"
            >
              <h2 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800/60 pb-3">
                Lesson Inquiry & Booking Form
              </h2>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs flex gap-2 items-start">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Incomplete Fields</p>
                    <p className="mt-0.5 opacity-90">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Richard Nixon"
                    className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. richard@nixon.edu"
                    className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +44 7911 123456"
                    className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Tutor Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Select Desired Tutor
                  </label>
                  <select
                    name="tutorId"
                    value={formData.tutorId}
                    onChange={handleChange}
                    className="w-full bg-background border border-border/80 rounded-xl px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="General Inquiry">General Consultation (Match Me)</option>
                    {tutors.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (${t.hourly_rate}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Academic Subject
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Biology, Pure Physics, History"
                    className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Academic Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Academic Level
                  </label>
                  <Input
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    placeholder="e.g. A-Level, GCSE, SAT, University"
                    className="rounded-xl h-10 border-border/80 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Message / Inquiry Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Specify learning goals, past grade levels, syllabus details, exam boards, and requested timings..."
                  className="w-full bg-background border border-border/80 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Lesson Inquiry
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
