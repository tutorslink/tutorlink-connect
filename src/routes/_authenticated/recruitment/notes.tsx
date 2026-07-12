import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StickyNote, Plus, Trash2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/recruitment/notes")({
  component: InternalNotes,
});

interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

const initialNotes: Note[] = [
  { id: "n1", title: "Laura Bennett - Initial Review", content: "Strong background in academic recruitment. Previous experience at Cambridge Admissions is a plus. Recommend moving to interview stage.", author: "Recruitment Team", date: "2026-07-11" },
  { id: "n2", title: "Tom Anderson - Technical Assessment", content: "Need to schedule a technical interview. Portfolio shows strong full-stack work but want to assess React/TanStack familiarity.", author: "Recruitment Team", date: "2026-07-10" },
];

function InternalNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addNote = () => {
    if (!title.trim() || !content.trim()) return;
    setNotes(prev => [{
      id: "n" + Date.now(),
      title,
      content,
      author: "Recruitment Team",
      date: new Date().toISOString().split("T")[0],
    }, ...prev]);
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <PageHeader title="Internal Notes" description="Private notes shared across the recruitment team." action={
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" /> New Note
        </Button>
      } />

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-5 space-y-3">
            <Input placeholder="Note title..." value={title} onChange={e => setTitle(e.target.value)} />
            <Textarea placeholder="Note content..." value={content} onChange={e => setContent(e.target.value)} rows={4} />
            <div className="flex gap-2">
              <Button onClick={addNote} size="sm">Save Note</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} size="sm">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {notes.length === 0 ? (
        <EmptyState icon={StickyNote} title="No Notes" description="Internal notes will appear here." />
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <Card key={note.id}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{note.title}</h3>
                    <p className="text-xs text-muted-foreground">{note.author} · {new Date(note.date).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)} className="h-8 w-8 text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
