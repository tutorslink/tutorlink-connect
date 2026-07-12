import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Check, X, Eye, Flag } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const data = await DataStore.getAllReviews();
    setReviews(data);
    setLoading(false);
  };

  const handleModerate = async (id: string, status: "approved" | "rejected") => {
    await DataStore.moderateReview(id, status);
    toast.success(`Review ${status}`);
    loadReviews();
  };

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate and manage student reviews." />

      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Star} title="No Reviews" description="No reviews match this filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-sm">
                      {r.student?.display_name || "Student"} → {r.tutor?.display_name || "Tutor"}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-500" : "text-muted-foreground"}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-muted-foreground italic mt-2">"{r.comment}"</p>

                {r.tutor_response && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg border-l-2 border-blue-500">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Tutor Response:</p>
                    <p className="text-sm text-muted-foreground">{r.tutor_response}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  {r.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5" onClick={() => handleModerate(r.id, "approved")}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 gap-1.5" onClick={() => handleModerate(r.id, "rejected")}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  {r.status === "approved" && (
                    <Button variant="outline" size="sm" className="text-red-600 gap-1.5" onClick={() => handleModerate(r.id, "rejected")}>
                      <X className="h-4 w-4" /> Unpublish
                    </Button>
                  )}
                  {r.status === "rejected" && (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5" onClick={() => handleModerate(r.id, "approved")}>
                      <Check className="h-4 w-4" /> Restore
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="gap-1.5 ml-auto">
                    <Flag className="h-4 w-4" /> Flag
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
