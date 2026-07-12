import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Star,
  CheckCircle,
  Search,
  ShieldCheck,
  GraduationCap,
  Users,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataStore, Tutor, Testimonial, CMSContent } from "@/lib/data-store";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Tutors Link · Premium Private Academic Tutoring" },
      {
        name: "description",
        content:
          "Find premium, certified, Ivy League and Oxbridge private tutors. Customized pathways for students aiming for academic excellence.",
      },
      { property: "og:title", content: "Tutors Link" },
      {
        property: "og:description",
        content: "Connecting students with certified private academic tutors globally.",
      },
    ],
  }),
  component: Index,
});

const academicLevels = [
  {
    name: "Primary",
    desc: "Elementary Foundation",
    color:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400 border-emerald-100",
  },
  {
    name: "Secondary",
    desc: "Middle & High School",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950/25 dark:text-blue-400 border-blue-100",
  },
  {
    name: "IGCSE",
    desc: "International Curriculum",
    color:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/25 dark:text-indigo-400 border-indigo-100",
  },
  {
    name: "GCSE",
    desc: "UK Secondary Exams",
    color:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/25 dark:text-purple-400 border-purple-100",
  },
  {
    name: "A-Level",
    desc: "Advanced Higher Prep",
    color: "bg-pink-50 text-pink-700 dark:bg-pink-950/25 dark:text-pink-400 border-pink-100",
  },
  {
    name: "SAT",
    desc: "US University Entrance",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400 border-amber-100",
  },
  {
    name: "University",
    desc: "Undergrad & Degree Prep",
    color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-400 border-cyan-100",
  },
  {
    name: "Professional",
    desc: "Specialist Qualifications",
    color: "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200",
  },
];

function Index() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const [tList, testList, cmsData] = await Promise.all([
        DataStore.getTutors(),
        DataStore.getTestimonials(),
        DataStore.getCMS(),
      ]);
      setTutors(tList.filter((t) => t.is_featured));
      setTestimonials(testList.filter((t) => t.is_featured));
      setCms(cmsData);
    })();
  }, []);

  const handleBrowseLevel = (level: string) => {
    navigate({
      to: "/find-a-tutor",
      search: { level },
    });
  };

  if (!cms) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-slate-950/10 dark:via-background">
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/3 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/3 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100/60 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 text-xs font-semibold border border-blue-200/40">
              <Sparkles className="h-3.5 w-3.5" /> Empowering students, securing futures
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.12]">
              {cms.homepage.hero.headline}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {cms.homepage.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-7 shadow-lg shadow-blue-500/20 group"
              >
                <Link to="/find-a-tutor">
                  {cms.homepage.hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent rounded-xl px-7"
              >
                <Link to="/apply">{cms.homepage.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>

          {/* Hero graphic illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[440px] aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-600/10 to-indigo-600/15 p-6 flex items-center justify-center border border-blue-100 dark:border-slate-800 shadow-xl shadow-blue-500/5">
              <div className="absolute top-8 left-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md border border-border/40 flex items-center gap-3 animate-bounce [animation-duration:6s]">
                <ShieldCheck className="h-10 w-10 text-emerald-500" />
                <div>
                  <h4 className="text-sm font-bold">100% Certified</h4>
                  <p className="text-[10px] text-muted-foreground">Vetted Backgrounds</p>
                </div>
              </div>

              <div className="absolute bottom-12 right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md border border-border/40 flex items-center gap-3 animate-bounce [animation-duration:5s] [animation-delay:2s]">
                <Star className="h-10 w-10 text-amber-500 fill-amber-500" />
                <div>
                  <h4 className="text-sm font-bold">4.95 Avg Rating</h4>
                  <p className="text-[10px] text-muted-foreground">By Verified Students</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-blue-600 text-white h-20 w-20 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <GraduationCap className="h-10 w-10" />
                </div>
                <h3 className="font-extrabold text-xl">Tutors Link Portal</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  A bespoke learning experience tailored precisely for your academic syllabus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-border/60 bg-slate-50/50 dark:bg-slate-900/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              {cms.homepage.stats.tutors}+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Active Tutors
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              {cms.homepage.stats.students}+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Happy Students
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              {cms.homepage.stats.lessons}+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Lessons Taught
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              {cms.homepage.stats.subjects}+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Syllabus Subjects
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 flex items-center justify-center gap-1">
              {cms.homepage.stats.rating} <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Average Rating
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Academic Level */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">Browse by Academic Level</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Choose your academic tier below. We automatically adapt curricula to meet the target
            exam boards and criteria.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {academicLevels.map((lvl) => (
            <button
              key={lvl.name}
              onClick={() => handleBrowseLevel(lvl.name)}
              className="text-left p-5 border border-border/80 rounded-2xl hover:border-blue-300 dark:hover:border-slate-700 bg-background hover:bg-slate-50/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold border mb-4 ${lvl.color}`}
              >
                {lvl.name[0]}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                {lvl.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{lvl.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">How Tutors Link Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mastering any subject with us is streamlined into 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Search Tutors",
                desc: "Browse through our elite list of certified academics, filter by subject, level, language, and budget.",
              },
              {
                num: "02",
                title: "Choose a Tutor",
                desc: "Read student reviews, qualifications, bio, and hourly rates to pick your perfect candidate.",
              },
              {
                num: "03",
                title: "Contact Us",
                desc: "Speak with our platform support or let our AI instantly capture your details to book.",
              },
              {
                num: "04",
                title: "Begin Learning",
                desc: "Track scheduled sessions and logs within our student portal dashboard.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative bg-background p-6 rounded-2xl border border-border/50 shadow-sm space-y-4"
              >
                <span className="absolute top-4 right-4 text-4xl font-black text-slate-100 dark:text-slate-800/60 leading-none select-none">
                  {step.num}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 pt-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">Our Featured Tutors</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
              Fully vetted educators with proven track records of student grade boosts.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-border hover:bg-accent">
            <Link to="/find-a-tutor">
              View All Tutors <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <Card
              key={tutor.id}
              className="rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col h-full bg-background"
            >
              <CardHeader className="flex flex-row gap-4 items-start p-5">
                <img
                  src={tutor.avatar_url}
                  alt={tutor.name}
                  className="h-14 w-14 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 m-0">
                      {tutor.name}
                    </CardTitle>
                    {tutor.is_verified && (
                      <CheckCircle
                        className="h-4 w-4 text-blue-600 fill-blue-50 shrink-0"
                        title="Verified Tutor"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{tutor.rating_avg.toFixed(2)}</span>
                    <span className="text-muted-foreground font-normal">
                      ({tutor.rating_count} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {tutor.headline}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {tutor.about}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex flex-wrap gap-1">
                    {tutor.subjects.slice(0, 3).map((sub) => (
                      <Badge
                        key={sub}
                        variant="secondary"
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {sub}
                      </Badge>
                    ))}
                    {tutor.levels.slice(0, 2).map((lvl) => (
                      <Badge
                        key={lvl}
                        variant="outline"
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {lvl}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      ${tutor.hourly_rate}/hr
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-slate-50/50 dark:bg-slate-900/10 border-t border-border/40 grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs font-medium rounded-lg"
                >
                  <Link to="/tutors/$tutorId" params={{ tutorId: tutor.id }}>
                    View Profile
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  <Link to="/contact" search={{ tutorId: tutor.id }}>
                    Inquire
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">What Our Students Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real feedback from students and parents whose academic profiles have been transformed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <Card
                key={test.id}
                className="p-6 rounded-2xl bg-background border border-border/50 flex flex-col justify-between h-full space-y-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm italic leading-relaxed text-muted-foreground">
                    "{test.comment}"
                  </p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{test.name}</span>
                  <span className="text-muted-foreground">{test.role}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* End CTA Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to excel in your studies?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Contact us today or let our active academic advisor chatbot recommend the perfect
          certified tutor for you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md px-8"
          >
            <Link to="/find-a-tutor">Book a Class</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border hover:bg-accent rounded-xl px-8"
          >
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
