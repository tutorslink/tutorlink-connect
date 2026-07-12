import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, GraduationCap, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appwrite } from "@/integrations/appwrite/client";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    appwrite.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authSub } = appwrite.auth.onAuthStateChange((_e, sesh) => {
      setSession(sesh);
    });
    return () => authSub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await appwrite.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Find a Tutor", to: "/find-a-tutor" },
    { label: "Apply as a Tutor", to: "/apply" },
    { label: "Work With Us", to: "/work-with-us" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-blue-600 group-hover:bg-blue-700 h-9 w-9 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-blue-500/10">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tutors Link
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{
                className:
                  "bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 font-medium",
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground rounded-xl"
              >
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 border-border/80 text-muted-foreground hover:text-foreground rounded-xl"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground font-medium rounded-xl"
              >
                <Link to="/auth">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 shadow-md shadow-blue-500/10 rounded-xl"
              >
                <Link to="/auth">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {session && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Link to="/dashboard" title="Dashboard">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground hover:text-foreground p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/98 backdrop-blur-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                activeProps={{
                  className:
                    "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 font-semibold",
                }}
                className="block text-base font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-border/60 space-y-2 px-4">
              {session ? (
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-center gap-2 rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 text-destructive hover:bg-destructive/5 rounded-xl"
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/auth">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
