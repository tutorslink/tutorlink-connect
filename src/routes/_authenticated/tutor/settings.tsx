import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Moon, Sun, Key, Shield } from "lucide-react";
import { PageHeader } from "@/components/portal-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tutor/settings")({
  component: TutorSettings,
});

function TutorSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifLessons, setNotifLessons] = useState(true);
  const [notifReviews, setNotifReviews] = useState(true);
  const [notifAnnouncements, setNotifAnnouncements] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const handleChangePassword = () => {
    if (!oldPw || !newPw) {
      toast.error("Please fill in both password fields.");
      return;
    }
    toast.success("Password changed successfully.");
    setOldPw("");
    setNewPw("");
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your preferences and account security." />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" /> Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Email Notifications", desc: "Receive notifications via email", value: notifEmail, setter: setNotifEmail },
              { label: "Lesson Reminders", desc: "Get reminded about upcoming lessons", value: notifLessons, setter: setNotifLessons },
              { label: "Review Alerts", desc: "Notify when a student leaves a review", value: notifReviews, setter: setNotifReviews },
              { label: "Platform Announcements", desc: "General platform updates and news", value: notifAnnouncements, setter: setNotifAnnouncements },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.setter} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2 border-t">
              Some critical security notifications cannot be disabled.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4" /> Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
              <Input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
              <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="rounded-xl" />
            </div>
            <Button onClick={handleChangePassword} variant="outline">
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" /> Connected Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Google</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
              <Button variant="outline" size="sm">Disconnect</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
