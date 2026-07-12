import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Moon, Bell, Shield, Globe } from "lucide-react";
import { PageHeader } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    maintenanceMode: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <PageHeader title="Settings" description="Configure platform-wide settings." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-blue-600" /> Platform Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform Name</label>
              <Input defaultValue="Tutors Link" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support Email</label>
              <Input type="email" defaultValue="support@tutorslink.me" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Temporarily disable public access</p>
              </div>
              <Switch checked={settings.maintenanceMode} onCheckedChange={() => toggle("maintenanceMode")} />
            </div>
            <Button size="sm" onClick={() => toast.success("Settings saved")}>Save Configuration</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-blue-600" /> Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive platform alerts via email</p>
              </div>
              <Switch checked={settings.emailNotifications} onCheckedChange={() => toggle("emailNotifications")} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Browser push for critical alerts</p>
              </div>
              <Switch checked={settings.pushNotifications} onCheckedChange={() => toggle("pushNotifications")} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Weekly Reports</p>
                <p className="text-xs text-muted-foreground">Automated performance summaries</p>
              </div>
              <Switch checked={settings.weeklyReports} onCheckedChange={() => toggle("weeklyReports")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-blue-600" /> Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success("Password updated")}>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Moon className="h-4 w-4 text-blue-600" /> Appearance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme across the dashboard</p>
              </div>
              <Switch checked={settings.darkMode} onCheckedChange={() => toggle("darkMode")} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
