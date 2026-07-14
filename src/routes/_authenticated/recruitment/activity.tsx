import { createFileRoute } from "@tanstack/react-router";
import { Activity, UserPlus, FileCheck, XCircle, Clock } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/recruitment/activity")({
  component: ActivityLog,
});

const activities = [
  {
    id: 1,
    action: "New application submitted",
    actor: "Laura Bennett",
    target: "Recruitment Coordinator",
    date: "2026-07-11T10:00:00Z",
    icon: UserPlus,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: 2,
    action: "Application moved to under review",
    actor: "Recruitment Team",
    target: "Tom Anderson",
    date: "2026-07-10T14:30:00Z",
    icon: Clock,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: 3,
    action: "Application approved",
    actor: "Recruitment Team",
    target: "James Wilson",
    date: "2026-07-08T09:15:00Z",
    icon: FileCheck,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    id: 4,
    action: "Application rejected",
    actor: "Recruitment Team",
    target: "Sara Khan",
    date: "2026-07-07T16:00:00Z",
    icon: XCircle,
    color: "text-red-600 bg-red-50 dark:bg-red-950/30",
  },
  {
    id: 5,
    action: "New application submitted",
    actor: "Priya Sharma",
    target: "Academic Advisor",
    date: "2026-07-09T11:00:00Z",
    icon: UserPlus,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
  },
];

function ActivityLog() {
  return (
    <div>
      <PageHeader title="Activity Log" description="Full audit trail of recruitment actions." />
      {activities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No Activity"
          description="Recruitment activity will appear here."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${a.color}`}
                  >
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">{a.actor}</span> → {a.target}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(a.date).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
