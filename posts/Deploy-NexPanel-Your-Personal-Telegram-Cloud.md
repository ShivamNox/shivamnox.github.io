---
title: NexPanel — Free Personal Cloud Storage with Telegram
author: shivamnox
date: 2026-01-15
image: https://i.ibb.co/DDBXLMQQ/Screenshot-2025-11-05-121055.png
labels: NodeJS, Telegram, Cloud Storage, Self-Hosted
---

# NexPanel — Your Own Free Cloud Storage 🚀

Turn Telegram into your **personal Google Drive** — with a beautiful dashboard, unlimited storage, video streaming, and public sharing.

**No coding. No config files. Just click, fill 5 fields, done.**

---

## ✨ What You Get

- 🌐 Beautiful web dashboard
- ☁️ Unlimited free storage (via Telegram)
- 📤 Upload files up to **2 GB**
- 🎥 Stream videos in browser
- 🔗 Share files with public links
- 🤖 Upload via Telegram bot too

---

## 🚀 Install in 3 Commands

Open your terminal and run:

```bash
git clone https://github.com/shivamnox/nex-pannel.git
cd nex-pannel
npm install
npm start
```

Now open **http://localhost:3000** in your browser.

You'll see a setup wizard. Follow the steps below 👇

---

## 📝 Setup — 3 Simple Screens

### Screen 1️⃣ — Connect Database (MongoDB)

Paste your MongoDB link → click **Connect Database**.

**Don't have one? Get free MongoDB in 2 minutes:**

1. Go to → [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (free forever)
3. Click **Build a Database** → pick **M0 FREE** → **Create**
4. Set a **username + password** (write them down!)
5. Click **Network Access** → **Add IP** → **Allow from anywhere**
6. Click **Database** → **Connect** → **Drivers**
7. Copy the link — looks like:
   ```
   mongodb+srv://youruser:yourpass@cluster0.abc.mongodb.net/nexpanel
   ```
8. Replace `<password>` with your real password
9. Paste in NexPanel ✅

---

### Screen 2️⃣ — Create Your Login

- Enter your **email**
- Choose a **password** (8+ characters)
- Confirm password
- Click **Continue**

This is how you'll log in to your dashboard.

---

### Screen 3️⃣ — Your Profile

- Upload a profile picture (optional)
- Enter your name
- Click **Finish Setup**

Done! You're now on the dashboard 🎉

---

## ☁️ Connect Cloud Storage

Click the **Cloud Storage** card on dashboard. A popup asks for **5 things**. Let's get each one:

---

### 1️⃣ API ID + API Hash

These identify you to Telegram.

**How to get:**
1. Go to → [my.telegram.org](https://my.telegram.org)
2. Log in with your phone number
3. Click **API Development Tools**
4. Fill:
   - App title: `NexPanel`
   - Short name: `nexpanel`
   - Platform: `Other`
5. Click **Create Application**
6. Copy **API ID** (numbers) and **API Hash** (long text)

---

### 2️⃣ Bot Token

You need a Telegram bot to store files.

**How to get:**
1. Open Telegram → search **[@BotFather](https://t.me/BotFather)**
2. Send `/newbot`
3. Give it a **name** (any name)
4. Give it a **username** — must end with `bot` (e.g., `mycloud123_bot`)
5. Copy the **token** BotFather sends you
   ```
   6789012345:AAHxYzAbCdEfGhIjKlMnOpQrStUv
   ```

---

### 3️⃣ DB Channel ID (Important!)

This is a private Telegram channel where your files will be stored secretly.

**Step A — Create a channel:**
1. Open Telegram → **New Message** → **New Channel**
2. Name it anything (e.g., "My Cloud")
3. Choose **Private Channel** → **Create**

**Step B — Add your bot as ADMIN (Don't skip this!):**

> ⚠️ **If you skip this, uploads will fail!**

1. Open the channel → tap channel name at top
2. Tap **Administrators** → **Add Admin**
3. Search your bot username (e.g., `@mycloud123_bot`)
4. Enable **ALL permissions** (post, edit, delete, etc.)
5. Tap **Done**

**Step C — Get the Channel ID:**
1. Send any message in the channel (e.g., "hi")
2. Forward that message to **[@userinfobot](https://t.me/userinfobot)**
3. Copy the number it shows — starts with `-100`
   ```
   -1001234567890
   ```

---

### 4️⃣ Owner Telegram ID

This is your personal Telegram user ID (so only you can control the bot).

**How to get:**
1. Open Telegram → search **[@userinfobot](https://t.me/userinfobot)**
2. Send `/start`
3. Copy the **Id** it shows (numbers only)

---

### 5️⃣ Save & Connect

Fill all 5 fields → click **Save & Connect**

Wait **15-40 seconds** (Telegram handshake). You'll see progress steps ✅ ✅ → auto-redirect to your cloud 🎉

---

## 🎯 How to Use

### Upload Files
- Open any folder → **Upload** button → pick file → done!

### Share Files
- Click 3-dot menu on any file → **Share**
- Copy the public link → send to anyone
- No login needed to view/download

### Stream Videos
- Click any video → plays instantly in browser

### Upload via Telegram Bot
Two ways:
1. **DM your bot** any file → it's saved automatically
2. **Post file in your DB Channel** → auto-saved with folder auto-created

---

## 🤖 Bot Commands

Send these to your bot in Telegram:

| Command | Does |
|---|---|
| `/start` | Start the bot |
| `/settings` | Link channels to folders |
| `/addf` | Set default folder |
| `/activeinfo` | Show active channels |
| `/clearactive` | Remove a channel mapping |

---

## 👤 Change Anything Later

Click your **profile picture** on the sidebar (or go to `/profile`) to change:
- Name, email, avatar
- Password
- Any Telegram credential
- Reconnect cloud if disconnected

---

## ❓ Common Issues

**"Cloud not connected" while uploading?**
→ Go to Profile → click **Reconnect Cloud**

**Bot not saving files from channel?**
→ Check bot is **admin** in that channel with all permissions

**Setup wizard shows again after restart?**
→ Your `.env` file didn't save. Delete it and re-run setup.

---

## 🎁 That's It!

```bash
git clone https://github.com/shivamnox/nex-pannel.git
cd nex-pannel
npm install
npm start
```

Open **http://localhost:3000** → follow the wizard → enjoy your free cloud! 🚀

⭐ Star the repo: **[github.com/shivamnox/nex-pannel](https://github.com/shivamnox/nex-pannel)**
