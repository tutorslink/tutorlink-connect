import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bot, MessageCircle, Sparkles, Save } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataStore } from "@/lib/data-store";

export const Route = createFileRoute("/_authenticated/admin/ai-assistant")({
  component: AdminAIAssistant,
});

function AdminAIAssistant() {
  const [config, setConfig] = useState({
    enabled: true,
    welcome_message: "Hi! I am the Alvey AI Assistant, ask me questions but dont bully me...",
    lead_capture: true,
    tutor_recommendations: true,
    auto_escalate: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await DataStore.getPlatformSetting("ai_config");
      if (saved) {
        setConfig((prev) => ({ ...prev, ...saved }));
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await DataStore.savePlatformSetting("ai_config", config);
      toast.success("AI Assistant configuration saved");
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Configure and monitor the AI chatbot assistant."
        action={
          <Button size="sm" className="gap-2" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Configuration"}
          </Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={MessageCircle}
          label="Conversations (30d)"
          value={342}
          color="text-blue-600 bg-blue-50 dark:bg-blue-950/30"
        />
        <StatCard
          icon={Sparkles}
          label="Avg Confidence"
          value="92%"
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
        />
        <StatCard
          icon={Bot}
          label="Status"
          value={config.enabled ? "Active" : "Disabled"}
          color={
            config.enabled
              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
              : "text-red-600 bg-red-50 dark:bg-red-950/30"
          }
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable AI Assistant</p>
                <p className="text-xs text-muted-foreground">
                  Show the chatbot widget on public pages
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(v) => setConfig({ ...config, enabled: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Tutor Recommendations</p>
                <p className="text-xs text-muted-foreground">
                  Allow AI to recommend tutors from database
                </p>
              </div>
              <Switch
                checked={config.tutor_recommendations}
                onCheckedChange={(v) => setConfig({ ...config, tutor_recommendations: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lead Capture</p>
                <p className="text-xs text-muted-foreground">
                  Encourage visitors to contact or apply
                </p>
              </div>
              <Switch
                checked={config.lead_capture}
                onCheckedChange={(v) => setConfig({ ...config, lead_capture: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-escalate to Human</p>
                <p className="text-xs text-muted-foreground">Forward complex queries to support</p>
              </div>
              <Switch
                checked={config.auto_escalate}
                onCheckedChange={(v) => setConfig({ ...config, auto_escalate: v })}
              />
            </div>
            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Welcome Message
              </label>
              <Textarea
                value={config.welcome_message}
                onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                user: "Visitor",
                msg: "Looking for a math tutor for A-Level",
                time: "2 min ago",
                status: "resolved",
              },
              {
                user: "Visitor",
                msg: "How do I apply as a tutor?",
                time: "15 min ago",
                status: "resolved",
              },
              {
                user: "Visitor",
                msg: "What subjects are available?",
                time: "1 hour ago",
                status: "resolved",
              },
              {
                user: "Visitor",
                msg: "Need help with SAT preparation",
                time: "2 hours ago",
                status: "escalated",
              },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{c.msg}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.user} · {c.time}
                  </p>
                </div>
                <Badge variant={c.status === "resolved" ? "default" : "destructive"}>
                  {c.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
