import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/cms")({
  component: CMSDashboard,
});

function CMSDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <p className="text-muted-foreground mt-1">
          Manage public website content, testimonials, and announcements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Homepage Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Edit hero section, statistics, and marketing copy.
            </p>
            <Button variant="outline" className="w-full">
              Edit Homepage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Testimonials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage and approve student testimonials.
            </p>
            <div className="flex justify-between items-center text-sm">
              <span>Pending Review</span>
              <Badge variant="secondary">3</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Manage Testimonials
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Static Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update About, Contact, Privacy Policy, and Terms of Service.
            </p>
            <Button variant="outline" className="w-full">
              Edit Pages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
