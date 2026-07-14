import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: AdminStudents,
});

function AdminStudents() {
  const [students, setStudents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await DataStore.getAllStudents();
      setStudents(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Students" description="Manage all registered students on the platform." />

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-9" />
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Students"
          description="No students have registered yet."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                      {(s.name || s.email || "S")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
