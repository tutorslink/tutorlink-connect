import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/settings")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold capitalize">settings</h1>
        <p className="text-muted-foreground mt-1">Manage your settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Feature Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
