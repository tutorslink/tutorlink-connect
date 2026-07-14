import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/recruitment/candidates")({
  component: CandidateDetails,
});

const candidates = [
  {
    id: "app_1",
    name: "Laura Bennett",
    email: "l.bennett@email.com",
    phone: "+1 555-0100",
    position: "Recruitment Coordinator",
    date: "2026-07-11",
    status: "pending",
    coverLetter:
      "I have 5 years of experience in academic recruitment and am passionate about connecting talented educators with students. I previously worked at Cambridge Admissions Office coordinating outreach programs.",
    documents: ["Resume_Laura_Bennett.pdf", "Cover_Letter.pdf"],
    notes: "",
  },
  {
    id: "app_2",
    name: "Tom Anderson",
    email: "t.anderson@email.com",
    phone: "+1 555-0101",
    position: "Website Manager",
    date: "2026-07-10",
    status: "under_review",
    coverLetter:
      "Full-stack developer with 7 years building educational platforms. Led the redesign of EdTech startup LearnFlow's student portal, increasing engagement by 40%.",
    documents: ["Tom_Anderson_CV.pdf", "Portfolio_Link.pdf"],
    notes: "Strong technical background. Schedule technical interview.",
  },
];

function CandidateDetails() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const selected = candidates.find((c) => c.id === selectedId);

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Candidates
        </button>

        <PageHeader title={selected.name} description={selected.position} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" /> {selected.email}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" /> {selected.phone}
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" /> {selected.position}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" /> Applied{" "}
                  {new Date(selected.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={selected.status} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selected.coverLetter}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selected.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                  <CheckCircle className="h-4 w-4" /> Approve
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Clock className="h-4 w-4" /> Mark Under Review
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 gap-2">
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Add internal review notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                />
                <Button size="sm" className="w-full">
                  Save Notes
                </Button>
                {selected.notes && (
                  <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                    <p className="font-semibold mb-1">Previous notes:</p>
                    {selected.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Candidate Details"
        description="Click a candidate to view their full application."
      />
      {candidates.length === 0 ? (
        <EmptyState
          icon={User}
          title="No Candidates"
          description="There are no candidates to review."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((c) => (
            <Card
              key={c.id}
              className="cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => setSelectedId(c.id)}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.position}</p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
