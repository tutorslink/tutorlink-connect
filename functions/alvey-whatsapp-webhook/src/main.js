// alvey-whatsapp-webhook — Appwrite Function
//
// Handles the Meta WhatsApp Cloud API webhook lifecycle:
//   GET  — hub verification (green checkmark in Meta App Dashboard)
//   POST — inbound message processing with AI replies and conversation memory
//
// Architecture:
//   WhatsApp User → Meta Servers → this function → alvey-ai-brain → WhatsApp reply
//
// Conversation memory is stored in the Appwrite DB collection "whatsapp_sessions":
//   - phoneNumber  (string, document ID = phone number for easy lookup)
//   - messages     (string, JSON-stringified array of {role, content} objects)
//   - updatedAt    (string, ISO timestamp)
// Sessions expire (are reset) if updatedAt is older than 24 hours.
// Message history is capped at 20 messages (10 user + 10 assistant turns).

import { Client, Databases, ID, Query } from 'node-appwrite';

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------
const ENDPOINT              = process.env.APPWRITE_ENDPOINT        || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID            = process.env.APPWRITE_PROJECT_ID      || 'tutorslink';
const API_KEY               = process.env.APPWRITE_API_KEY          || '';
const DATABASE_ID           = process.env.APPWRITE_DATABASE_ID      || 'Database';

const VERIFY_TOKEN          = process.env.WHATSAPP_VERIFY_TOKEN     || '';
const WA_ACCESS_TOKEN       = process.env.WHATSAPP_ACCESS_TOKEN     || '';
const WA_PHONE_NUMBER_ID    = process.env.WHATSAPP_PHONE_NUMBER_ID  || '';
const AI_BRAIN_URL          = process.env.ALVEY_AI_BRAIN_URL        || '';

const COLLECTION_SESSIONS   = 'whatsapp_sessions';

// Session config
const SESSION_MAX_AGE_MS    = 24 * 60 * 60 * 1000; // 24 hours
const MAX_MESSAGES          = 20;                    // cap at 20 messages total

// ---------------------------------------------------------------------------
// Appwrite DB client
// ---------------------------------------------------------------------------
function buildDB() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);
  return new Databases(client);
}

// ---------------------------------------------------------------------------
// WhatsApp Cloud API helper — send a text message
// ---------------------------------------------------------------------------
async function sendWhatsAppMessage(to, text) {
  if (!WA_ACCESS_TOKEN || !WA_PHONE_NUMBER_ID) {
    throw new Error('WhatsApp credentials not configured (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID)');
  }

  const url = `https://graph.facebook.com/v18.0/${WA_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${WA_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp send failed: ${JSON.stringify(err)}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------

/** Load an existing session or return an empty one. Resets if older than 24 h. */
async function loadSession(db, phoneNumber) {
  try {
    const doc = await db.getDocument(DATABASE_ID, COLLECTION_SESSIONS, phoneNumber);

    const updatedAt = new Date(doc.updatedAt).getTime();
    const expired   = Date.now() - updatedAt > SESSION_MAX_AGE_MS;
    if (expired) {
      return { messages: [], exists: true, docId: phoneNumber };
    }

    const messages = JSON.parse(doc.messages || '[]');
    return { messages, exists: true, docId: phoneNumber };
  } catch {
    // Document not found — fresh session
    return { messages: [], exists: false, docId: phoneNumber };
  }
}

/** Persist a session back to the DB (upsert by documentId = phoneNumber). */
async function saveSession(db, phoneNumber, messages, exists) {
  const payload = {
    phoneNumber,
    messages:  JSON.stringify(messages),
    updatedAt: new Date().toISOString(),
  };

  if (exists) {
    await db.updateDocument(DATABASE_ID, COLLECTION_SESSIONS, phoneNumber, payload);
  } else {
    await db.createDocument(DATABASE_ID, COLLECTION_SESSIONS, phoneNumber, payload);
  }
}

/** Cap the history at MAX_MESSAGES, always trimming the oldest pairs first. */
function capMessages(messages) {
  if (messages.length <= MAX_MESSAGES) return messages;
  // Trim from the front, keeping pairs (user + assistant)
  const excess = messages.length - MAX_MESSAGES;
  return messages.slice(excess);
}

// ---------------------------------------------------------------------------
// Call alvey-ai-brain
// ---------------------------------------------------------------------------
async function callAIBrain(messages, log) {
  if (!AI_BRAIN_URL) {
    throw new Error('ALVEY_AI_BRAIN_URL is not configured');
  }

  log(`Calling alvey-ai-brain with ${messages.length} message(s)...`);
  const res = await fetch(AI_BRAIN_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ messages, channel: 'whatsapp' }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`AI brain error: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return data.text || "I'm here to help! Please ask me anything about Alvey.";
}

// ---------------------------------------------------------------------------
// Check if the WhatsApp bot is enabled via ai_config
// ---------------------------------------------------------------------------
async function isBotEnabled(db) {
  try {
    const doc = await db.getDocument(DATABASE_ID, 'platform_settings', 'ai_config');
    const value = doc?.value ? JSON.parse(doc.value) : doc;
    // Disabled if either the global enabled flag or whatsapp_bot_enabled is false
    if (value?.enabled === false)             return { enabled: false, reason: 'disabled' };
    if (value?.whatsapp_bot_enabled === false) return { enabled: false, reason: 'whatsapp_disabled' };
    return { enabled: true };
  } catch {
    // If we can't read the config, default to enabled
    return { enabled: true };
  }
}

// ---------------------------------------------------------------------------
// Main Appwrite Function handler
// ---------------------------------------------------------------------------
export default async ({ req, res, log, error }) => {

  // =========================================================================
  // GET — Meta webhook verification
  // =========================================================================
  if (req.method === 'GET') {
    const params = req.query || {};
    const mode      = params['hub.mode'];
    const token     = params['hub.verify_token'];
    const challenge = params['hub.challenge'];

    log(`Webhook verification request — mode: ${mode}, token match: ${token === VERIFY_TOKEN}`);

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      log('Webhook verified successfully.');
      // Return challenge as plain text with status 200
      return res.send(challenge, 200, { 'content-type': 'text/plain' });
    }

    error('Webhook verification failed — token mismatch or wrong mode.');
    return res.send('Forbidden', 403, { 'content-type': 'text/plain' });
  }

  // =========================================================================
  // POST — inbound WhatsApp message
  // =========================================================================
  if (req.method === 'POST') {
    // Always respond 200 to Meta immediately so they don't retry
    // We do our async processing before returning, but within the 30s timeout.

    let body = {};
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch {
      error('Failed to parse POST body');
      return res.json({ status: 'ok' }); // still return 200
    }

    log('Received webhook payload: ' + JSON.stringify(body).slice(0, 300));

    // -----------------------------------------------------------------------
    // Extract message from Meta's payload structure
    // -----------------------------------------------------------------------
    let inboundMessage;
    try {
      inboundMessage = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    } catch {
      log('Could not extract message from payload — ignoring.');
      return res.json({ status: 'ok' });
    }

    // Ignore non-message events (status updates, etc.)
    if (!inboundMessage) {
      log('No message in payload — possibly a status update. Ignoring.');
      return res.json({ status: 'ok' });
    }

    const from      = inboundMessage.from;           // sender's phone number (E.164)
    const messageId = inboundMessage.id;
    const msgType   = inboundMessage.type;
    const textBody  = inboundMessage?.text?.body;

    log(`Message from: ${from}, type: ${msgType}, id: ${messageId}`);

    // -----------------------------------------------------------------------
    // Only handle text messages
    // -----------------------------------------------------------------------
    if (msgType !== 'text' || !textBody) {
      log('Non-text message received — sending polite reply.');
      try {
        await sendWhatsAppMessage(from, "I can only handle text messages for now. Please type your question and I'll be happy to help!");
      } catch (sendErr) {
        error('Failed to send non-text reply:', sendErr.message);
      }
      return res.json({ status: 'ok' });
    }

    // -----------------------------------------------------------------------
    // Check if the WhatsApp bot is enabled
    // -----------------------------------------------------------------------
    const db = buildDB();
    const botStatus = await isBotEnabled(db);
    if (!botStatus.enabled) {
      log(`Bot disabled (reason: ${botStatus.reason}) — sending fallback message.`);
      try {
        await sendWhatsAppMessage(
          from,
          'Our assistant is temporarily unavailable. Please contact us at support@alvey.study',
        );
      } catch (sendErr) {
        error('Failed to send disabled reply:', sendErr.message);
      }
      return res.json({ status: 'ok' });
    }

    // -----------------------------------------------------------------------
    // Load conversation session
    // -----------------------------------------------------------------------
    log(`Loading session for ${from}...`);
    const session = await loadSession(db, from);
    log(`Session loaded — ${session.messages.length} existing message(s).`);

    // -----------------------------------------------------------------------
    // Append new user message to history
    // -----------------------------------------------------------------------
    const updatedMessages = [
      ...session.messages,
      { role: 'user', content: textBody },
    ];

    // -----------------------------------------------------------------------
    // Call alvey-ai-brain with full history
    // -----------------------------------------------------------------------
    let aiReply;
    try {
      aiReply = await callAIBrain(updatedMessages, log);
    } catch (aiErr) {
      error('AI brain call failed:', aiErr.message);
      try {
        await sendWhatsAppMessage(from, "Sorry, I'm having trouble responding right now. Please try again in a moment or contact us at support@alvey.study");
      } catch { /* ignore send errors in error path */ }
      return res.json({ status: 'ok' });
    }

    log(`AI reply (${aiReply.length} chars): ${aiReply.slice(0, 120)}...`);

    // -----------------------------------------------------------------------
    // Append AI reply, cap history, save session
    // -----------------------------------------------------------------------
    const finalMessages = capMessages([
      ...updatedMessages,
      { role: 'assistant', content: aiReply },
    ]);

    try {
      await saveSession(db, from, finalMessages, session.exists);
      log('Session saved.');
    } catch (saveErr) {
      error('Failed to save session:', saveErr.message);
      // Non-fatal — continue and still send the reply
    }

    // -----------------------------------------------------------------------
    // Send reply via WhatsApp Cloud API
    // -----------------------------------------------------------------------
    try {
      await sendWhatsAppMessage(from, aiReply);
      log('WhatsApp reply sent successfully.');
    } catch (sendErr) {
      error('Failed to send WhatsApp reply:', sendErr.message);
    }

    return res.json({ status: 'ok' });
  }

  // =========================================================================
  // Fallback — method not handled
  // =========================================================================
  return res.json({ error: 'Method not allowed' }, 405);
};
