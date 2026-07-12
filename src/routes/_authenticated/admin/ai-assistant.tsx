import { createFileRoute } from "@tanstack/react-router";
import { Bot, MessageCircle, Sparkles } from "lucide-react";
import { PageHeader, StatCard } from "@/components/portal-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin/ai-assistant")({
  component: AdminAIAssistant,
});

function AdminAIAssistant() {
  return (
    <div>
      <PageHeader title="AI Assistant" description="Configure and monitor the AI chatbot assistant." />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={MessageCircle} label="Conversations (30d)" value={342} color="text-blue-600 bg-blue-50 dark:bg-blue-950/30" />
        <StatCard icon={Sparkles} label="Avg Confidence" value="92%" color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
        <StatCard icon={Bot} label="Status" value="Active" color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable AI Assistant</p>
                <p className="text-xs text-muted-foreground">Show the chatbot widget on public pages</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Tutor Recommendations</p>
                <p className="text-xs text-muted-foreground">Allow AI to recommend tutors from database</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-escalate to Human</p>
                <p className="text-xs text-muted-foreground">Forward complex queries to support</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Conversations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { user: "Visitor", msg: "Looking for a math tutor for A-Level", time: "2 min ago", status: "resolved" },
              { user: "Visitor", msg: "How do I apply as a tutor?", time: "15 min ago", status: "resolved" },
              { user: "Visitor", msg: "What subjects are available?", time: "1 hour ago", status: "resolved" },
              { user: "Visitor", msg: "Need help with SAT preparation", time: "2 hours ago", status: "escalated" },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{c.msg}</p>
                  <p className="text-xs text-muted-foreground">{c.user} · {c.time}</p>
                </div>
                <Badge variant={c.status === "resolved" ? "default" : "destructive"}>{c.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
