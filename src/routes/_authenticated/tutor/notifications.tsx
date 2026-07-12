import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/tutor/notifications")({
  component: TutorNotifications,
});

const mockNotifications = [
  { id: "n1", title: "New student assigned", body: "James Park has been assigned to you for Calculus.", time: "2 hours ago", unread: true, type: "info" },
  { id: "n2", title: "New review received", body: "Emma Wilson left a 5-star review on your profile.", time: "1 day ago", unread: true, type: "success" },
  { id: "n3", title: "Payment processed", body: "$240 has been sent to your account for the week of Jul 3-9.", time: "2 days ago", unread: false, type: "info" },
  { id: "n4", title: "Lesson reminder", body: "Your lesson with Sofia Garcia is scheduled for tomorrow at 2:00 PM.", time: "3 days ago", unread: false, type: "warning" },
];

function TutorNotifications() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated on platform activity."
        action={
          <Button variant="outline" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" /> Mark All Read
          </Button>
        }
      />

      {mockNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications." />
      ) : (
        <div className="space-y-3">
          {mockNotifications.map((notif) => (
            <Card key={notif.id} className={notif.unread ? "border-blue-200 bg-blue-50/30 dark:bg-blue-950/10" : ""}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.unread ? "bg-blue-500" : "bg-muted"}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm">{notif.title}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notif.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
