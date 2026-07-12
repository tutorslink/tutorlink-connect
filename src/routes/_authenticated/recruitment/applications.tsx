import { createFileRoute } from "@tanstack/react-router";
import { FileText, Search, Filter } from "lucide-react";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/recruitment/applications")({
  component: RecruitmentApplications,
});

const mockApplications = [
  { id: "app_1", name: "Laura Bennett", email: "l.bennett@email.com", phone: "+1 555-0100", position: "Recruitment Coordinator", date: "2026-07-11", status: "pending" },
  { id: "app_2", name: "Tom Anderson", email: "t.anderson@email.com", phone: "+1 555-0101", position: "Website Manager", date: "2026-07-10", status: "under_review" },
  { id: "app_3", name: "Priya Sharma", email: "p.sharma@email.com", phone: "+1 555-0102", position: "Academic Advisor", date: "2026-07-09", status: "pending" },
  { id: "app_4", name: "James Wilson", email: "j.wilson@email.com", phone: "+1 555-0103", position: "Content Writer", date: "2026-07-08", status: "approved" },
  { id: "app_5", name: "Sara Khan", email: "s.khan@email.com", phone: "+1 555-0104", position: "Marketing Lead", date: "2026-07-07", status: "rejected" },
];

function RecruitmentApplications() {
  return (
    <div>
      <PageHeader title="Recruitment Applications" description="Review and manage internal team applications." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or position..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {mockApplications.length === 0 ? (
            <EmptyState icon={FileText} title="No Applications" description="There are no recruitment applications to review." />
          ) : (
            <div className="divide-y">
              {mockApplications.map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                      {app.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.position} · {app.email}</p>
                      <p className="text-xs text-muted-foreground">{app.phone} · Applied {new Date(app.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
