import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataStore } from "@/lib/data-store";
import { appwrite } from "@/integrations/appwrite/client";

export const Route = createFileRoute("/_authenticated/tutor/schedule")({
  component: TutorSchedule,
});

type ViewMode = "day" | "week" | "month";

function TutorSchedule() {
  const [lessons, setLessons] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tutorId, setTutorId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await appwrite.auth.getUser();
      const uid = userData.user?.id;
      setTutorId(uid || null);
      if (uid) {
        const data = await DataStore.getLessonsForUser(uid, true);
        setLessons(data);
      }
      setLoading(false);
    })();
  }, []);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() + direction);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const lessonDate = new Date(l.starts_at as string);
      if (viewMode === "day") {
        return lessonDate.toDateString() === currentDate.toDateString();
      } else if (viewMode === "week") {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return lessonDate >= weekStart && lessonDate < weekEnd;
      } else {
        return (
          lessonDate.getMonth() === currentDate.getMonth() &&
          lessonDate.getFullYear() === currentDate.getFullYear()
        );
      }
    });
  }, [lessons, currentDate, viewMode]);

  const formatDateRange = () => {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (viewMode === "week") {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    }
  };

  const formatLessonTime = (iso: string) => {
    return new Date(iso).toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
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
      <PageHeader
        title="Schedule"
        description={`All times shown in your timezone: ${userTimezone}`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[200px] text-center">{formatDateRange()}</span>
          <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
        <div className="flex gap-1 border rounded-lg p-1">
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode(mode)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Lessons"
          description={`No lessons scheduled for this ${viewMode}.`}
        />
      ) : (
        <div className="space-y-3">
          {filteredLessons.map((l) => (
            <Card key={l.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{(l.subject as string) || "Lesson"}</p>
                    {l.academic_level && (
                      <p className="text-xs text-muted-foreground">{l.academic_level as string}</p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {formatLessonTime(l.starts_at as string)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={l.status as string} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
