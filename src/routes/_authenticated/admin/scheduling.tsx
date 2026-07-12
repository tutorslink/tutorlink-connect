import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/scheduling")({
  component: AdminScheduling,
});

const lessons = [
  { id: "l1", student: "Emma Johnson", tutor: "Dr. Alexander Sterling", subject: "Mathematics", date: "2026-07-12", time: "14:00-15:00", status: "scheduled" },
  { id: "l2", student: "Liam O'Connor", tutor: "Marcus Chen", subject: "Computer Science", date: "2026-07-12", time: "15:30-16:30", status: "scheduled" },
  { id: "l3", student: "Amira Patel", tutor: "Sophia Martinez", subject: "English Literature", date: "2026-07-11", time: "10:00-11:00", status: "completed" },
  { id: "l4", student: "Noah Williams", tutor: "Elena Rostova", subject: "Chemistry", date: "2026-07-10", time: "13:00-14:00", status: "cancelled" },
];

function AdminScheduling() {
  return (
    <div>
      <PageHeader title="Scheduling" description="View all scheduled lessons across the platform." />
      {lessons.length === 0 ? (
        <EmptyState icon={Calendar} title="No Lessons" description="No lessons have been scheduled." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {lessons.map(l => (
                <div key={l.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{l.subject}</p>
                      <p className="text-xs text-muted-foreground">{l.student} with {l.tutor}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {new Date(l.date).toLocaleDateString()} · {l.time}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
