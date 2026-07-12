import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Tutors Link · Find the right tutor" },
      { name: "description", content: "A modern tutoring platform connecting students with qualified tutors." },
      { property: "og:title", content: "Tutors Link" },
      { property: "og:description", content: "A modern tutoring platform connecting students with qualified tutors." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-background text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Master your potential with <span className="text-primary">Tutors Link</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting ambitious students with world-class tutors. Start your personalized learning journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/find-tutor">Find a Tutor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/apply">Apply as a Tutor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">500+</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Qualified Tutors</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">10,000+</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Students</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">40+</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Subjects</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">4.9/5</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Browse by Academic Level */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Academic Level</h2>
          <p className="text-muted-foreground">Find specialists for your specific educational journey</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Primary", "Secondary", "IGCSE", "GCSE", "A-Level", "SAT", "University", "Professional"].map((level) => (
            <Card key={level} className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-6 text-center font-medium">
                {level}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 bg-muted/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">How Tutors Link Works</h2>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto">1</div>
              <h3 className="font-semibold text-lg">Search Tutors</h3>
              <p className="text-sm text-muted-foreground">Browse our marketplace of vetted professionals.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto">2</div>
              <h3 className="font-semibold text-lg">Choose a Tutor</h3>
              <p className="text-sm text-muted-foreground">Review profiles, ratings, and experience.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto">3</div>
              <h3 className="font-semibold text-lg">Contact Us</h3>
              <p className="text-sm text-muted-foreground">We facilitate the connection and scheduling.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto">4</div>
              <h3 className="font-semibold text-lg">Begin Learning</h3>
              <p className="text-sm text-muted-foreground">Achieve your academic goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold">Ready to unlock your potential?</h2>
          <p className="text-xl text-primary-foreground/80">Join thousands of students who have transformed their grades and confidence with Tutors Link.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 text-primary">
              <Link to="/find-tutor">Find a Tutor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 border-primary-foreground text-primary hover:bg-primary-foreground">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
