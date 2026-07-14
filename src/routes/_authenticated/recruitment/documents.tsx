import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Eye } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/recruitment/documents")({
  component: RecruitmentDocuments,
});

const documents = [
  {
    id: 1,
    name: "Resume_Laura_Bennett.pdf",
    candidate: "Laura Bennett",
    type: "PDF",
    size: "245 KB",
    date: "2026-07-11",
  },
  {
    id: 2,
    name: "Cover_Letter.pdf",
    candidate: "Laura Bennett",
    type: "PDF",
    size: "128 KB",
    date: "2026-07-11",
  },
  {
    id: 3,
    name: "Tom_Anderson_CV.pdf",
    candidate: "Tom Anderson",
    type: "PDF",
    size: "312 KB",
    date: "2026-07-10",
  },
  {
    id: 4,
    name: "Portfolio_Link.pdf",
    candidate: "Tom Anderson",
    type: "PDF",
    size: "89 KB",
    date: "2026-07-10",
  },
  {
    id: 5,
    name: "Priya_Sharma_Resume.docx",
    candidate: "Priya Sharma",
    type: "DOCX",
    size: "198 KB",
    date: "2026-07-09",
  },
];

function RecruitmentDocuments() {
  return (
    <div>
      <PageHeader
        title="Documents"
        description="All documents submitted by recruitment candidates."
      />
      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Documents"
          description="No documents have been submitted yet."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.candidate} · {doc.type} · {doc.size} ·{" "}
                        {new Date(doc.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" /> Download
                    </Button>
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
