import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Tutors Link</h1>
        <p className="text-muted-foreground text-lg">
          Backend foundation is ready: authentication, roles, and the full database schema.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
