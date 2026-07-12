import { createFileRoute } from "@tanstack/react-router";
import { FileText, Clock, CheckCircle, XCircle, Bell, Activity, Users } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/portal-shared";

export const Route = createFileRoute("/_authenticated/recruitment/")({
  component: RecruitmentDashboard,
});

function RecruitmentDashboard() {
  return (
    <div>
      <PageHeader title="Recruitment Dashboard" description="Overview of current recruitment activity." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Clock} label="Pending Applications" value={5} color="text-amber-600 bg-amber-50 dark:bg-amber-950/30" />
        <StatCard icon={FileText} label="Under Review" value={3} color="text-blue-600 bg-blue-50 dark:bg-blue-950/30" />
        <StatCard icon={CheckCircle} label="Approved" value={12} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
        <StatCard icon={XCircle} label="Rejected" value={4} color="text-red-600 bg-red-50 dark:bg-red-950/30" />
        <StatCard icon={Users} label="Recently Submitted" value={8} color="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30" />
        <StatCard icon={Bell} label="Notifications" value={2} color="text-rose-600 bg-rose-50 dark:bg-rose-950/30" />
        <StatCard icon={Activity} label="Activity This Week" value={18} color="text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recently Submitted Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Laura Bennett", position: "Recruitment Coordinator", date: "2026-07-11", status: "pending" },
              { name: "Tom Anderson", position: "Website Manager", date: "2026-07-10", status: "under_review" },
              { name: "Priya Sharma", position: "Academic Advisor", date: "2026-07-09", status: "pending" },
            ].map((app, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-200 transition-colors">
                <div>
                  <p className="font-semibold text-sm">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.position} · {new Date(app.date).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
