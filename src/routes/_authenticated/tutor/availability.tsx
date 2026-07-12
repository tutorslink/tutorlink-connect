import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Plus, X, Globe, Calendar } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/tutor/availability")({
  component: TutorAvailability,
});

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata",
  "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney", "Pacific/Auckland",
];

interface TimeBlock {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

function TutorAvailability() {
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [loading, setLoading] = useState(true);
  const [tutorId, setTutorId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      setTutorId(uid || null);
      if (uid) {
        const schedules = await DataStore.getTutorAvailability(uid);
        setBlocks(schedules.map((s: any) => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
        })));
      }
      setLoading(false);
    })();
  }, []);

  const addBlock = (dayOfWeek: number) => {
    setBlocks([...blocks, { day_of_week: dayOfWeek, start_time: "09:00", end_time: "17:00" }]);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, field: keyof TimeBlock, value: string | number) => {
    setBlocks(blocks.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  };

  const handleSave = async () => {
    if (!tutorId) return;
    await DataStore.saveTutorAvailability(tutorId, blocks.map((b) => ({ ...b, timezone })));
    toast.success("Availability saved");
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
      <PageHeader title="Availability" description="Set your weekly recurring availability for scheduling." action={
        <Button onClick={handleSave} className="gap-2">Save Availability</Button>
      } />

      <Card className="mb-6">
        <CardContent className="p-4 flex items-center gap-3">
          <Globe className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map((day, dayIdx) => {
          const dayBlocks = blocks.filter((b) => b.day_of_week === dayIdx);
          return (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  {day}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addBlock(dayIdx)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayBlocks.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No availability set</p>
                ) : (
                  dayBlocks.map((block) => {
                    const globalIdx = blocks.indexOf(block);
                    return (
                      <div key={globalIdx} className="flex items-center gap-2 p-2 border rounded-lg">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <Input
                          type="time"
                          value={block.start_time}
                          onChange={(e) => updateBlock(globalIdx, "start_time", e.target.value)}
                          className="h-8 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={block.end_time}
                          onChange={(e) => updateBlock(globalIdx, "end_time", e.target.value)}
                          className="h-8 text-xs"
                        />
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeBlock(globalIdx)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" /> Holiday Exceptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState icon={Calendar} title="No Exceptions" description="Add dates when you're unavailable despite recurring availability." />
        </CardContent>
      </Card>
    </div>
  );
}
