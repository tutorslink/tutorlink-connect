import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Plus, Trash2, CalendarOff } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/tutor/availability")({
  component: TutorAvailability,
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface TimeBlock {
  start: string;
  end: string;
}

function TutorAvailability() {
  const [schedule, setSchedule] = useState<Record<string, TimeBlock[]>>({
    Monday: [{ start: "09:00", end: "17:00" }],
    Wednesday: [{ start: "14:00", end: "18:00" }],
    Saturday: [{ start: "09:00", end: "13:00" }],
  });
  const [timezone, setTimezone] = useState("UTC");
  const [exceptions, setExceptions] = useState<{ date: string; reason: string }[]>([]);

  const addBlock = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { start: "09:00", end: "10:00" }],
    }));
  };

  const removeBlock = (day: string, idx: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((_, i) => i !== idx),
    }));
  };

  const updateBlock = (day: string, idx: number, field: keyof TimeBlock, value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((b, i) => (i === idx ? { ...b, [field]: value } : b)),
    }));
  };

  return (
    <div>
      <PageHeader title="Availability" description="Manage your weekly recurring schedule and exceptions." />

      <Card className="mb-6">
        <CardContent className="p-4 flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium">Timezone:</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="bg-background border border-input rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="UTC">UTC</option>
            <option value="GMT+0">GMT (London)</option>
            <option value="GMT-5">EST (New York)</option>
            <option value="GMT-8">PST (Los Angeles)</option>
            <option value="GMT+9">KST (Seoul)</option>
          </select>
        </CardContent>
      </Card>

      <div className="space-y-3 mb-8">
        {days.map((day) => (
          <Card key={day}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">{day}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => addBlock(day)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Block
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {(!schedule[day] || schedule[day].length === 0) ? (
                <p className="text-xs text-muted-foreground py-2">No availability set.</p>
              ) : (
                <div className="space-y-2">
                  {schedule[day].map((block, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={block.start}
                        onChange={(e) => updateBlock(day, idx, "start", e.target.value)}
                        className="w-32 h-8 text-sm"
                      />
                      <span className="text-muted-foreground text-xs">to</span>
                      <Input
                        type="time"
                        value={block.end}
                        onChange={(e) => updateBlock(day, idx, "end", e.target.value)}
                        className="w-32 h-8 text-sm"
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeBlock(day, idx)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CalendarOff className="h-5 w-5" /> Holiday Exceptions & Temporary Unavailability
        </h2>
        {exceptions.length === 0 ? (
          <EmptyState icon={CalendarOff} title="No exceptions configured." description="Add dates when you're temporarily unavailable." />
        ) : (
          <div className="space-y-2 mb-4">
            {exceptions.map((exc, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{exc.date}</p>
                  <p className="text-xs text-muted-foreground">{exc.reason}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setExceptions(exceptions.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          onClick={() => setExceptions([...exceptions, { date: "2026-07-20", reason: "Holiday" }])}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Exception
        </Button>
      </div>
    </div>
  );
}
