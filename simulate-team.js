require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// ========================================
// 🎭 TEAM PERSONAS
// ========================================

const PERSONAS = [
  {
    name: "Sarah (PM)",
    role: "Product Manager",
    style: "Focuses on user needs, features, and business goals",
    webhook: null, // Will use main bot
  },
  {
    name: "Alex (Engineer)",
    role: "Senior Engineer",
    style: "Focuses on technical feasibility, architecture, scalability",
    webhook: null,
  },
  {
    name: "Mike (Designer)",
    role: "UX Designer",
    style: "Focuses on user experience, UI, accessibility",
    webhook: null,
  },
  {
    name: "Emma (Marketing)",
    role: "Marketing Lead",
    style: "Focuses on positioning, target market, growth",
    webhook: null,
  },
  {
    name: "David (CEO)",
    role: "Founder/CEO",
    style: "Focuses on vision, constraints, timeline, budget",
    webhook: null,
  },
  {
    name: "Lisa (Customer Success)",
    role: "Customer Success Manager",
    style: "Focuses on customer pain points, support, feedback",
    webhook: null,
  }
];

// ========================================
// 📝 DEMO CONVERSATION SCRIPT
// ========================================

const CONVERSATION = [
  {
    persona: "David (CEO)",
    message: "Team, I want to propose a new product idea: a fitness tracker app specifically for busy professionals who struggle to stay consistent with workouts.",
    delay: 2000
  },
  {
    persona: "Lisa (Customer Success)",
    message: "Love this! I've been hearing from our enterprise clients that their employees struggle with work-life balance. Fitness tracking could be huge.",
    delay: 3000
  },
  {
    persona: "Emma (Marketing)",
    message: "Our target users would be software engineers, founders, and consultants aged 25-40. Market size is massive - wellness tech is booming.",
    delay: 3000
  },
  {
    persona: "Sarah (PM)",
    message: "Core features should include: workout logging with templates, progress tracking with charts, and AI-powered workout recommendations based on their schedule and fitness level.",
    delay: 4000
  },
  {
    persona: "Mike (Designer)",
    message: "From a UX perspective, we need quick-entry workflows. These users have 5 minutes max. Think Apple Health integration for automatic tracking.",
    delay: 3000
  },
  {
    persona: "Alex (Engineer)",
    message: "For tech stack, I recommend Next.js 14 for the frontend with App Router. For backend, let's use Supabase - it has real-time subscriptions which we'll need for live progress updates.",
    delay: 4000
  },
  {
    persona: "Sarah (PM)",
    message: "We also need push notifications for workout reminders and social features - let users compete with friends or coworkers.",
    delay: 3000
  },
  {
    persona: "David (CEO)",
    message: "Timeline constraint: we need to launch MVP in 2 weeks for an investor demo. Budget: keep hosting under $500/month.",
    delay: 3000
  },
  {
    persona: "Alex (Engineer)",
    message: "Wait, actually for scaling and cost optimization, Firebase might be better than Supabase. Better free tier and easier mobile integration.",
    delay: 4000
  },
  {
    persona: "Mike (Designer)",
    message: "One more thing - we need Apple Health and Google Fit integration for automatic workout tracking. Users hate manual entry.",
    delay: 3000
  },
  {
    persona: "Lisa (Customer Success)",
    message: "Can we add a feature for personal trainers to monitor their clients? That could be a premium tier.",
    delay: 3000
  },
  {
    persona: "Sarah (PM)",
    message: "Good idea Lisa, but let's keep MVP scope tight. We can add trainer features in v2. For now: logging, tracking, AI recommendations, and social.",
    delay: 3000
  },
  {
    persona: "David (CEO)",
    message: "Agreed. Let's move forward with this spec. Alex, can you start on the architecture?",
    delay: 2000
  }
];

// ========================================
// 🚀 SIMULATION RUNNER
// ========================================

async function runSimulation(channelId) {
  console.log("🎬 Starting team conversation simulation...\n");

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  await client.login(process.env.SIMULATOR_BOT_TOKEN || process.env.DISCORD_TOKEN);

  await new Promise(resolve => {
    client.once('ready', () => {
      console.log(`✅ Simulation bot connected as ${client.user.tag}\n`);
      resolve();
    });
  });

  const channel = await client.channels.fetch(channelId);

  if (!channel || !channel.isTextBased()) {
    console.error("❌ Invalid channel ID or not a text channel");
    process.exit(1);
  }

  console.log(`📝 Simulating conversation in #${channel.name}\n`);
  console.log("=" .repeat(60));

  for (const msg of CONVERSATION) {
    await new Promise(resolve => setTimeout(resolve, msg.delay));

    console.log(`\n${msg.persona}: ${msg.message}`);
    await channel.send(`**${msg.persona}**: ${msg.message}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Simulation complete!");
  console.log("\nNow type in Discord:");
  console.log("  !summary   - See extracted product spec");
  console.log("  !context   - See Hyperspell context");
  console.log("  !freeze    - Lock the spec");
  console.log("  !generate  - Generate MVP code");

  await new Promise(resolve => setTimeout(resolve, 2000));
  client.destroy();
  process.exit(0);
}

// ========================================
// 🎯 CLI INTERFACE
// ========================================

const channelId = process.argv[2];

if (!channelId) {
  console.log("🎬 Forge Team Conversation Simulator\n");
  console.log("Usage: node simulate-team.js <CHANNEL_ID>\n");
  console.log("How to get Channel ID:");
  console.log("1. Enable Developer Mode in Discord (User Settings → Advanced)");
  console.log("2. Right-click your channel → Copy Channel ID");
  console.log("3. Run: node simulate-team.js YOUR_CHANNEL_ID\n");
  console.log("This will simulate a realistic product discussion with 6 team members.");
  console.log("Watch as Forge extracts the product spec in real-time!\n");
  process.exit(0);
}

runSimulation(channelId).catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
