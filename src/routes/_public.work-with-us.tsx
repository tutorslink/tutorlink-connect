import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Clock,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Star,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_public/work-with-us")({
  head: () => ({
    meta: [
      { title: "Work With Us · Educator Recruitment · Tutors Link" },
      {
        name: "description",
        content:
          "Teach with Tutors Link. Share your expertise, inspire bright minds, set your own hourly rates, and enjoy flexible hours on our platform.",
      },
    ],
  }),
  component: WorkWithUsPage,
});

function WorkWithUsPage() {
  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
      title: "Competitive Earnings",
      desc: "Set your own hourly tuition rates (average $40-$80/hr) based on your educational pedigree and receive secure weekly direct-deposit payouts.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Complete Flexibility",
      desc: "Manage your own hours, synchronize sessions around your schedule, and teach from anywhere in the world with our interactive video panel.",
    },
    {
      icon: <Award className="h-6 w-6 text-purple-600" />,
      title: "Elite Academic Pedigree",
      desc: "Join a prestigious community of PhD candidates, Ivy League graduates, Oxbridge scholars, and certified curriculum examers.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
      title: "Bespoke Administrative Support",
      desc: "Our dedicated matching desk handles invoicing, student scheduling conflicts, calendar integrations, and resources so you focus purely on teaching.",
    },
  ];

  const requirements = [
    "A bachelor's degree or higher from a top-tier accredited university.",
    "Prior formal teaching, lecturing, or high-level academic tutoring experience.",
    "Comprehensive familiarity with specific curricula (such as GCSE, A-Levels, SAT, AP, IB, or University standards).",
    "A reliable high-speed internet connection, quiet teaching room, webcam, and clear microphone.",
    "Pass a standard background check and identity credential audit.",
  ];

  const recruitmentFaqs = [
    {
      q: "What is the application review process?",
      a: "After you submit your application form and upload your resume, our Academic Vetting Panel reviews your qualifications. Selected candidates are invited to a live, 30-minute online interview consisting of a 15-minute mock teaching demonstration.",
    },
    {
      q: "Can I choose which subjects and levels to teach?",
      a: "Yes! You list all subjects and academic levels you are fully qualified to teach. We only connect you with students seeking assistance matching your precise list of syllabus criteria.",
    },
    {
      q: "Is there an platform commission or fee?",
      a: "We charge a nominal administrative marketplace fee on lessons delivered, which covers card processing, invoicing, calendar syncs, and client support. This ensures our premium classroom platform remains state-of-the-art.",
    },
    {
      q: "Who handles student payments and invoices?",
      a: "We handle 100% of the financial processing. Parents purchase credit packs securely in advance through Stripe. Tutors are paid out directly via direct deposit every single week, with zero payment chasing required.",
    },
  ];

  return (
    <>
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_45%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Teach Elite Minds. Inspire Success.
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Tutors Link connects elite academic tutors with ambition-driven students. Set your own
            pricing, design customized curriculums, and join a premier community.
          </p>
          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-12 shadow-lg shadow-blue-500/10 px-8 group"
            >
              <Link to="/apply">
                Apply to Teach Now
                <ArrowRight className="h-4.5 w-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Why Teach With Tutors Link?
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            We empower educators with the tools, security, and elite prestige needed to elevate
            their educational careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <Card
              key={idx}
              className="rounded-2xl border-border/80 bg-background p-6 space-y-4 shadow-sm"
            >
              <div className="bg-slate-50 dark:bg-slate-900 h-12 w-12 rounded-xl flex items-center justify-center border border-border/40">
                {b.icon}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{b.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-y border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Application & Vetting Criteria
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Our parents choose us because of our uncompromising academic standards.
            </p>
          </div>

          <Card className="rounded-2xl border-border/80 bg-background p-6 md:p-8 shadow-sm space-y-5">
            <h3 className="font-bold text-base flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" /> Minimum Entry Requirements
            </h3>
            <ul className="space-y-3">
              {requirements.map((req, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Recruitment FAQs */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruitment Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Everything you need to know about joining Tutors Link as a scholar.
          </p>
        </div>

        <div className="space-y-6">
          {recruitmentFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="space-y-2 bg-background p-5 border border-border/60 rounded-xl shadow-sm"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-start gap-2.5">
                <span className="text-blue-600 font-black">Q:</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 max-w-3xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Ready to Inspire Ambition?</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Create your profile, set your pricing schedules, and start connecting with students
          looking for academic excellence.
        </p>
        <div className="pt-2">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md px-8"
          >
            <Link to="/apply">Complete Tutor Registration</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
