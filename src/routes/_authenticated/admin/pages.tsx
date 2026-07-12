import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, Pencil } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: AdminPages,
});

const pages = [
  { id: "p1", title: "About Us", slug: "/about", lastUpdated: "2026-07-10", status: "published" },
  { id: "p2", title: "Contact", slug: "/contact", lastUpdated: "2026-07-08", status: "published" },
  { id: "p3", title: "Privacy Policy", slug: "/privacy", lastUpdated: "2026-06-15", status: "published" },
  { id: "p4", title: "Terms of Service", slug: "/terms", lastUpdated: "2026-06-15", status: "published" },
  { id: "p5", title: "FAQs", slug: "/faqs", lastUpdated: "2026-07-05", status: "draft" },
];

function AdminPages() {
  return (
    <div>
      <PageHeader title="Static Pages" description="Manage website content pages." action={
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Page</Button>
      } />
      {pages.length === 0 ? (
        <EmptyState icon={FileText} title="No Pages" description="No content pages have been created." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map(p => (
            <Card key={p.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.slug}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.status === "published" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Last updated: {new Date(p.lastUpdated).toLocaleDateString()}</p>
                <Button variant="outline" size="sm" className="w-full gap-1.5"><Pencil className="h-4 w-4" /> Edit Page</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
