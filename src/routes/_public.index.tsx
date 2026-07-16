import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataStore } from "@/lib/data-store";
import { motion } from "motion/react";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Tutors Link · Find the right tutor" },
      {
        name: "description",
        content: "A modern tutoring platform connecting students with qualified tutors.",
      },
      { property: "og:title", content: "Tutors Link" },
      {
        property: "og:description",
        content: "A modern tutoring platform connecting students with qualified tutors.",
      },
    ],
  }),
  component: Index,
});

const FALLBACK_LEVELS = [
  "Primary",
  "Secondary",
  "IGCSE",
  "GCSE",
  "A-Level",
  "SAT",
  "University",
  "Professional",
];

function Index() {
  const [levels, setLevels] = useState<string[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const docs = await DataStore.getSubjectCategories();
        if (docs.length > 0) {
          const names = docs
            .map((doc: any) => doc.name || doc.title || doc.label || "")
            .filter(Boolean) as string[];
          setLevels(names.length > 0 ? names : FALLBACK_LEVELS);
        } else {
          setLevels(FALLBACK_LEVELS);
        }
      } catch {
        setLevels(FALLBACK_LEVELS);
      } finally {
        setLevelsLoading(false);
      }
    })();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-background to-background text-center px-4 overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-6 relative z-10"
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Master your potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tutors Link</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting ambitious students with world-class tutors. Start your personalized learning
            journey today.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" asChild className="text-lg px-8 shadow-lg shadow-blue-500/20 rounded-xl transition-transform hover:scale-105">
              <Link to="/find-a-tutor">Find a Tutor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 rounded-xl transition-transform hover:scale-105">
              <Link to="/apply">Apply as a Tutor</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-muted/30">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "500+", label: "Qualified Tutors" },
            { value: "10,000+", label: "Students" },
            { value: "40+", label: "Subjects" },
            { value: "4.9/5", label: "Average Rating" }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="space-y-2">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Browse by Academic Level */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Browse by Academic Level</h2>
          <p className="text-lg text-muted-foreground">
            Find specialists for your specific educational journey
          </p>
        </motion.div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {levelsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-muted animate-pulse"
                />
              ))
            : levels.map((level) => (
                <motion.div key={level} variants={fadeInUp} whileHover={{ y: -5 }}>
                  <Link to="/find-a-tutor" search={{ level }}>
                    <Card className="hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer h-full border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl">
                      <CardContent className="p-8 text-center font-semibold text-lg">{level}</CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-4 bg-muted/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl font-bold mb-20 tracking-tight"
          >
            How Tutors Link Works
          </motion.h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-12 relative"
          >
            {[
              { step: "1", title: "Search Tutors", desc: "Browse our marketplace of vetted professionals." },
              { step: "2", title: "Choose a Tutor", desc: "Review profiles, ratings, and experience." },
              { step: "3", title: "Contact Us", desc: "We facilitate the connection and scheduling." },
              { step: "4", title: "Begin Learning", desc: "Achieve your academic goals." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="space-y-6 relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-bold mx-auto shadow-sm transform rotate-3 transition-transform hover:rotate-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-base text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-4 bg-blue-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto space-y-10 relative z-10"
        >
          <h2 className="text-5xl font-bold tracking-tight">Ready to unlock your potential?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
            Join thousands of students who have transformed their grades and confidence with Tutors
            Link.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" variant="secondary" asChild className="text-lg px-10 rounded-xl font-semibold shadow-xl hover:scale-105 transition-transform text-blue-600">
              <Link to="/find-a-tutor">Find a Tutor</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-10 rounded-xl font-semibold border-white text-white hover:bg-white hover:text-blue-600 transition-all shadow-xl hover:scale-105"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
