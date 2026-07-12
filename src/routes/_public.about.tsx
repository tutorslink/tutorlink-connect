import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, HeartHandshake, Award, Sparkles, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: "About Us · Premium Tutoring Pillars · Tutors Link" },
      {
        name: "description",
        content:
          "Learn about the mission, values, vision, and core academic pillars (academic rigor, personalized pathways, safety, and trust) of Tutors Link.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const pillars = [
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Academic Rigor",
      desc: "All tutors undergo systematic qualifications auditing, academic credential verification, and mock online teaching evaluations. We accept less than 5% of all applicants.",
    },
    {
      icon: <HeartHandshake className="h-6 w-6 text-indigo-600" />,
      title: "Personalized Pathways",
      desc: "No two minds are identical. We work closely with students to assess current syllabus standing, target examinations boards, and design personalized high-impact tutoring paths.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: "Safety & Platform Trust",
      desc: "All session schedules, communications, and package payments are securely routed and logged, guaranteeing complete security and peace of mind for parents and students.",
    },
  ];

  return (
    <>
      {/* Hero Header */}
      <section className="bg-slate-50 dark:bg-slate-900/10 py-16 md:py-24 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 text-xs font-semibold border border-blue-100/30">
            <Sparkles className="h-3.5 w-3.5" /> Est. 2024 • Academic Leaders
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Our Mission & Vision
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Tutors Link was founded with a singular, clear vision: to democratize access to elite
            personalized education. We connect ambition-driven students with world-class tutors to
            unlock true academic potential.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            The Three Academic Pillars of Tutors Link
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Our educational framework is anchored upon strict values of rigor, personalization, and
            parent trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, idx) => (
            <Card
              key={idx}
              className="rounded-2xl border-border/80 bg-background p-6 space-y-4 shadow-sm"
            >
              <div className="bg-slate-50 dark:bg-slate-900 h-12 w-12 rounded-xl flex items-center justify-center border border-border/40">
                {p.icon}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{p.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission statement details block */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Unlocking Potential, One Lesson at a Time</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              At Tutors Link, we believe true academic success is more than just memorizing syllabi
              and achieving straight As. True learning occurs when an inspiring tutor instills
              analytical curiosity, exam confidence, and durable study methodologies.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We vet every single educator to ensure they are not only subject-matter experts, but
              are also engaging communicators capable of breaking complex academic concepts into
              digestible steps.
            </p>
          </div>
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl space-y-4">
            <GraduationCap className="h-10 w-10 text-white" />
            <h3 className="text-lg font-bold">Our Ultimate Vision</h3>
            <p className="text-sm text-white/80 leading-relaxed italic">
              "To become the world's most trusted, secure, and rigorous educational marketplace,
              nurturing the scholars, doctors, and innovators of tomorrow."
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
