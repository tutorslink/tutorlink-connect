import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/apply")({
  component: Apply,
});

function Apply() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-6">Apply as a Tutor</h1>
      <p className="text-xl text-muted-foreground mb-8">Join the Tutors Link network and help students master their potential.</p>
      <div className="bg-card border rounded-xl p-12 shadow-sm">
        <p className="text-muted-foreground mb-6">The application form will be available shortly. Please check back later or contact support.</p>
      </div>
    </div>
  );
}
