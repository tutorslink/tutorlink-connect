import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/recruitment/notifications")({
  component: RecruitmentNotifications,
});

const notifications = [
  { id: 1, title: "New Application Submitted", body: "Laura Bennett applied for Recruitment Coordinator.", date: "2026-07-11T10:00:00Z", isRead: false, type: "info" },
  { id: 2, title: "Application Status Updated", body: "Tom Anderson's application is now under review.", date: "2026-07-10T14:30:00Z", isRead: false, type: "info" },
  { id: 3, title: "Application Approved", body: "James Wilson has been approved for Content Writer.", date: "2026-07-08T09:15:00Z", isRead: true, type: "success" },
  { id: 4, title: "Weekly Summary", body: "5 new applications received this week.", date: "2026-07-07T08:00:00Z", isRead: true, type: "info" },
];

function RecruitmentNotifications() {
  return (
    <div>
      <PageHeader title="Notifications" description="Stay updated on recruitment activity." action={
        <Button variant="outline" size="sm" className="gap-2"><CheckCheck className="h-4 w-4" /> Mark All Read</Button>
      } />

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No Notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <Card key={n.id} className={n.isRead ? "" : "border-blue-300 bg-blue-50/30 dark:bg-blue-950/10"}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.isRead ? "bg-muted" : "bg-blue-500"}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">{n.title}</p>
                    <span className="text-xs text-muted-foreground">{new Date(n.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
