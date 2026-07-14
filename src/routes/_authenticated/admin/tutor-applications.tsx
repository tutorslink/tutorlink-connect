import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, CheckCircle, XCircle, Eye } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/admin/tutor-applications")({
  component: AdminTutorApplications,
});

function AdminTutorApplications() {
  const [applications, setApplications] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const data = await DataStore.getTutorApplicationsFromDB();
    setApplications(data);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await DataStore.updateApplicationStatus(id, "approved");
    toast.success("Application approved");
    loadApplications();
  };

  const handleReject = async (id: string) => {
    await DataStore.updateApplicationStatus(id, "rejected");
    toast.success("Application rejected");
    loadApplications();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Tutor Applications" description="Review and approve tutor applications." />
      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Applications"
          description="There are no tutor applications to review."
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                    {(app.full_name || "A")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{app.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.email} · {(app.subjects || []).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={app.status} />
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="h-4 w-4" /> Review
                  </Button>
                  {app.status === "pending" || app.status === "under_review" ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
                        onClick={() => handleApprove(app.id)}
                      >
                        <CheckCircle className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 gap-1.5"
                        onClick={() => handleReject(app.id)}
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
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
