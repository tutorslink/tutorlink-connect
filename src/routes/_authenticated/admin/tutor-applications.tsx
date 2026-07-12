import { createFileRoute } from "@tanstack/react-router";
import { FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/tutor-applications")({
  component: AdminTutorApplications,
});

const applications = [
  { id: "ta1", name: "Dr. Alexander Sterling", email: "a.sterling@email.com", subjects: ["Mathematics", "Physics"], experience: 12, date: "2026-07-11", status: "pending" },
  { id: "ta2", name: "Sophia Martinez", email: "s.martinez@email.com", subjects: ["English Literature"], experience: 8, date: "2026-07-10", status: "under_review" },
  { id: "ta3", name: "Marcus Chen", email: "m.chen@email.com", subjects: ["Computer Science"], experience: 6, date: "2026-07-09", status: "approved" },
  { id: "ta4", name: "Elena Rostova", email: "e.rostova@email.com", subjects: ["Chemistry", "Biology"], experience: 7, date: "2026-07-08", status: "pending" },
];

function AdminTutorApplications() {
  return (
    <div>
      <PageHeader title="Tutor Applications" description="Review and approve tutor applications." />
      {applications.length === 0 ? (
        <EmptyState icon={FileText} title="No Applications" description="There are no tutor applications to review." />
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <Card key={app.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                    {app.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.email} · {app.subjects.join(", ")} · {app.experience} yrs exp</p>
                    <p className="text-xs text-muted-foreground">Applied {new Date(app.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={app.status} />
                  <Button variant="outline" size="sm" className="gap-1.5"><Eye className="h-4 w-4" /> Review</Button>
                  {app.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"><CheckCircle className="h-4 w-4" /> Approve</Button>
                      <Button variant="outline" size="sm" className="text-red-600 gap-1.5"><XCircle className="h-4 w-4" /> Reject</Button>
                    </>
                  )}
                  {app.status === "under_review" && (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"><CheckCircle className="h-4 w-4" /> Approve</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
