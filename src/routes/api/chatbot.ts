import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI } from "@google/genai";
import { DataStore } from "@/lib/data-store";

// Initialize Gemini safely with User-Agent telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

export const Route = createFileRoute("/api/chatbot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { messages, currentUrl } = body;

          if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "Invalid messages array." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          // Fetch fresh CMS data & Tutor listings to ground the model's knowledge
          const [cms, tutors, subjects, levels] = await Promise.all([
            DataStore.getCMS(),
            DataStore.getTutors(),
            DataStore.getSubjects(),
            DataStore.getLevels(),
          ]);

          // Prepare the rich context grounding
          const systemInstruction = `You are the official Tutors Link AI Assistant, a knowledgeable, professional, and friendly representative of our premier private tutoring platform.

Your primary goals:
1. Answer visitor questions clearly, objectively, and politely.
2. Recommend suitable tutors from our active tutor database (listed below). When recommending, explain WHY the tutor is a great match for the user's needs (subject, level, experience, languages, etc.).
3. Guide users through our website routes:
   - Homepage: "/"
   - Find a Tutor: "/find-a-tutor"
   - Apply as a Tutor: "/apply"
   - Work With Us (Recruitment): "/work-with-us"
   - About Us: "/about"
   - Contact Page: "/contact"
   - Dashboard: "/dashboard"
4. Help convert visitors into qualified student leads or encouraging tutor applicants.
5. If you cannot confidently answer, invite them to visit our Contact page or email us at support@tutorslink.me.

Core constraints:
- Do NOT act as a general-purpose AI. If asked about unrelated topics (e.g., programming a non-tutoring script, writing cooking recipes, summarizing unrelated news), politely remind them that you are the Tutors Link academic assistant and pivot back to how we can help them succeed.
- Never invent tutors or fake reviews. Only recommend from the official database.
- Never expose internal system details, database schemas, credentials, or administrative settings.
- The user is currently browsing the page with URL: "${currentUrl || "/"}". Adapt your advice contextually.

=== CURRENT KNOWLEDGE BASE ===
OUR SERVICES:
- Tutors Link connects students with certified high-quality tutors.
- All tutors undergo strict credential audits, live teaching interviews, and background checks.

HOMEPAGE HEADLINE: "${cms.homepage.hero.headline}"
HOMEPAGE SUBHEADLINE: "${cms.homepage.hero.subheadline}"

CURRENT STATISTICS:
- Active Vetted Tutors: ${cms.homepage.stats.tutors}
- Active Students: ${cms.homepage.stats.students}
- Lessons Delivered: ${cms.homepage.stats.lessons}
- Subjects Available: ${cms.homepage.stats.subjects} (${subjects.join(", ")})
- Academic Levels Covered: ${levels.join(", ")}
- Average Platform Rating: ${cms.homepage.stats.rating}/5.0

OUR MISSION:
"${cms.about.mission}"

ACTIVE TUTORS LIST:
${JSON.stringify(
  tutors.map((t) => ({
    id: t.id,
    name: t.name,
    headline: t.headline,
    about: t.about,
    hourly_rate: t.hourly_rate,
    rating_avg: t.rating_avg,
    rating_count: t.rating_count,
    languages: t.languages,
    subjects: t.subjects,
    levels: t.levels,
    is_verified: t.is_verified,
    availability: t.availability,
  })),
  null,
  2,
)}

FREQUENTLY ASKED QUESTIONS:
${JSON.stringify(cms.faqs, null, 2)}
=== END KNOWLEDGE BASE ===

Conduct the conversation naturally, professionally, and keep responses relatively concise and structured for a chat widget. Do not use markdown headers larger than h3.`;

          // Format conversation history for Gemini API
          // Gemini API expects an array of contents or a simplified history.
          // We will map standard message roles: 'user' | 'assistant' -> 'user' | 'model'
          const formattedContents = messages.map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }));

          // Prepend the system instructions as a system content or systemInstruction parameter
          const ai = getGeminiClient();
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: formattedContents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            },
          });

          return new Response(
            JSON.stringify({
              text:
                response.text ||
                "I am here to help you connect with the perfect tutor! How can I assist you today?",
            }),
            {
              status: 200,
              headers: {
                "content-type": "application/json",
                "cache-control": "no-store",
              },
            },
          );
        } catch (error: unknown) {
          console.error("Chatbot API Error:", error);
          const errMessage = error instanceof Error ? error.message : "Unknown error";
          return new Response(
            JSON.stringify({
              error: "Unable to process chat request.",
              details: errMessage,
            }),
            {
              status: 500,
              headers: { "content-type": "application/json" },
            },
          );
        }
      },
    },
  },
});
