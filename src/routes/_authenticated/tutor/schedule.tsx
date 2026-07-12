import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/tutor/schedule")({
  component: TutorSchedule,
});

type ViewMode = "day" | "week" | "month";

const mockLessons = [
  { id: "l1", student: "Emma Wilson", subject: "Mathematics", level: "A-Level", date: "2026-07-12", start: "16:00", end: "17:00", status: "scheduled" },
  { id: "l2", student: "James Park", subject: "Calculus", level: "University", date: "2026-07-13", start: "10:00", end: "11:00", status: "scheduled" },
  { id: "l3", student: "Sofia Garcia", subject: "Statistics", level: "IB", date: "2026-07-15", start: "14:00", end: "15:00", status: "scheduled" },
  { id: "l4", student: "Emma Wilson", subject: "Mathematics", level: "A-Level", date: "2026-07-10", start: "16:00", end: "17:00", status: "completed" },
];

function TutorSchedule() {
  const [view, setView] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date("2026-07-12"));

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === "day") d.setDate(d.getDate() + dir);
    else if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const dateStr = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    ...(view === "day" ? { day: "numeric" } : {}),
  });

  return (
    <div>
      <PageHeader
        title="Schedule"
        description="Your upcoming and past lessons."
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border overflow-hidden">
              {(["day", "week", "month"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    view === v ? "bg-blue-600 text-white" : "bg-background hover:bg-muted"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm ml-2">{dateStr}</span>
        </div>
      </div>

      {mockLessons.length === 0 ? (
        <EmptyState icon={CalendarIcon} title="No lessons scheduled." />
      ) : (
        <div className="space-y-3">
          {mockLessons.map((lesson) => {
            const duration = parseInt(lesson.start) - parseInt(lesson.end);
            return (
              <Card key={lesson.id}>
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground">
                        {new Date(lesson.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-lg font-bold">
                        {new Date(lesson.date).getDate()}
                      </p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div>
                      <p className="font-semibold text-sm">{lesson.subject} · {lesson.level}</p>
                      <p className="text-xs text-muted-foreground">with {lesson.student}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="font-medium">{lesson.start} - {lesson.end}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" /> 1 hour
                      </p>
                    </div>
                    <StatusBadge status={lesson.status} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
