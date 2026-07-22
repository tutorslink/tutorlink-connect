// /api/chatbot — thin proxy to the alvey-ai-brain Appwrite Function.
// All AI logic lives in functions/alvey-ai-brain/src/main.js.
// This route only:
//   1. Resolves the current user's identity (userId + userRole) from the session.
//   2. Forwards the request body + identity to the Appwrite Function via HTTP.
//   3. Returns the function's response verbatim.

import { createFileRoute } from "@tanstack/react-router";
import { Client as AppwriteServerClient, Databases, Account } from "node-appwrite";

// ---------------------------------------------------------------------------
// Config — read from server-side env vars
// ---------------------------------------------------------------------------
const APPWRITE_ENDPOINT          = process.env.APPWRITE_ENDPOINT          || "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID        = process.env.VITE_APPWRITE_PROJECT_ID   || process.env.APPWRITE_PROJECT_ID || "tutorslink";
const APPWRITE_API_KEY           = process.env.APPWRITE_API_KEY           || "";
const APPWRITE_DATABASE_ID       = process.env.APPWRITE_DATABASE_ID       || process.env.VITE_APPWRITE_DATABASE_ID || "Database";
const APPWRITE_FUNCTION_AI_URL   = process.env.APPWRITE_FUNCTION_AI_BRAIN_URL || "";

// ---------------------------------------------------------------------------
// Appwrite server client (API-key auth — no user session needed for DB reads)
// ---------------------------------------------------------------------------
function buildServerClient() {
  const client = new AppwriteServerClient()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);
  return {
    databases: new Databases(client),
    account:   new Account(client),
  };
}

// ---------------------------------------------------------------------------
// Resolve the user's role from the users collection
// ---------------------------------------------------------------------------
async function resolveUserRole(databases: Databases, userId: string): Promise<string> {
  try {
    const doc = await databases.getDocument(APPWRITE_DATABASE_ID, "users", userId);
    return typeof doc.role === "string" && doc.role ? doc.role : "student";
  } catch {
    return "student";
  }
}

// ---------------------------------------------------------------------------
// Resolve the current user from the session cookie forwarded by the browser.
// node-appwrite Account with a session JWT lets us do this server-side.
// ---------------------------------------------------------------------------
async function resolveCurrentUser(
  request: Request,
): Promise<{ userId: string | null; userRole: string | null }> {
  // Grab the Appwrite session cookie if present
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionMatch = cookieHeader.match(/a_session_[^=]+=([^;]+)/);
  const sessionToken = sessionMatch ? decodeURIComponent(sessionMatch[1]) : null;

  if (!sessionToken || !APPWRITE_API_KEY) return { userId: null, userRole: null };

  try {
    const client = new AppwriteServerClient()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setSession(sessionToken);

    const account = new Account(client);
    const user    = await account.get();
    const userId  = (user as { $id?: string; id?: string }).$id
                 || (user as { id?: string }).id
                 || null;

    if (!userId) return { userId: null, userRole: null };

    // Fetch role from DB using the API-key client
    const { databases } = buildServerClient();
    const userRole = await resolveUserRole(databases, userId);

    return { userId, userRole };
  } catch {
    return { userId: null, userRole: null };
  }
}

// ---------------------------------------------------------------------------
// Message normalisation (unchanged from previous implementation)
// ---------------------------------------------------------------------------
type ChatMessage = { role: "user" | "assistant"; content: string };

function normalizeMessages(body: {
  message?: unknown;
  history?: unknown;
  messages?: unknown;
}): ChatMessage[] | undefined {
  if (Array.isArray(body.messages)) {
    return (body.messages as { role?: string; content?: string }[])
      .filter(m => m && typeof m.role === "string" && typeof m.content === "string")
      .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content! }));
  }
  if (typeof body.message !== "string") return undefined;
  const history = Array.isArray(body.history) ? body.history : [];
  return [
    ...(history as { role?: string; content?: string }[])
      .filter(m => m && typeof m.role === "string" && typeof m.content === "string")
      .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content! })),
    { role: "user" as const, content: body.message as string },
  ];
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export const Route = createFileRoute("/api/chatbot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { currentUrl } = body;

          // Validate messages
          const messages = normalizeMessages(body);
          if (!messages?.length) {
            return new Response(JSON.stringify({ error: "Invalid chat message." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          // Check the function URL is configured
          if (!APPWRITE_FUNCTION_AI_URL) {
            return new Response(
              JSON.stringify({ error: "AI backend not configured. Set APPWRITE_FUNCTION_AI_BRAIN_URL." }),
              { status: 503, headers: { "content-type": "application/json" } },
            );
          }

          // Resolve identity from the session cookie
          const { userId, userRole } = await resolveCurrentUser(request);

          // Forward to alvey-ai-brain
          const fnResponse = await fetch(APPWRITE_FUNCTION_AI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages,
              currentUrl: currentUrl || "/",
              ...(userId ? { userId, userRole } : {}),
            }),
          });

          if (!fnResponse.ok) {
            const errData = await fnResponse.json().catch(() => ({}));
            return new Response(
              JSON.stringify({ error: (errData as { error?: string }).error || "AI function error." }),
              { status: fnResponse.status, headers: { "content-type": "application/json" } },
            );
          }

          const data = await fnResponse.json();
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        } catch (err: unknown) {
          console.error("Chatbot proxy error:", err);
          const detail = err instanceof Error ? err.message : "Unknown error";
          return new Response(
            JSON.stringify({ error: "Unable to process chat request.", details: detail }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
