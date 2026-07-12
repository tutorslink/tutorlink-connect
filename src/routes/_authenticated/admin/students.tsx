import { createFileRoute } from "@tanstack/react-router";
import { Users, Search } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: AdminStudents,
});

const students = [
  { id: "s1", name: "Emma Johnson", email: "emma.j@email.com", tutors: 2, lessons: 24, status: "active" },
  { id: "s2", name: "Liam O'Connor", email: "liam.o@email.com", tutors: 1, lessons: 12, status: "active" },
  { id: "s3", name: "Amira Patel", email: "amira.p@email.com", tutors: 3, lessons: 36, status: "active" },
  { id: "s4", name: "Noah Williams", email: "noah.w@email.com", tutors: 1, lessons: 8, status: "inactive" },
  { id: "s5", name: "Olivia Brown", email: "olivia.b@email.com", tutors: 2, lessons: 18, status: "active" },
];

function AdminStudents() {
  return (
    <div>
      <PageHeader title="Students" description="Manage all registered students on the platform." />

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-9" />
      </div>

      {students.length === 0 ? (
        <EmptyState icon={Users} title="No Students" description="No students have registered yet." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {students.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                      {s.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email} · {s.tutors} tutors · {s.lessons} lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      {s.status}
                    </span>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
