import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import AIChatbot from "@/components/AIChatbot";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-primary">Tutors Link</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/find-tutor" className="hover:text-primary transition-colors">Find a Tutor</Link>
            <Link to="/apply" className="hover:text-primary transition-colors">Apply as a Tutor</Link>
            <Link to="/work-with-us" className="hover:text-primary transition-colors">Work With Us</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-xl text-primary mb-4">Tutors Link</div>
            <p className="text-sm text-muted-foreground">Connecting students with qualified tutors for personalized learning experiences.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <Link to="/find-tutor" className="hover:text-foreground">Find a Tutor</Link>
              <Link to="/about" className="hover:text-foreground">About Us</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/contact" className="hover:text-foreground">Contact Us</Link>
              <a href="mailto:support@tutorslink.me" className="hover:text-foreground">support@tutorslink.me</a>
              <Link to="/contact" className="hover:text-foreground">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Social</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Instagram</a>
              <a href="#" className="hover:text-foreground">LinkedIn</a>
              <a href="#" className="hover:text-foreground">X (Twitter)</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tutors Link. All rights reserved.
        </div>
      </footer>
      <AIChatbot />
    </div>
  );
}
