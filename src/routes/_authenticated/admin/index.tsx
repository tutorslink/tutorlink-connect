import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, FileText, Star, Bell, DollarSign, TrendingUp, BookOpen } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform-wide overview and management." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Students" value={1450} color="text-blue-600 bg-blue-50 dark:bg-blue-950/30" />
        <StatCard icon={GraduationCap} label="Active Tutors" value={124} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
        <StatCard icon={FileText} label="Pending Applications" value={8} color="text-amber-600 bg-amber-50 dark:bg-amber-950/30" />
        <StatCard icon={Star} label="Avg Rating" value={4.9} color="text-purple-600 bg-purple-50 dark:bg-purple-950/30" />
        <StatCard icon={Bell} label="Notifications" value={3} color="text-rose-600 bg-rose-50 dark:bg-rose-950/30" />
        <StatCard icon={DollarSign} label="Monthly Revenue" value="$24.5K" color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
        <StatCard icon={TrendingUp} label="Growth (MoM)" value="+12%" color="text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30" />
        <StatCard icon={BookOpen} label="Active Subjects" value={45} color="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Tutor Applications</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Dr. Alexander Sterling", subject: "Mathematics", date: "2026-07-11", status: "pending" },
                { name: "Sophia Martinez", subject: "English Literature", date: "2026-07-10", status: "under_review" },
                { name: "Marcus Chen", subject: "Computer Science", date: "2026-07-09", status: "approved" },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.subject} · {new Date(app.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    app.status === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                    app.status === "under_review" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}>{app.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Platform Health</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Database Status</span><span className="text-sm font-medium text-emerald-600">Healthy</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Auth Service</span><span className="text-sm font-medium text-emerald-600">Operational</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">AI Assistant</span><span className="text-sm font-medium text-emerald-600">Active</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Edge Functions</span><span className="text-sm font-medium text-emerald-600">Running</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Last Backup</span><span className="text-sm font-medium">2 hours ago</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
