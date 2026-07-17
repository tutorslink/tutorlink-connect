import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({
  component: AboutUs,
});

function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-6">About Alvey</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We are on a mission to democratize premium education by connecting ambitious students with
        world-class tutors across the globe.
      </p>
      <div className="prose prose-lg mx-auto text-left">
        <p>
          At Alvey, we believe that personalized education should be accessible and seamless.
          Founded by educators, we understand the profound impact a great tutor can have on a
          student's academic journey.
        </p>
        <p>
          Our rigorous vetting process ensures that only the highest quality educators join our
          platform, maintaining our standard of excellence.
        </p>
      </div>
    </div>
  );
}
