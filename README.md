# 🔥 Forge – AI Product Orchestrator

A Discord bot that turns live team conversations into structured product specs and generates MVP apps.

## 🚀 Quick Start

### 1. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Name it "Forge"
3. Go to "Bot" tab → Click "Add Bot"
4. **IMPORTANT:** Enable these under "Privileged Gateway Intents":
   - ✅ MESSAGE CONTENT INTENT (required to read messages)
   - ✅ SERVER MEMBERS INTENT
5. Copy the bot token → Save for .env file
6. Go to "OAuth2" → "URL Generator":
   - Select scopes: `bot`
   - Select bot permissions:
     - Send Messages
     - Read Messages/View Channels
     - Read Message History
   - Copy the generated URL
7. Open URL in browser → Add bot to your Discord server

### 2. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new API key
3. Copy and save

### 3. Get Hyperspell API Key (Sponsor Integration)

1. Sign up at [Hyperspell](https://www.hyperspell.com/)
2. Create a new project/collection
3. Copy your API key
4. Hyperspell provides the context & memory layer for your AI agents

**Why Hyperspell?**
- 🔮 Long-term context storage for all product conversations
- 📚 Persistent memory across bot restarts
- 🚀 Fast context retrieval for MVP generation
- 💪 Scales to thousands of messages

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual tokens
```

### 4. Run the Bot

```bash
node index.js
```

## 💬 How to Use

### Normal Conversation
Just chat about your product idea. The bot will automatically extract:
- Product name
- Target users
- Core features
- Tech stack
- Constraints

### Commands

**`!summary`** - View current structured product spec

**`!context`** - View Hyperspell context (see what's stored in memory)

**`!freeze`** - Lock the spec (no more updates from chat)

**`!generate`** - Generate MVP app code (only works after freeze)

## 🎯 Demo Flow

1. Chat: "Let's build a task manager for students"
2. Chat: "They need to track assignments and deadlines"
3. Chat: "Use React and Firebase"
4. Type: `!summary` → See structured spec
5. Chat: "Actually use Supabase" → Bot detects conflict
6. Type: `!freeze` → Lock spec
7. Type: `!generate` → Get MVP code

## 📁 Project Structure

```
forge/
├── index.js           # Main bot code
├── package.json
├── .env               # Your secrets (create from .env.example)
└── README.md
```

## 🔧 Tech Stack

- Node.js
- discord.js
- OpenAI GPT-4
- In-memory state (no database)

## ⚡ Hackathon Version

This is a rapid 3-hour hackathon build. No database, no dashboard, pure in-memory magic.
