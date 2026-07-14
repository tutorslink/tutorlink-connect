import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Bell, Shield, Save } from "lucide-react";
import { PageHeader } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";
import { appwrite } from "@/integrations/appwrite/client";

export const Route = createFileRoute("/_authenticated/tutor/settings")({
  component: TutorSettings,
});

function TutorSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [prefs, setPrefs] = useState({
    email_notifications: true,
    push_notifications: true,
    lesson_reminders: true,
    announcements: true,
    marketing: false,
  });
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await appwrite.auth.getUser();
      const uid = userData.user?.id || null;
      setUserId(uid);
      if (uid) {
        const saved = await DataStore.getNotificationPreferences(uid);
        if (saved) {
          setPrefs({
            email_notifications: saved.email_notifications,
            push_notifications: saved.push_notifications,
            lesson_reminders: saved.lesson_reminders,
            announcements: saved.announcements,
            marketing: saved.marketing,
          });
        }
      }
    })();
  }, []);

  const handleSavePrefs = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await DataStore.saveNotificationPreferences({ user_id: userId, ...prefs });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your preferences and account settings." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" /> Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive lesson updates and alerts via email
                </p>
              </div>
              <Switch
                checked={prefs.email_notifications}
                onCheckedChange={(v) => setPrefs({ ...prefs, email_notifications: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Browser push for real-time alerts</p>
              </div>
              <Switch
                checked={prefs.push_notifications}
                onCheckedChange={(v) => setPrefs({ ...prefs, push_notifications: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lesson Reminders</p>
                <p className="text-xs text-muted-foreground">Reminders before scheduled lessons</p>
              </div>
              <Switch
                checked={prefs.lesson_reminders}
                onCheckedChange={(v) => setPrefs({ ...prefs, lesson_reminders: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Platform Announcements</p>
                <p className="text-xs text-muted-foreground">Important platform-wide updates</p>
              </div>
              <Switch
                checked={prefs.announcements}
                onCheckedChange={(v) => setPrefs({ ...prefs, announcements: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Marketing Communications</p>
                <p className="text-xs text-muted-foreground">
                  Tips, newsletters, and promotional content
                </p>
              </div>
              <Switch
                checked={prefs.marketing}
                onCheckedChange={(v) => setPrefs({ ...prefs, marketing: v })}
              />
            </div>
            <Button size="sm" className="gap-2" onClick={handleSavePrefs} disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Password
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                New Password
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Password updated")}>
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4 text-blue-600" /> Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme across the portal</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
