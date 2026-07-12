import { createFileRoute } from "@tanstack/react-router";
import { APP_VERSION } from "@/lib/config";

/**
 * Public health check — used for uptime monitoring and post-deploy smoke tests.
 * Returns only non-sensitive metadata. See docs/DEPLOYMENT.md §6.
 */
export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            ok: true,
            version: APP_VERSION,
            ts: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
            },
          },
        );
      },
    },
  },
});
