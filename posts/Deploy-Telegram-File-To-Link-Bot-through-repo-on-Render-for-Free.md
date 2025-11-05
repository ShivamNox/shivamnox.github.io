---
title: Deploy Telegram File To Link Bot through repo on Render (Free)
author: shivamnox
date: 2025-11-05
image: https://i.ibb.co/DDBXLMQQ/Screenshot-2025-11-05-121055.png
labels: Telegram, Bot, Python3, Render, Deployment
---

# Deploy Telegram File To Link or File Stream Bot via GitHub

Want to host your own **Telegram File to Link / File Stream Bot**?  
This guide will walk you through setting it up using the [FileStreamBot-Pro](https://github.com/ShivamNox/FileStreamBot-Pro) repository and deploying it **for free on Render**.

---

## 📦 What is This Bot?

This Telegram bot converts any file sent to it into a direct download or streaming link.  
It’s built using **Python3** and **Python-Telegram-Bot / Pyrogram** and supports MongoDB as a database.

---

## ⚙️ Required Environment Variables

Before deployment, you’ll need these configuration values:

| Variable | Description |
|-----------|-------------|
| `API_ID` | Your Telegram API ID (from my.telegram.org) |
| `API_HASH` | Your Telegram API Hash |
| `BOT_TOKEN` | Your Telegram Bot Token (from @BotFather) |
| `BIN_CHANNEL` | The Telegram Channel ID for storing files (must start with `-100`) |
| `DATABASE_URL` | MongoDB Connection String |
| `OWNER_ID` | Your Telegram numeric user ID |
| `OWNER_USERNAME` | Your Telegram username (without `@`) |
| `UPDATES_CHANNEL` | Channel username where updates will be posted (optional) |

---

## 🧩 How to Get These Values

### 1. Get API ID and API Hash
1. Go to [my.telegram.org](https://my.telegram.org).
2. Log in with your Telegram account.
3. Click **API Development Tools**.
4. Create a new app and copy your:
   - **API ID**
   - **API Hash**

### 2. Get BOT_TOKEN
1. Open Telegram and search for **@BotFather**.
2. Send `/newbot` and follow the steps for Bot Name and Bot Username.
3. After Bot Creation Copy the **bot token** you receive.

### 3. Get BIN_CHANNEL
1. Create a **private Telegram channel**.
2. Add your bot as **admin** in that channel.
3. Now send a any message in that channel.
4. Then forwored that message to [@MissRose_bot](https://t.me/MissRose_bot) or [@getidsbot](https://t.me/getidsbot) and Send `/id` in replay of that forworeded message to get the channel ID.
   The ID will look like: `-100xxxxxxxxxx`

### 4. Get DATABASE_URL
Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register):
1. Sign up for a free account.
2. Create a **Shared Cluster**.
3. Add a database user and whitelist your IP (or use 0.0.0.0/0).
4. Copy the **connection string** (starts with `mongodb+srv://`).

### 5. OWNER_ID and OWNER_USERNAME
- OWNER_ID: Send `/id` to [@MissRose_bot](https://t.me/MissRose_bot).
- OWNER_USERNAME: Your Telegram username without `@`.

---

## 🚀 Deploy on Render (Free Hosting)

Render allows you to deploy Python3 apps easily.

> 💡 **Note:** Render free tier is **only available on mobile browsers**.  
> If you use desktop, it may require payment details.

### Step 1: Fork the Repository
Go to the GitHub repo:  
👉 [FileStreamBot-Pro](https://github.com/ShivamNox/FileStreamBot-Pro)  
Click **Fork** to add it to your account.

### Step 2: Create a New Web Service
1. Visit [Render.com](https://render.com).
2. Log in using **GitHub**.
3. Click **New Web Service**.
4. Connect your forked repo.

### Step 3: Configure Build Settings
When prompted:
- **Build Command:**  
  ```bash
  pip install -r requirements.txt
  ```

- **Start Command:**
  ```bash
  python3 -m ShivamNox.__main__
  ```

### Step 4: Add Environment Variables

Click **Environment** and add all the variables listed earlier:

```bash
API_ID=29876636
API_HASH=52b6dfbaee00000000cefbea7c2e04
BOT_TOKEN=your_bot_token_here
BIN_CHANNEL=-1002044705664
DATABASE_URL=your_mongodb_connection_url
OWNER_ID=Your_Telegram_ID
OWNER_USERNAME=Your_Username
UPDATES_CHANNEL=channel_username
```

### Step 5: Deploy!

Click **Deploy Web Service**.
Render will automatically build and host your bot. Once deployed, your bot will go live and start responding on Telegram.

---

## ✅ Final Tips

* Always keep your API keys **private**.
* You can restart your Render service anytime if it stops.
* Monitor logs in the Render dashboard for debugging.

---

## 🧠 Conclusion

With this setup, you can easily host your own **Telegram File Stream Bot** for free using Render and GitHub.
No need for complex VPS setups — just a few clicks and your bot is ready to serve files globally!

> ⚡ Ready to try? Fork the repo now: [FileStreamBot-Pro](https://github.com/ShivamNox/FileStreamBot-Pro)

