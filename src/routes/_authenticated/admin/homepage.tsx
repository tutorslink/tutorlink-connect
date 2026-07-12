import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Sparkles, Eye } from "lucide-react";
import { PageHeader } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: AdminHomepage,
});

function AdminHomepage() {
  const [hero, setHero] = useState({
    hero_headline: "Unlock Your Academic Potential with Premier Private Tutors",
    hero_subheadline: "Connect with certified Ivy League and Oxbridge tutors for personalized, high-impact learning.",
    cta_primary: "Find the Perfect Tutor",
    cta_secondary: "Apply as a Tutor",
  });
  const [stats, setStats] = useState({ tutors: 124, students: 1450, lessons: 9240, subjects: 45, rating: 4.9 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await DataStore.getHomepageContent();
      if (data) {
        setHero({
          hero_headline: data.hero_headline || hero.hero_headline,
          hero_subheadline: data.hero_subheadline || hero.hero_subheadline,
          cta_primary: data.cta_primary || hero.cta_primary,
          cta_secondary: data.cta_secondary || hero.cta_secondary,
        });
        if (data.stats) setStats(data.stats);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await DataStore.saveHomepageContent({ ...hero, stats });
      toast.success("Homepage content saved");
    } catch {
      toast.error("Failed to save homepage content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Homepage Content" description="Edit the homepage hero section and statistics." action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Eye className="h-4 w-4" /> Preview</Button>
          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      } />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-600" /> Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headline</label>
              <Input value={hero.hero_headline} onChange={(e) => setHero({ ...hero, hero_headline: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subheadline</label>
              <Textarea value={hero.hero_subheadline} onChange={(e) => setHero({ ...hero, hero_subheadline: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary CTA</label>
                <Input value={hero.cta_primary} onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Secondary CTA</label>
                <Input value={hero.cta_secondary} onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Statistics Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Tutors</label>
                <Input type="number" value={stats.tutors} onChange={(e) => setStats({ ...stats, tutors: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Students</label>
                <Input type="number" value={stats.students} onChange={(e) => setStats({ ...stats, students: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lessons</label>
                <Input type="number" value={stats.lessons} onChange={(e) => setStats({ ...stats, lessons: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subjects</label>
                <Input type="number" value={stats.subjects} onChange={(e) => setStats({ ...stats, subjects: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Rating</label>
                <Input type="number" step="0.1" value={stats.rating} onChange={(e) => setStats({ ...stats, rating: Number(e.target.value) })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
