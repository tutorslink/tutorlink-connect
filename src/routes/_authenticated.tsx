import { createFileRoute, Outlet, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Calendar, Clock, Star, Bell, User, Settings, LogOut, Menu } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth", replace: true });
      else setEmail(session.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Tutors", href: "/dashboard", icon: Users }, // Mocked routes
    { name: "Schedule", href: "/dashboard", icon: Calendar },
    { name: "Lesson History", href: "/dashboard", icon: Clock },
    { name: "Reviews", href: "/dashboard", icon: Star },
    { name: "Notifications", href: "/dashboard", icon: Bell },
    { name: "Profile", href: "/dashboard", icon: User },
    { name: "Settings", href: "/dashboard", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card min-h-screen">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="font-bold text-xl text-primary">Tutors Link</Link>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="text-sm font-medium mb-4 truncate text-muted-foreground">{email}</div>
          <Button variant="outline" className="w-full justify-start text-destructive" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b flex items-center justify-between px-4 bg-card">
          <Link to="/" className="font-bold text-xl text-primary">Tutors Link</Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 border-b bg-card z-50 p-4 shadow-lg flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            <div className="border-t my-2 pt-2">
              <Button variant="outline" className="w-full justify-start text-destructive" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-muted/10 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
