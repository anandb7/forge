require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// ========================================
// 🎭 TEAM PERSONAS - FOOD FOR GOOD
// ========================================

const PERSONAS = {
  sarah: "Sarah (PM)",
  elena: "Elena (CX - NGOs)",
  marcus: "Marcus (CX - Restaurants)",
  priya: "Priya (Eng - Routing)",
  david: "David (Eng - Infra)",
  leo: "Leo (UI/UX)"
};

// ========================================
// 📝 FOOD FOR GOOD CONVERSATION
// ========================================

const CONVERSATION = [
  // Temperature Control Crisis
  {
    persona: PERSONAS.sarah,
    message: "Alright team, day 3 of planning. Today we need to nail down transit logistics, driver opt-ins, and the final data model. Let's start with the physical food.",
    delay: 2000
  },
  {
    persona: PERSONAS.elena,
    message: "I spoke to three shelter directors yesterday. Their biggest red flag: temperature control. If a restaurant donates hot soup and cold salads, and it sits in a driver's car for 45 minutes, it crosses the 'danger zone' for bacteria. They legally have to throw it away.",
    delay: 4000
  },
  {
    persona: PERSONAS.marcus,
    message: "Restaurants will lose their minds if they find out the food they donated (and claimed a tax write-off for) went to the dump because of our transit times.",
    delay: 3000
  },
  {
    persona: PERSONAS.priya,
    message: "Standard Uber Eats deliveries target a <30 minute drop-off. But if we are subsidizing these rides, my algorithm is going to prioritize batching (picking up multiple donations) to save money. Batching = longer transit times.",
    delay: 4000
  },
  {
    persona: PERSONAS.david,
    message: "Can we force restaurants to separate hot and cold into different bags and tag them in the UI?",
    delay: 3000
  },
  {
    persona: PERSONAS.leo,
    message: "Yes! I can add a 'Temp Required' toggle on the tablet. Hot ♨ or Cold ❄.",
    delay: 3000
  },
  {
    persona: PERSONAS.priya,
    message: "If they are separated, I can write a constraint: Hot and Cold items cannot be batched in the same car unless the total route is under 20 minutes.",
    delay: 3000
  },
  {
    persona: PERSONAS.sarah,
    message: "Love this. David, what's the DB impact?",
    delay: 2000
  },
  {
    persona: PERSONAS.david,
    message: "Minimal. Just a boolean flag on the payload. But we need to ensure drivers actually have insulated bags.",
    delay: 3000
  },
  {
    persona: PERSONAS.marcus,
    message: "Not all drivers use them.",
    delay: 2000
  },
  {
    persona: PERSONAS.elena,
    message: "NGOs will report us to the health department if lukewarm chicken shows up uninsulated.",
    delay: 3000
  },
  {
    persona: PERSONAS.sarah,
    message: "Decision: For Food for Good dispatches, the algorithm will ONLY ping drivers who have a verified insulated bag registered on their profile. Priya, can you filter for that?",
    delay: 3000
  },
  {
    persona: PERSONAS.priya,
    message: "Easy. Done. We'll enforce a strict 25-minute maximum transit time from pickup to drop-off.",
    delay: 3000
  },

  // Driver Experience & Opt-In
  {
    persona: PERSONAS.leo,
    message: "Okay, moving to drivers. Do we force them to take these trips?",
    delay: 3000
  },
  {
    persona: PERSONAS.sarah,
    message: "No, they are independent contractors. We can't force them. It has to be an opt-in.",
    delay: 2000
  },
  {
    persona: PERSONAS.marcus,
    message: "If we are paying them exactly the same as a normal burger delivery, why would they care if it's a charity run?",
    delay: 3000
  },
  {
    persona: PERSONAS.leo,
    message: "Because we make it feel special! I'm thinking a green glow around the ping card. 'Community Run!'",
    delay: 3000
  },
  {
    persona: PERSONAS.priya,
    message: "Wait, if they reject the ping, it goes to the next driver. If 5 drivers reject it, the food sits for 40 minutes at the restaurant.",
    delay: 3000
  },
  {
    persona: PERSONAS.david,
    message: "And we already established a 25-minute transit limit. If the food sits at the restaurant, it gets cold before it even gets in the car.",
    delay: 3000
  },
  {
    persona: PERSONAS.sarah,
    message: "We need an incentive kicker. We can't pay them double, CSR won't approve the budget.",
    delay: 3000
  },
  {
    persona: PERSONAS.marcus,
    message: "What about Uber Pro points? Drivers care about their tier status (Gold, Platinum, Diamond).",
    delay: 3000
  },
  {
    persona: PERSONAS.leo,
    message: "Yes! 'Complete this Community Run for 3x Uber Pro Points!' It costs us zero actual dollars, but gives them a huge boost toward their tier rewards.",
    delay: 3000
  },
  {
    persona: PERSONAS.elena,
    message: "That's brilliant. It guarantees speed without breaking the CSR budget.",
    delay: 2000
  },
  {
    persona: PERSONAS.priya,
    message: "I can build a priority queue. If a driver opts-in to 'Community Runs' in their settings, they get first dibs on these high-point trips.",
    delay: 3000
  },
  {
    persona: PERSONAS.david,
    message: "We'll batch-update Uber Pro points at midnight to save server costs.",
    delay: 3000
  },
  {
    persona: PERSONAS.leo,
    message: "I'll design a 'Points Pending' animation to keep drivers happy in the meantime.",
    delay: 3000
  },

  // NGO Capacity Overload
  {
    persona: PERSONAS.elena,
    message: "Let's revisit the NGO 'Set and Forget' preference center. What happens on Thanksgiving?",
    delay: 3000
  },
  {
    persona: PERSONAS.sarah,
    message: "What do you mean?",
    delay: 2000
  },
  {
    persona: PERSONAS.elena,
    message: "On holidays, restaurants over-prep and have massive surplus. An NGO might have their capacity set to '50 meals,' but suddenly there are 500 meals floating around the city.",
    delay: 4000
  },
  {
    persona: PERSONAS.david,
    message: "Our system will just stop routing once the NGO hits 50. The other 450 meals will be orphaned and rejected.",
    delay: 3000
  },
  {
    persona: PERSONAS.marcus,
    message: "And the restaurants will be furious that we aren't taking their food on the biggest PR day of the year.",
    delay: 3000
  },
  {
    persona: PERSONAS.priya,
    message: "I can build an 'Emergency Surge' push notification.",
    delay: 2000
  },
  {
    persona: PERSONAS.leo,
    message: "Oh! A push to the NGO manager's phone: 'Uber Eats has high surplus in your area. Can you accept 20 more meals right now?' [Yes] [No].",
    delay: 4000
  },
  {
    persona: PERSONAS.elena,
    message: "That's perfect. It gives them control but allows us to bypass the static limit during a surge.",
    delay: 3000
  },
  {
    persona: PERSONAS.david,
    message: "But what if they hit [Yes] and 10 different drivers are simultaneously routed there? It'll be a traffic jam at a tiny soup kitchen.",
    delay: 3000
  },
  {
    persona: PERSONAS.priya,
    message: "Good catch, David. I will implement a 'staggered arrival' logic. If an NGO accepts a surge, my algorithm will space out the driver ETAs by 5 minutes each.",
    delay: 4000
  },
  {
    persona: PERSONAS.david,
    message: "We should use a localized geofence to queue drivers a block away if the drop-off zone is full. Avoids hitting Google Maps API limits.",
    delay: 4000
  },

  // Legal Tracking
  {
    persona: PERSONAS.marcus,
    message: "One last thing from Legal. They reviewed the Trust Score idea. They love it, but they need an audit trail for the tax receipts.",
    delay: 3000
  },
  {
    persona: PERSONAS.david,
    message: "Audit trail? Like, a blockchain? Please don't say blockchain.",
    delay: 2000
  },
  {
    persona: PERSONAS.marcus,
    message: "Ha, no. Just a digital signature. When the driver drops the food, the NGO has to physically sign the driver's phone, just like an alcohol delivery.",
    delay: 3000
  },
  {
    persona: PERSONAS.elena,
    message: "No, absolutely not. We already agreed NGOs are too busy. If a driver is waiting 10 minutes for a shelter worker to wash their hands and sign a phone, the driver will hate the program.",
    delay: 4000
  },
  {
    persona: PERSONAS.leo,
    message: "What about photo proof of delivery? Like we do for contactless drop-offs?",
    delay: 3000
  },
  {
    persona: PERSONAS.sarah,
    message: "That solves it. The driver takes a photo of the boxes inside the NGO doors.",
    delay: 3000
  },
  {
    persona: PERSONAS.david,
    message: "I'll route those photos to a secure AWS bucket and attach the metadata (timestamp, GPS coordinates) to the restaurant's monthly tax receipt. It proves the food arrived. Legal will be happy.",
    delay: 4000
  },
  {
    persona: PERSONAS.priya,
    message: "And my routing is secure. We need PostgreSQL for the transaction log and Redis for the driver queue.",
    delay: 3000
  },
  {
    persona: PERSONAS.leo,
    message: "UI is locked in. React Native for the driver app, React for the restaurant and NGO dashboards.",
    delay: 3000
  },
  {
    persona: PERSONAS.sarah,
    message: "We have our MVP. Let's document this. Timeline: launch pilot in 3 cities within 8 weeks. Budget: keep infrastructure costs under $50K for the pilot phase.",
    delay: 4000
  },
  {
    persona: PERSONAS.elena,
    message: "This is going to change lives. Let's ship it!",
    delay: 2000
  }
];

// ========================================
// 🚀 SIMULATION RUNNER
// ========================================

async function runSimulation(channelId) {
  console.log("🎬 Starting Food for Good conversation simulation...\n");
  console.log("Product: Uber Eats Food Donation Platform");
  console.log("Team: 6 members (PM, CX-NGOs, CX-Restaurants, Eng-Routing, Eng-Infra, UI/UX)\n");

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

  for (const [index, msg] of CONVERSATION.entries()) {
    await new Promise(resolve => setTimeout(resolve, msg.delay));

    console.log(`\n[${index + 1}/${CONVERSATION.length}] ${msg.persona}: ${msg.message.substring(0, 80)}${msg.message.length > 80 ? '...' : ''}`);
    await channel.send(`**${msg.persona}**: ${msg.message}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Simulation complete!");
  console.log(`\n📊 ${CONVERSATION.length} messages sent`);
  console.log("\nNow type in Discord:");
  console.log("  !summary   - See extracted product spec (Food for Good)");
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
  console.log("🎬 Food for Good - Team Conversation Simulator\n");
  console.log("Product: Uber Eats platform for donating surplus restaurant food to NGOs\n");
  console.log("Usage: node simulate-foodforgood.js <CHANNEL_ID>\n");
  console.log("How to get Channel ID:");
  console.log("1. Enable Developer Mode in Discord (User Settings → Advanced)");
  console.log("2. Right-click your channel → Copy Channel ID");
  console.log("3. Run: node simulate-foodforgood.js YOUR_CHANNEL_ID\n");
  console.log("This simulates a realistic product planning session with:");
  console.log("  - Temperature control challenges");
  console.log("  - Driver incentive mechanics");
  console.log("  - NGO capacity management");
  console.log("  - Legal compliance tracking\n");
  console.log("Watch Forge extract the complete product spec in real-time!\n");
  process.exit(0);
}

runSimulation(channelId).catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
