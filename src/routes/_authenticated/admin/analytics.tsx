import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, GraduationCap, Star, BookOpen, DollarSign } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AdminAnalytics,
});

const enrollmentData = [
  { month: "Jan", students: 120, tutors: 15 },
  { month: "Feb", students: 145, tutors: 18 },
  { month: "Mar", students: 180, tutors: 22 },
  { month: "Apr", students: 210, tutors: 28 },
  { month: "May", students: 250, tutors: 35 },
  { month: "Jun", students: 290, tutors: 42 },
  { month: "Jul", students: 320, tutors: 48 },
];

const lessonData = [
  { month: "Jan", lessons: 450 },
  { month: "Feb", lessons: 520 },
  { month: "Mar", lessons: 680 },
  { month: "Apr", lessons: 750 },
  { month: "May", lessons: 920 },
  { month: "Jun", lessons: 1100 },
  { month: "Jul", lessons: 1350 },
];

const chartConfig = {
  students: { label: "Students", color: "oklch(0.546 0.245 262.881)" },
  tutors: { label: "Tutors", color: "oklch(0.646 0.222 41.116)" },
  lessons: { label: "Lessons", color: "oklch(0.6 0.118 184.704)" },
} satisfies ChartConfig;

function AdminAnalytics() {
  return (
    <div>
      <PageHeader title="Analytics" description="Platform performance metrics and trends." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={1770} color="text-blue-600 bg-blue-50 dark:bg-blue-950/30" />
        <StatCard icon={GraduationCap} label="Active Tutors" value={124} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
        <StatCard icon={BookOpen} label="Lessons (30d)" value={1350} color="text-amber-600 bg-amber-50 dark:bg-amber-950/30" />
        <StatCard icon={DollarSign} label="Revenue (30d)" value="$24.5K" color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Enrollment Growth</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={enrollmentData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="var(--color-students)" radius={4} />
                <Bar dataKey="tutors" fill="var(--color-tutors)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Lessons Delivered</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <LineChart data={lessonData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="lessons" stroke="var(--color-lessons)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top Subjects by Enrollment</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", count: 340, pct: 100 },
              { subject: "English Literature", count: 285, pct: 84 },
              { subject: "Physics", count: 220, pct: 65 },
              { subject: "Chemistry", count: 195, pct: 57 },
              { subject: "Computer Science", count: 180, pct: 53 },
              { subject: "Biology", count: 160, pct: 47 },
            ].map(s => (
              <div key={s.subject} className="flex items-center gap-4">
                <span className="text-sm font-medium w-40">{s.subject}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
