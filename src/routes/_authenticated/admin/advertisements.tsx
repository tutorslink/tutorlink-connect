import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Megaphone, Eye, Power } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState } from "@/components/portal-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/admin/advertisements")({
  component: AdminAdvertisements,
});

function AdminAdvertisements() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await DataStore.getAdvertisements();
      setAds(data);
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
      <PageHeader title="Advertisements" description="Manage tutor advertisements and listings." />
      {ads.length === 0 ? (
        <EmptyState icon={Megaphone} title="No Advertisements" description="No tutor advertisements have been created yet." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {ads.map((ad) => (
            <Card key={ad.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{ad.title}</p>
                    <p className="text-xs text-muted-foreground">by {ad.tutor?.display_name || "Tutor"}</p>
                    <p className="text-sm font-bold mt-1">
                      ${ad.monthly_price || ad.price}{ad.monthly_price ? "/mo" : "/hr"}
                    </p>
                    {ad.teaching_format && (
                      <p className="text-xs text-muted-foreground capitalize">{ad.teaching_format}</p>
                    )}
                  </div>
                  <StatusBadge status={ad.advertisement_status || (ad.is_active ? "active" : "paused")} />
                </div>
                {ad.description && <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="gap-1.5 flex-1"><Eye className="h-4 w-4" /> View</Button>
                  <Button variant="outline" size="sm" className="gap-1.5 flex-1">
                    <Power className="h-4 w-4" /> {ad.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
