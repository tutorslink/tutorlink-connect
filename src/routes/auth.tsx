import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ID, getCurrentUser, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/integrations/appwrite/client";
import { DataStore } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Client, Account, OAuthProvider } from "appwrite";

// Use a fresh Account instance so we can call Appwrite directly without
// going through any wrapper indirection.
function getAccount() {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  return new Account(client);
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Tutors Link" },
      { name: "description", content: "Sign in or create an account on Tutors Link." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

async function ensureUserRecord(displayNameHint = "") {
  // getCurrentUser() returns the raw Appwrite Models.User merged with { id }
  const user = await getCurrentUser() as any;
  if (!user) return;
  const uid: string = user.$id || user.id;
  const email: string = user.email ?? "";
  const name: string = user.name || displayNameHint || email.split("@")[0];
  await DataStore.saveUserRecord({ id: uid, email, displayName: name, role: "student" });
}

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  // On mount: if there's already a session (including OAuth return), sync the
  // user record and redirect to dashboard.
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        await ensureUserRecord();
        navigate({ to: "/dashboard" });
      }
    })();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const account = getAccount();
      await account.createEmailPasswordSession(email, password);
      // User record already exists from signup; just navigate.
      navigate({ to: "/dashboard" });
      toast.success("Welcome back");
    } catch (err: any) {
      toast.error(err?.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const account = getAccount();
      const name = displayName.trim() || email.split("@")[0];
      // 1. Create the Appwrite auth account
      await account.create(ID.unique(), email, password, name);
      // 2. Open a session immediately
      await account.createEmailPasswordSession(email, password);
      // 3. Write the user record to the database
      await ensureUserRecord(name);
      toast.success("Account created — welcome!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const account = getAccount();
    // Appwrite redirects back to /auth, where the useEffect above will
    // pick up the session and write the user record.
    const origin = window.location.origin;
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${origin}/auth`,  // success → back here so useEffect writes the record
      `${origin}/auth`,  // failure → same page so user sees the sign-in form
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Tutors Link
          </Link>
          <CardTitle className="text-2xl mt-2">Welcome</CardTitle>
          <CardDescription>Sign in or create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input
                    id="si-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-pw">Password</Label>
                  <Input
                    id="si-pw"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input
                    id="su-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input
                    id="su-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-pw">Password</Label>
                  <Input
                    id="su-pw"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
