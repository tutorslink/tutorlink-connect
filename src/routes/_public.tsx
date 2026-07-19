import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { appwrite } from "@/integrations/appwrite/client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { AIChatbot } from "@/components/AIChatbot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12V18H8V12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M4 14C4 14 5 13 8 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 14C20 14 19 13 16 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-bold text-xl text-primary">Alvey</span>
    </div>
  );
}

function PublicLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    appwrite.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = appwrite.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await appwrite.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-xl text-primary mb-4">Alvey</div>
            <p className="text-sm text-muted-foreground">
              Connecting students with qualified tutors for personalized learning experiences.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <Link
                to="/find-a-tutor"
                search={{
                  level: undefined,
                  subject: undefined,
                }}
                className="hover:text-foreground"
              >
                Find a Tutor
              </Link>
              <Link to="/about" className="hover:text-foreground">
                About Us
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/contact" className="hover:text-foreground">
                Contact Us
              </Link>
              <a href="mailto:support@tutorslink.me" className="hover:text-foreground">
                support@tutorslink.me
              </a>
              <Link to="/contact" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Social</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">
                Instagram
              </a>
              <a href="#" className="hover:text-foreground">
                LinkedIn
              </a>
              <a href="#" className="hover:text-foreground">
                X (Twitter)
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Alvey. All rights reserved.
        </div>
      </footer>
      <AIChatbot />
    </div>
  );
}
