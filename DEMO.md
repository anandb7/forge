# 🎬 Forge Demo Guide

## 🎯 Running the Team Simulation

### **Quick Start:**

1. **Get your Discord Channel ID:**
   - Enable Developer Mode: Discord Settings → Advanced → Developer Mode ON
   - Right-click your Discord channel → "Copy Channel ID"

2. **Run the simulation:**
   ```bash
   node simulate-team.js YOUR_CHANNEL_ID
   ```

3. **Watch the magic happen!**
   - 6 team members (PM, Engineer, Designer, CEO, Marketing, Customer Success) will discuss a product
   - Forge bot will automatically extract structured product information
   - Tech stack conflicts will be detected (Supabase vs Firebase)
   - Dashboard updates in real-time

4. **After simulation, run these commands:**
   ```
   !summary   - See the structured product spec
   !context   - View Hyperspell stored context
   !freeze    - Lock the specification
   !generate  - Generate complete MVP code
   ```

---

## 🎭 The Team Personas

- **David (CEO)** - Vision, constraints, timeline, budget
- **Sarah (PM)** - Features, user needs, scope management
- **Alex (Engineer)** - Technical architecture, feasibility
- **Mike (Designer)** - UX/UI, user experience
- **Emma (Marketing)** - Target market, positioning
- **Lisa (Customer Success)** - Customer pain points, feedback

---

## 📋 What Gets Extracted

From the simulated conversation, Forge will extract:

**Product:** Fitness Tracker App
**Target Users:** Software engineers, founders, consultants (25-40)
**Problem:** Busy professionals struggle to stay consistent with workouts

**Core Features:**
- Workout logging with templates
- Progress tracking with charts
- AI-powered workout recommendations
- Push notifications for reminders
- Social competition features
- Apple Health & Google Fit integration

**Tech Stack:**
- Next.js 14
- Supabase (with conflict: Firebase suggested)

**Constraints:**
- Launch in 2 weeks
- Keep hosting under $500/month

---

## 🎯 Demo Flow (3 minutes)

### **[0:00-0:30] Introduction**
> "Let me show you Forge - it turns messy team conversations into structured product specs."

**Action:** Show Discord + Dashboard side by side

### **[0:30-2:00] Run Simulation**
```bash
node simulate-team.js YOUR_CHANNEL_ID
```

> "Watch as our team discusses a new product idea..."

**Point out:**
- Different personas contributing (CEO sets vision, Engineer suggests tech, PM defines features)
- Forge reacting with ✅ to each message
- Dashboard updating in real-time
- Conflict detection when Firebase is suggested over Supabase (⚠️)

### **[2:00-2:20] Show Results**

Type in Discord: `!summary`

> "Forge has automatically structured everything into a clean product spec."

**Show:**
- Product name and target users extracted
- All features captured
- Tech stack with conflict noted
- Constraints identified

### **[2:20-2:40] Show Context**

Type: `!context`

> "With Hyperspell (our sponsor), all context is permanently stored and searchable."

### **[2:40-2:50] Freeze**

Type: `!freeze`

> "Once the team is aligned, we lock the spec."

### **[2:50-3:30] Generate MVP**

Type: `!generate`

> "And Forge uses GPT-4 to generate a complete MVP application..."

**Wait 20 seconds**

> "Complete Next.js app with all features discussed, ready to deploy."

---

## 🔥 Judge Talking Points

**Problem:**
- Product discussions happen in Discord/Slack
- Specs get outdated immediately
- No single source of truth
- Conflicts discovered too late

**Solution:**
- Forge listens to natural team conversations
- Extracts structured product specs in real-time
- Detects conflicts before they become problems
- Generates MVP code when ready

**Tech Highlights:**
- OpenAI GPT-4 for intelligent extraction
- Hyperspell for persistent context storage
- Real-time dashboard for visibility
- Conflict detection algorithms
- One-command MVP generation

**Impact:**
- Reduces spec-to-MVP time from weeks to minutes
- Catches conflicts early (saves dev time)
- No context switching (works in Discord)
- Perfect for rapid prototyping

---

## 🎪 Alternative: Manual Demo

If simulation script isn't working, use these copy-paste messages:

```
Let's build a fitness tracker app for busy professionals
```

```
Our target users are software engineers and founders who struggle to find time for the gym
```

```
Core features: workout logging, progress tracking with charts, AI-powered workout recommendations
```

```
Also need push notifications for workout reminders and social sharing to compete with friends
```

```
Use Next.js for the frontend and Supabase for the backend with real-time sync
```

```
We need to launch in 2 weeks and keep the MVP under $500/month in hosting costs
```

```
!summary
```

```
Actually, let's use Firebase instead of Supabase for better scaling
```

```
Add Apple Health and Google Fit integration for automatic workout tracking
```

```
!context
```

```
!freeze
```

```
!generate
```

---

## 🚀 Tips for a Great Demo

1. **Keep Dashboard Visible** - Judges love seeing real-time updates
2. **Point Out Hyperspell** - Mention sponsor integration prominently
3. **Highlight Conflict Detection** - This is your "wow" moment
4. **Show the Code** - When MVP generates, scroll through it
5. **Practice Timing** - Run simulation 2-3 times before judging

---

## 🐛 Troubleshooting

**Simulation not sending messages?**
- Check your channel ID is correct
- Make sure bot has permission to send messages in that channel

**Forge bot not responding?**
- Check `npm start` is still running
- Look for errors in console
- Verify bot has MESSAGE CONTENT INTENT enabled

**Dashboard not updating?**
- Refresh browser (http://localhost:3000)
- Check if bot is running

**Hyperspell errors?**
- Check HYPERSPELL_API_KEY in .env
- Bot works without Hyperspell, just mention "syncing in background"

---

Good luck! 🎉
