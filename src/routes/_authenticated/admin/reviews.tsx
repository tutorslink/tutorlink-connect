import { createFileRoute } from "@tanstack/react-router";
import { Star, Check, X } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

const reviews = [
  { id: "r1", student: "Sarah Jenkins", tutor: "Dr. Alexander Sterling", rating: 5, comment: "Excellent explanation. Really helps build fundamental skills.", date: "2026-07-10", status: "approved" },
  { id: "r2", student: "Liam O'Connor", tutor: "Marcus Chen", rating: 5, comment: "Incredible CS tutoring. Helped me secure an internship.", date: "2026-07-09", status: "pending" },
  { id: "r3", student: "Amira Patel", tutor: "Sophia Martinez", rating: 5, comment: "Raised my SAT Verbal score by 140 points!", date: "2026-07-08", status: "pending" },
  { id: "r4", student: "Noah Williams", tutor: "Elena Rostova", rating: 4, comment: "Great biology help, would recommend.", date: "2026-07-07", status: "approved" },
];

function AdminReviews() {
  return (
    <div>
      <PageHeader title="Reviews" description="Moderate and manage student reviews." />
      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No Reviews" description="No reviews have been submitted." />
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-sm">{r.student} → {r.tutor}</p>
                    <div className="flex items-center gap-1 text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-500" : "text-muted-foreground"}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{new Date(r.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-muted-foreground italic mt-2">"{r.comment}"</p>
                {r.status === "pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"><Check className="h-4 w-4" /> Approve</Button>
                    <Button variant="outline" size="sm" className="text-red-600 gap-1.5"><X className="h-4 w-4" /> Reject</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
