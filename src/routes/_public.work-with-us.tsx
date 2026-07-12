import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/work-with-us")({
  component: WorkWithUs,
});

function WorkWithUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-6">Work With Us</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Join our internal team and help us build the future of education.
      </p>
      <div className="bg-card border rounded-xl p-12 shadow-sm text-center">
        <p className="text-muted-foreground">Currently, there are no open internal positions. Please check back later.</p>
      </div>
    </div>
  );
}
