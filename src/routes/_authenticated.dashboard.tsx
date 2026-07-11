import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Role = "student" | "tutor" | "recruitment" | "website_manager" | "owner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Tutors Link" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [profile, setProfile] = useState<{ display_name: string | null; email: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const [{ data: r }, { data: p }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("profiles").select("display_name,email").eq("id", uid).maybeSingle(),
      ]);
      setRoles((r ?? []).map((x) => x.role as Role));
      setProfile(p ?? null);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}</h1>
        <p className="text-muted-foreground text-sm">{profile?.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your roles</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {roles.length === 0 ? (
            <span className="text-sm text-muted-foreground">No roles yet.</span>
          ) : (
            roles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backend ready</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Auth, RBAC, and the full database schema are set up:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>profiles, user_roles (with has_role, is_staff, is_manager)</li>
            <li>tutor_profiles, advertisements, subjects, academic_levels</li>
            <li>tutor_applications, recruitment_applications</li>
            <li>student_tutor_assignments, schedules, lessons</li>
            <li>reviews, notifications, audit_log</li>
            <li>RLS + GRANTs on every table</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
