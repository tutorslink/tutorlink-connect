import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Eye, Power } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/advertisements")({
  component: AdminAdvertisements,
});

const ads = [
  { id: "ad1", tutor: "Dr. Alexander Sterling", title: "Advanced Mathematics Tutoring", price: 65, status: "active" },
  { id: "ad2", tutor: "Sophia Martinez", title: "SAT English & Essay Writing", price: 45, status: "active" },
  { id: "ad3", tutor: "Marcus Chen", title: "Python & Web Development", price: 55, status: "pending" },
  { id: "ad4", tutor: "Elena Rostova", title: "Pre-Med Biology & Chemistry", price: 50, status: "active" },
];

function AdminAdvertisements() {
  return (
    <div>
      <PageHeader title="Advertisements" description="Manage tutor advertisements and listings." />
      {ads.length === 0 ? (
        <EmptyState icon={Megaphone} title="No Advertisements" description="No tutor advertisements have been created." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {ads.map(ad => (
            <Card key={ad.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{ad.title}</p>
                    <p className="text-xs text-muted-foreground">by {ad.tutor}</p>
                    <p className="text-sm font-bold mt-1">${ad.price}/hr</p>
                  </div>
                  <StatusBadge status={ad.status} />
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="gap-1.5 flex-1"><Eye className="h-4 w-4" /> View</Button>
                  <Button variant="outline" size="sm" className="gap-1.5 flex-1"><Power className="h-4 w-4" /> {ad.status === "active" ? "Deactivate" : "Activate"}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
