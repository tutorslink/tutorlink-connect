import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  CalendarClock,
  Plus,
  ReceiptText,
  ShieldAlert,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, StatCard, EmptyState, StatusBadge } from "@/components/portal-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { appwrite } from "@/integrations/appwrite/client";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/owner/finance")({
  component: OwnerFinance,
});

type FinanceType = "earning" | "expense" | "owed" | "owing";
type FinanceStatus = "paid" | "pending" | "overdue" | "planned";

type FinanceEntry = {
  id: string;
  type: FinanceType;
  title: string;
  amount: number;
  category: string;
  status: FinanceStatus;
  date: string;
  notes?: string;
};

const initialEntries: FinanceEntry[] = [
  {
    id: "fin-1",
    type: "earning",
    title: "July tutoring package payments",
    amount: 8400,
    category: "Lessons",
    status: "paid",
    date: "2026-07-02",
  },
  {
    id: "fin-2",
    type: "earning",
    title: "Placement consultation fees",
    amount: 1850,
    category: "Consultations",
    status: "paid",
    date: "2026-07-08",
  },
  {
    id: "fin-3",
    type: "expense",
    title: "Marketing campaign",
    amount: 620,
    category: "Marketing",
    status: "paid",
    date: "2026-07-11",
  },
  {
    id: "fin-4",
    type: "owed",
    title: "Tutor payout batch",
    amount: 3200,
    category: "Tutor payouts",
    status: "pending",
    date: "2026-07-20",
  },
  {
    id: "fin-5",
    type: "owing",
    title: "Corporate student invoice",
    amount: 2750,
    category: "Invoices",
    status: "overdue",
    date: "2026-07-15",
  },
  {
    id: "fin-6",
    type: "expense",
    title: "Appwrite and tooling",
    amount: 210,
    category: "Software",
    status: "planned",
    date: "2026-07-24",
  },
];

const typeLabels: Record<FinanceType, string> = {
  earning: "Earning",
  expense: "Expense",
  owed: "Amount owed",
  owing: "Amount owing",
};

const chartConfig = {
  earnings: { label: "Earnings", color: "oklch(0.596 0.145 163.225)" },
  expenses: { label: "Expenses", color: "oklch(0.704 0.191 22.216)" },
  profit: { label: "Net", color: "oklch(0.546 0.245 262.881)" },
  value: { label: "Amount", color: "oklch(0.645 0.246 16.439)" },
} satisfies ChartConfig;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function OwnerFinance() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [entries, setEntries] = useState<FinanceEntry[]>(initialEntries);
  const [form, setForm] = useState({
    type: "expense" as FinanceType,
    title: "",
    amount: "",
    category: "",
    status: "pending" as FinanceStatus,
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await appwrite.auth.getUser();
      const uid = data.user?.id;
      if (!uid) {
        setAuthorized(false);
        return;
      }
      const roles = await DataStore.getUserRoles(uid);
      setAuthorized(roles.includes("owner"));
    })();
  }, []);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc[entry.type] += entry.amount;
        return acc;
      },
      { earning: 0, expense: 0, owed: 0, owing: 0 } as Record<FinanceType, number>,
    );
  }, [entries]);

  const netPosition = totals.earning + totals.owing - totals.expense - totals.owed;
  const recentEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const monthlyData = useMemo(() => {
    const months = ["Mar", "Apr", "May", "Jun", "Jul"];
    const baseline = [
      { month: "Mar", earnings: 5200, expenses: 1800 },
      { month: "Apr", earnings: 6100, expenses: 2200 },
      { month: "May", earnings: 6900, expenses: 2400 },
      { month: "Jun", earnings: 7600, expenses: 2700 },
      { month: "Jul", earnings: 0, expenses: 0 },
    ];

    const july = entries.reduce(
      (acc, entry) => {
        if (entry.type === "earning" || entry.type === "owing") acc.earnings += entry.amount;
        if (entry.type === "expense" || entry.type === "owed") acc.expenses += entry.amount;
        return acc;
      },
      { earnings: 0, expenses: 0 },
    );

    return baseline.map((month) => {
      const values = month.month === "Jul" ? july : month;
      return {
        month: months.includes(month.month) ? month.month : "Jul",
        earnings: values.earnings,
        expenses: values.expenses,
        profit: values.earnings - values.expenses,
      };
    });
  }, [entries]);

  const breakdownData = [
    { name: "Earnings", value: totals.earning, color: "oklch(0.596 0.145 163.225)" },
    { name: "Expenses", value: totals.expense, color: "oklch(0.704 0.191 22.216)" },
    { name: "Owed", value: totals.owed, color: "oklch(0.646 0.222 41.116)" },
    { name: "Owing", value: totals.owing, color: "oklch(0.546 0.245 262.881)" },
  ].filter((item) => item.value > 0);

  const addEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.title.trim() || !form.category.trim() || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    setEntries((current) => [
      {
        id: `fin-${Date.now()}`,
        type: form.type,
        title: form.title.trim(),
        amount,
        category: form.category.trim(),
        status: form.status,
        date: form.date,
        notes: form.notes.trim() || undefined,
      },
      ...current,
    ]);
    setForm({
      type: "expense",
      title: "",
      amount: "",
      category: "",
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
  };

  if (authorized === null) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div>
        <PageHeader title="Finances" description="Owner-only finance dashboard." />
        <EmptyState
          icon={ShieldAlert}
          title="Access Restricted"
          description="Financial records are only available to users with the Owner role."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Finances"
        description="Track earnings, expenses, outstanding payouts, and expected receivables."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={Banknote}
          label="Earnings"
          value={currency.format(totals.earning)}
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
        />
        <StatCard
          icon={ReceiptText}
          label="Expenses"
          value={currency.format(totals.expense)}
          color="text-red-600 bg-red-50 dark:bg-red-950/30"
        />
        <StatCard
          icon={ArrowUpCircle}
          label="Amount Owed"
          value={currency.format(totals.owed)}
          color="text-amber-600 bg-amber-50 dark:bg-amber-950/30"
        />
        <StatCard
          icon={ArrowDownCircle}
          label="Amount Owing"
          value={currency.format(totals.owing)}
          color="text-blue-600 bg-blue-50 dark:bg-blue-950/30"
        />
        <StatCard
          icon={TrendingUp}
          label="Net Position"
          value={currency.format(netPosition)}
          color="text-violet-600 bg-violet-50 dark:bg-violet-950/30"
        />
      </div>

      <div className="grid xl:grid-cols-[1fr_340px] gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={monthlyData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="var(--color-earnings)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-expenses)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--color-profit)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={breakdownData} dataKey="value" nameKey="name" innerRadius={62}>
                  {breakdownData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {breakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{currency.format(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid xl:grid-cols-[360px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Manual Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addEntry} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="finance-type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, type: value as FinanceType }))
                  }
                >
                  <SelectTrigger id="finance-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="finance-title">Title</Label>
                <Input
                  id="finance-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Tutor payout, invoice, software..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="finance-amount">Amount</Label>
                  <Input
                    id="finance-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, amount: event.target.value }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-date">Date</Label>
                  <Input
                    id="finance-date"
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, date: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="finance-category">Category</Label>
                  <Input
                    id="finance-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value }))
                    }
                    placeholder="Lessons"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, status: value as FinanceStatus }))
                    }
                  >
                    <SelectTrigger id="finance-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="finance-notes">Notes</Label>
                <Textarea
                  id="finance-notes"
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Optional context for this record"
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="font-medium">{entry.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.category}
                          {entry.notes ? ` · ${entry.notes}` : ""}
                        </div>
                      </TableCell>
                      <TableCell>{typeLabels[entry.type]}</TableCell>
                      <TableCell>
                        <StatusBadge status={entry.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {currency.format(entry.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outstanding Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <BarChart
                  data={[
                    { label: "Owed", value: totals.owed },
                    { label: "Owing", value: totals.owing },
                    { label: "Expenses", value: totals.expense },
                    { label: "Earnings", value: totals.earning },
                  ]}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={6} />
                </BarChart>
              </ChartContainer>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                Manual records are not persisted yet. Wire this page to Appwrite when ready.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
