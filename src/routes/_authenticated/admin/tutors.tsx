import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Search, Star, CheckCircle } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/tutors")({
  component: AdminTutors,
});

const tutors = [
  { id: "t1", name: "Dr. Alexander Sterling", headline: "Oxford Graduate & Math Professor", rating: 4.95, reviews: 84, rate: 65, verified: true, active: true },
  { id: "t2", name: "Sophia Martinez", headline: "Bilingual Literature Scholar", rating: 4.88, reviews: 62, rate: 45, verified: true, active: true },
  { id: "t3", name: "Marcus Chen", headline: "Software Engineer & CS Tutor", rating: 4.92, reviews: 47, rate: 55, verified: true, active: true },
  { id: "t4", name: "Elena Rostova", headline: "Biochemistry Ph.D. & Pre-Med Mentor", rating: 4.91, reviews: 39, rate: 50, verified: true, active: false },
];

function AdminTutors() {
  return (
    <div>
      <PageHeader title="Tutors" description="Manage all tutors on the platform." />

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tutors..." className="pl-9" />
      </div>

      {tutors.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No Tutors" description="No tutors have been approved yet." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.map(t => (
            <Card key={t.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                      {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm flex items-center gap-1.5">
                        {t.name}
                        {t.verified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.headline}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> {t.rating} ({t.reviews})
                  </span>
                  <span className="font-medium">${t.rate}/hr</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant={t.active ? "default" : "secondary"}>{t.active ? "Active" : "Inactive"}</Badge>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
