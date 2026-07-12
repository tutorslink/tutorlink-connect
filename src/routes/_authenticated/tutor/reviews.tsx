import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageSquare } from "lucide-react";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/tutor/reviews")({
  component: TutorReviews,
});

const mockReviews = [
  { id: "r1", student: "Emma Wilson", rating: 5, comment: "Excellent teaching style. Really helped me understand calculus fundamentals.", date: "2026-07-08", status: "approved", response: null },
  { id: "r2", student: "James Park", rating: 5, comment: "Dr. Sterling's approach to problem-solving is incredible. Highly recommend!", date: "2026-07-02", status: "approved", response: "Thank you James, it's been a pleasure teaching you!" },
  { id: "r3", student: "Sofia Garcia", rating: 4, comment: "Very helpful sessions, though I wish we had more time for practice problems.", date: "2026-06-28", status: "pending", response: null },
];

function TutorReviews() {
  return (
    <div>
      <PageHeader title="Reviews" description="Feedback submitted by your students." />

      {mockReviews.length === 0 ? (
        <EmptyState icon={Star} title="You haven't received any reviews." description="Student reviews will appear here once submitted." />
      ) : (
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {review.student.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.student}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <StatusBadge status={review.status} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                {review.response && (
                  <div className="ml-6 p-3 bg-muted/30 rounded-lg border-l-2 border-blue-400">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Your Response</p>
                    <p className="text-sm">{review.response}</p>
                  </div>
                )}
                {!review.response && review.status === "approved" && (
                  <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Write a response
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
