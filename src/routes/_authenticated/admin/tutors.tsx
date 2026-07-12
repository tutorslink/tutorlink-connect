import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Search, Star, CheckCircle } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/admin/tutors")({
  component: AdminTutors,
});

function AdminTutors() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await DataStore.getAllTutors();
      setTutors(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

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
          {tutors.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                      {(t.name || "T").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm flex items-center gap-1.5">
                        {t.name}
                        {t.is_verified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.headline || "Tutor"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {t.rating_avg > 0 && (
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {t.rating_avg} ({t.rating_count})
                    </span>
                  )}
                  {t.hourly_rate && <span className="font-medium">${t.hourly_rate}/hr</span>}
                  {t.years_experience != null && <span>{t.years_experience} yrs exp</span>}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant={t.is_active ? "default" : "secondary"}>{t.is_active ? "Active" : "Inactive"}</Badge>
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
