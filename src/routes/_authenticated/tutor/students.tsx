import { createFileRoute } from "@tanstack/react-router";
import { Users, User, Clock, Globe, BookOpen } from "lucide-react";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/tutor/students")({
  component: TutorStudents,
});

const mockStudents = [
  {
    id: "s1",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    subjects: ["Mathematics", "Calculus"],
    level: "A-Level",
    status: "active",
    remaining: 8,
    nextLesson: "Today, 4:00 PM",
    timezone: "GMT+0 (London)",
  },
  {
    id: "s2",
    name: "James Park",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    subjects: ["Calculus"],
    level: "University",
    status: "active",
    remaining: 12,
    nextLesson: "Tomorrow, 10:00 AM",
    timezone: "GMT+9 (Seoul)",
  },
  {
    id: "s3",
    name: "Sofia Garcia",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    subjects: ["Statistics"],
    level: "IB",
    status: "active",
    remaining: 4,
    nextLesson: "Wed, Jul 15, 2:00 PM",
    timezone: "GMT-5 (New York)",
  },
];

function TutorStudents() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedStudent = mockStudents.find((s) => s.id === selected);

  return (
    <div>
      <PageHeader title="My Students" description="Students currently assigned to you." />

      {mockStudents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students have been assigned yet."
          description="New student assignments will appear here."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-12 w-12 rounded-full object-cover border"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{student.name}</h3>
                    <p className="text-xs text-muted-foreground">{student.level}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {student.subjects.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Next: {student.nextLesson}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" /> Remaining: {student.remaining} lessons
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" /> {student.timezone}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <StatusBadge status={student.status} />
                  <Button variant="ghost" size="sm" onClick={() => setSelected(student.id)}>
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="h-16 w-16 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedStudent.level}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Subjects</span>
                  <span className="font-medium">{selectedStudent.subjects.join(", ")}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Remaining Lessons</span>
                  <span className="font-medium">{selectedStudent.remaining}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Next Lesson</span>
                  <span className="font-medium">{selectedStudent.nextLesson}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Timezone</span>
                  <span className="font-medium">{selectedStudent.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={selectedStudent.status} />
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSelected(null)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
