import { createFileRoute } from "@tanstack/react-router";
import { FileText, Eye, CheckCircle, XCircle } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/recruitment-applications")({
  component: AdminRecruitmentApplications,
});

const applications = [
  { id: "ra1", name: "Laura Bennett", email: "l.bennett@email.com", position: "Recruitment Coordinator", date: "2026-07-11", status: "pending" },
  { id: "ra2", name: "Tom Anderson", email: "t.anderson@email.com", position: "Website Manager", date: "2026-07-10", status: "under_review" },
  { id: "ra3", name: "Priya Sharma", email: "p.sharma@email.com", position: "Academic Advisor", date: "2026-07-09", status: "pending" },
  { id: "ra4", name: "James Wilson", email: "j.wilson@email.com", position: "Content Writer", date: "2026-07-08", status: "approved" },
];

function AdminRecruitmentApplications() {
  return (
    <div>
      <PageHeader title="Recruitment Applications" description="Review internal team applications." />
      {applications.length === 0 ? (
        <EmptyState icon={FileText} title="No Applications" description="There are no recruitment applications." />
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <Card key={app.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                    {app.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.position} · {app.email}</p>
                    <p className="text-xs text-muted-foreground">Applied {new Date(app.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={app.status} />
                  <Button variant="outline" size="sm" className="gap-1.5"><Eye className="h-4 w-4" /> Review</Button>
                  {app.status === "pending" || app.status === "under_review" ? (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"><CheckCircle className="h-4 w-4" /> Approve</Button>
                      <Button variant="outline" size="sm" className="text-red-600 gap-1.5"><XCircle className="h-4 w-4" /> Reject</Button>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
