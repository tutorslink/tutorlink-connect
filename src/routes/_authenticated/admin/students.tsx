import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Search, Plus, Loader2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";
import { ID } from "@/integrations/appwrite/client";

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: AdminStudents,
});

// ---------- Create Student Modal ----------
function CreateStudentModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Full name and email are required.");
      return;
    }
    setLoading(true);
    try {
      await DataStore.saveUserRecord({
        id: ID.unique(),
        email: email.trim(),
        displayName: name.trim(),
        role,
      });
      toast.success("Student created successfully.");
      setName("");
      setEmail("");
      setRole("student");
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label>Full Name <span className="text-destructive">*</span></Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" />
          </div>
          <div>
            <Label>Email <span className="text-destructive">*</span></Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="website_manager">Website Manager</SelectItem>
                <SelectItem value="recruitment">Recruitment</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Page ----------
function AdminStudents() {
  const [students, setStudents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    const data = await DataStore.getAllStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
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

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
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
                  key={s.id as string}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                      {(s.name || s.email || "S")
                        .toString()
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.name as string || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{s.email as string}</p>
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

      <CreateStudentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadStudents}
      />
    </div>
  );
}
