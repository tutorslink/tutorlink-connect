# Alvey AI — Setup & Deployment Guide

This covers everything you need to deploy the two Appwrite Functions and wire them to
your website and WhatsApp.

---

## How it all fits together

```
Website chatbot (AIChatbot.tsx)
  └─► POST /api/chatbot          ← TanStack server route (thin proxy)
        └─► alvey-ai-brain       ← Appwrite Function you deploy
              ├─► Appwrite DB    ← reads tutors, CMS, lessons, etc.
              └─► OpenAI API     ← generates the reply

WhatsApp message
  └─► Meta servers
        └─► alvey-whatsapp-webhook  ← Appwrite Function you deploy
              ├─► Appwrite DB        ← reads/writes whatsapp_sessions
              └─► alvey-ai-brain     ← calls the brain above
```

One `ai_config` document in Appwrite controls both the website chatbot and the WhatsApp bot.

---

## Step 1 — Deploy `alvey-ai-brain`

### 1a. Create the function in Appwrite Console

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) and open your **tutorslink** project.
2. Click **Functions** in the left sidebar → **Create Function**.
3. Choose **"Create from scratch"**.
4. Fill in:
   - **Name:** `alvey-ai-brain`
   - **Runtime:** `Node.js 18`
5. Click **Create**.

### 1b. Upload the code

The function code lives in `functions/alvey-ai-brain/` in your repo.

1. On the function page click the **Deployments** tab → **Create deployment**.
2. Choose **"Manual"** upload method.
3. Zip up the `functions/alvey-ai-brain/` folder contents (**not** the folder itself — zip the `src/` folder and `package.json` together).
4. Set **Entrypoint** to `src/main.js`.
5. Set **Build command** to `npm install`.
6. Click **Create**.

Wait for the build to finish (it installs `node-appwrite`). You'll see a green "Active" badge.

### 1c. Set environment variables

In the function's **Settings** tab → **Environment variables**, add these one by one:

| Key | Value |
|-----|-------|
| `APPWRITE_ENDPOINT` | `https://fra.cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | `tutorslink` |
| `APPWRITE_API_KEY` | your API key from `.env` |
| `APPWRITE_DATABASE_ID` | `Database` |
| `OPENAI_API_KEY` | your OpenAI key from `.env` |

Click **Update** after adding all of them, then **Redeploy** so the vars take effect.

### 1d. Enable HTTP trigger and get the URL

1. Go to **Settings** tab → **Execute access** → set to **Any** (so the proxy can call it).
2. Still in Settings, scroll to **Domains** — copy the function URL. It looks like:
   `https://<region>.cloud.appwrite.io/v1/functions/<FUNCTION_ID>/executions`
   
   Actually the simpler direct HTTP URL is shown under **Domains** as something like:
   `https://<random>.appwrite.global`
   
   Copy whichever one is shown — you'll need it in Step 3.

### 1e. Test it

Open a terminal and run:

```powershell
# Should return: {"ok":true,"text":"pong"}
Invoke-WebRequest -Uri "https://<your-brain-url>" -Method GET | Select-Object -Expand Content

# Should return an AI reply
$body = '{"messages":[{"role":"user","content":"Hello, what is Alvey?"}]}'
Invoke-WebRequest -Uri "https://<your-brain-url>" -Method POST -ContentType "application/json" -Body $body | Select-Object -Expand Content
```

---

## Step 2 — Deploy `alvey-whatsapp-webhook`

### 2a. Create the function

Same steps as Step 1a, but:
- **Name:** `alvey-whatsapp-webhook`
- **Runtime:** `Node.js 18`

### 2b. Upload the code

Zip up the contents of `functions/alvey-whatsapp-webhook/` and upload with:
- **Entrypoint:** `src/main.js`
- **Build command:** `npm install`

### 2c. Set environment variables

| Key | Value |
|-----|-------|
| `APPWRITE_ENDPOINT` | `https://fra.cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | `tutorslink` |
| `APPWRITE_API_KEY` | your API key from `.env` |
| `APPWRITE_DATABASE_ID` | `Database` |
| `WHATSAPP_VERIFY_TOKEN` | make up any secret string, e.g. `alvey-wa-secret-2024` — you'll paste this into Meta too |
| `WHATSAPP_ACCESS_TOKEN` | your WhatsApp Cloud API access token (from Meta App Dashboard) |
| `WHATSAPP_PHONE_NUMBER_ID` | your WhatsApp phone number ID (from Meta App Dashboard) |
| `ALVEY_AI_BRAIN_URL` | the URL you copied in Step 1d |

Set **Execute access** to **Any**.

### 2d. Test webhook verification

```powershell
$url = "https://<your-webhook-url>?hub.mode=subscribe&hub.verify_token=alvey-wa-secret-2024&hub.challenge=testchallenge123"
Invoke-WebRequest -Uri $url -Method GET | Select-Object -Expand Content
# Expected output: testchallenge123
```

---

## Step 3 — Wire the web server

Add this one new line to your `.env` file:

```env
APPWRITE_FUNCTION_AI_BRAIN_URL=https://<your-brain-url-from-step-1d>
```

That's it. The `/api/chatbot` proxy already reads this variable — no code changes needed.

Restart your dev server (`npm run dev`) and test the website chatbot. It should work exactly
as before, but now the AI logic is running inside Appwrite.

---

## Step 4 — Create the `whatsapp_sessions` collection

The WhatsApp bot needs one new collection to store conversation history.

1. In Appwrite Console → **Databases** → open the **Database** database.
2. Click **Create Collection**.
   - **Collection ID:** `whatsapp_sessions`
   - **Name:** `WhatsApp Sessions`
3. Add these three attributes:

| Attribute key | Type   | Size  | Required |
|---------------|--------|-------|----------|
| `phoneNumber` | String | 20    | Yes      |
| `messages`    | String | 65535 | Yes      |
| `updatedAt`   | String | 30    | Yes      |

4. Under **Settings** → **Permissions** — remove all user-level permissions. This collection
   is only accessed by the API key, not by end users.

---

## Step 5 — Connect WhatsApp (Meta App Dashboard)

> Skip this step if you only want the website chatbot for now.

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) and open (or create) your Meta app.
2. In the left sidebar click **WhatsApp → Configuration**.
3. Under **Webhook** click **Edit**.
   - **Callback URL:** paste the `alvey-whatsapp-webhook` function URL from Step 2.
   - **Verify token:** paste the same value you set for `WHATSAPP_VERIFY_TOKEN`.
4. Click **Verify and save** — Meta will call your function's GET endpoint. If the test from
   Step 2d worked, this will show a green checkmark.
5. Subscribe to the **messages** webhook field.

---

## Admin toggle — controlling both bots at once

The `ai_config` document in the `platform_settings` collection controls everything.
Your existing admin page at `/admin/ai-assistant` already manages it.

The `value` field is a JSON object:

```json
{
  "enabled": true,
  "whatsapp_bot_enabled": true,
  "welcome_message": "Hi! I am the Alvey Assistant.",
  "lead_capture": true,
  "disabled_message": "The AI Assistant is currently disabled. Please contact us at support@alvey.study"
}
```

| `enabled` | `whatsapp_bot_enabled` | Website chatbot | WhatsApp bot |
|-----------|------------------------|-----------------|--------------|
| `true`    | `true`                 | Active          | Active       |
| `false`   | anything               | Disabled        | Disabled     |
| `true`    | `false`                | Active          | Disabled     |

Setting `enabled: false` kills both surfaces with the `disabled_message`.

---

## All environment variables at a glance

### `.env` (web server)

```env
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=tutorslink
APPWRITE_API_KEY=<your api key>
APPWRITE_DATABASE_ID=Database
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=tutorslink
VITE_APPWRITE_DATABASE_ID=Database
APPWRITE_FUNCTION_AI_BRAIN_URL=<brain function url>
OPENAI_API_KEY=<your openai key>
```

### `alvey-ai-brain` function env vars

```
APPWRITE_ENDPOINT        = https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID      = tutorslink
APPWRITE_API_KEY         = <your api key>
APPWRITE_DATABASE_ID     = Database
OPENAI_API_KEY           = <your openai key>
```

### `alvey-whatsapp-webhook` function env vars

```
APPWRITE_ENDPOINT        = https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID      = tutorslink
APPWRITE_API_KEY         = <your api key>
APPWRITE_DATABASE_ID     = Database
WHATSAPP_VERIFY_TOKEN    = <your chosen secret string>
WHATSAPP_ACCESS_TOKEN    = <from Meta App Dashboard>
WHATSAPP_PHONE_NUMBER_ID = <from Meta App Dashboard>
ALVEY_AI_BRAIN_URL       = <brain function url>
```

---

## Security notes

- `OPENAI_API_KEY` lives **only** on the Appwrite Function — the web server never touches it.
- Your `APPWRITE_API_KEY` is a server secret — it's already in `.gitignore` via `.env` and should never be committed to git.
- The AI brain never returns raw DB documents — only the AI text reply reaches the browser.
- The system prompt explicitly tells the AI not to reveal internal details, credentials, or schemas.
