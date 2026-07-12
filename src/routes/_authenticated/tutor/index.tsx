import { createFileRoute } from "@tanstack/react-router";
import { Users, Calendar, Star, Bell, DollarSign, Clock, TrendingUp, MessageSquare } from "lucide-react";
import { PageHeader, StatCard, EmptyState } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tutor/")({
  component: TutorDashboard,
});

function TutorDashboard() {
  return (
    <div>
      <PageHeader title="Tutor Dashboard" description="Your teaching overview at a glance." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Assigned Students" value={3} />
        <StatCard icon={Calendar} label="Upcoming Lessons" value={5} />
        <StatCard icon={Clock} label="Weekly Lessons" value={8} color="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30" />
        <StatCard icon={Star} label="Average Rating" value="4.92" color="text-amber-600 bg-amber-50 dark:bg-amber-950/30" />
        <StatCard icon={MessageSquare} label="Total Reviews" value={47} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
        <StatCard icon={DollarSign} label="Outstanding Payments" value="$320" color="text-purple-600 bg-purple-50 dark:bg-purple-950/30" />
        <StatCard icon={Bell} label="Notifications" value={2} color="text-rose-600 bg-rose-50 dark:bg-rose-950/30" />
        <StatCard icon={TrendingUp} label="This Month" value="+12%" color="text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { student: "Emma Wilson", subject: "Mathematics", date: "Today", time: "4:00 PM - 5:00 PM" },
                { student: "James Park", subject: "Calculus", date: "Tomorrow", time: "10:00 AM - 11:00 AM" },
                { student: "Sofia Garcia", subject: "Statistics", date: "Wed, Jul 15", time: "2:00 PM - 3:00 PM" },
              ].map((lesson, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-200 transition-colors">
                  <div>
                    <p className="font-semibold text-sm">{lesson.subject}</p>
                    <p className="text-xs text-muted-foreground">with {lesson.student}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-blue-600">{lesson.date}</p>
                    <p className="text-xs text-muted-foreground">{lesson.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
              <Link to="/tutor/schedule">View Full Schedule</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium">New student assigned</p>
                  <p className="text-xs text-muted-foreground">James Park has been assigned to you.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium">New review received</p>
                  <p className="text-xs text-muted-foreground">Emma Wilson left a 5-star review.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-muted shrink-0" />
                <div>
                  <p className="text-sm font-medium">Payment processed</p>
                  <p className="text-xs text-muted-foreground">$240 sent to your account.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
