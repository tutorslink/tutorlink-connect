import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";
import { appwrite } from "@/integrations/appwrite/client";

export const Route = createFileRoute("/_authenticated/tutor/reviews")({
  component: TutorReviews,
});

function TutorReviews() {
  const [reviews, setReviews] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    (async () => {
      const { data: userData } = await appwrite.auth.getUser();
      const uid = userData.user?.id;
      if (uid) {
        const data = await DataStore.getReviewsForTutor(uid);
        setReviews(data);
      }
      setLoading(false);
    })();
  }, []);

  const handleResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;
    await DataStore.addTutorResponse(reviewId, responseText);
    toast.success("Response published");
    setRespondingTo(null);
    setResponseText("");
    const { data: userData } = await appwrite.auth.getUser();
    if (userData.user?.id) {
      const data = await DataStore.getReviewsForTutor(userData.user.id);
      setReviews(data);
    }
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
        title="Reviews"
        description="Feedback from your students. Respond to reviews to build trust."
      />

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Reviews Yet"
          description="Once students submit reviews, they'll appear here."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                      {(r.student?.display_name || "S")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {r.student?.display_name || "Anonymous Student"}
                      </p>
                      <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-500" : "text-muted-foreground"}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <p className="text-sm text-muted-foreground italic mt-2">"{r.comment}"</p>

                {r.tutor_response && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg border-l-2 border-blue-500">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Your Response:
                    </p>
                    <p className="text-sm text-muted-foreground">{r.tutor_response}</p>
                  </div>
                )}

                {!r.tutor_response && r.status === "approved" && (
                  <div className="mt-3 pt-3 border-t">
                    {respondingTo === r.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Write a professional response..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleResponse(r.id)}
                          >
                            <Send className="h-3.5 w-3.5" /> Publish Response
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRespondingTo(null);
                              setResponseText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setRespondingTo(r.id)}
                      >
                        <MessageSquare className="h-4 w-4" /> Respond
                      </Button>
                    )}
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
