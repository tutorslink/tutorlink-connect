import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, Save } from "lucide-react";
import { PageHeader } from "@/components/portal-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tutor/advertisement")({
  component: TutorAdvertisement,
});

function TutorAdvertisement() {
  const [ad, setAd] = useState({
    title: "Expert Mathematics & Calculus Tutoring",
    description: "Personalized lessons tailored to your syllabus. From GCSE to University level, I help students build deep understanding and exam confidence.",
    subjects: ["Mathematics", "Calculus", "Statistics"],
    levels: ["A-Level", "IB", "University"],
    format: "Online (Video)",
    monthlyPrice: 240,
    hourlyPrice: 55,
    strengths: ["Exam Preparation", "Concept Mastery", "Problem Solving"],
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Advertisement updated successfully.");
    }, 800);
  };

  return (
    <div>
      <PageHeader
        title="Advertisement"
        description="Manage your public marketplace listing."
        action={
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge>
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">Published</Badge>
        <span className="text-xs text-muted-foreground">Visible in Find a Tutor marketplace</span>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4" /> Advertisement Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Advertisement Title</label>
            <Input value={ad.title} onChange={(e) => setAd({ ...ad, title: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</label>
            <textarea
              value={ad.description}
              onChange={(e) => setAd({ ...ad, description: e.target.value })}
              rows={3}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Teaching Format</label>
              <Input value={ad.format} onChange={(e) => setAd({ ...ad, format: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Monthly Pricing ($)</label>
              <Input type="number" value={ad.monthlyPrice} onChange={(e) => setAd({ ...ad, monthlyPrice: Number(e.target.value) })} className="rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subjects (comma separated)</label>
              <Input
                value={ad.subjects.join(", ")}
                onChange={(e) => setAd({ ...ad, subjects: e.target.value.split(",").map((s) => s.trim()) })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Levels (comma separated)</label>
              <Input
                value={ad.levels.join(", ")}
                onChange={(e) => setAd({ ...ad, levels: e.target.value.split(",").map((s) => s.trim()) })}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Featured Teaching Strengths (comma separated)</label>
            <Input
              value={ad.strengths.join(", ")}
              onChange={(e) => setAd({ ...ad, strengths: e.target.value.split(",").map((s) => s.trim()) })}
              className="rounded-xl"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
