import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { PageHeader, StatCard, EmptyState } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/portal-shared";

export const Route = createFileRoute("/_authenticated/tutor/earnings")({
  component: TutorEarnings,
});

const mockPayments = [
  {
    id: "p1",
    date: "2026-07-10",
    amount: 240,
    status: "paid",
    description: "Week of Jul 3-9 (4 lessons)",
  },
  {
    id: "p2",
    date: "2026-07-03",
    amount: 180,
    status: "paid",
    description: "Week of Jun 26-Jul 2 (3 lessons)",
  },
  {
    id: "p3",
    date: "2026-07-17",
    amount: 320,
    status: "upcoming",
    description: "Week of Jul 10-16 (5 lessons)",
  },
];

function TutorEarnings() {
  return (
    <div>
      <PageHeader title="Earnings" description="Your payment history and upcoming payouts." />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Clock}
          label="Outstanding"
          value="$320"
          color="text-amber-600 bg-amber-50 dark:bg-amber-950/30"
        />
        <StatCard
          icon={CheckCircle}
          label="Total Paid"
          value="$2,840"
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value="$740"
          color="text-blue-600 bg-blue-50 dark:bg-blue-950/30"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {mockPayments.length === 0 ? (
            <EmptyState icon={DollarSign} title="No payment records yet." />
          ) : (
            <div className="space-y-3">
              {mockPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-sm">{payment.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">${payment.amount}</span>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4 pt-3 border-t">
            All financial values are informational records only. Payment processing is handled
            internally by Alvey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
