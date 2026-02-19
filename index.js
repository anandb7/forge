require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');
const express = require('express');
const path = require('path');
const Hyperspell = require('hyperspell').default;

// Initialize Discord client
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Hyperspell (Sponsor Integration - Context Management)
const hyperspell = new Hyperspell({
  apiKey: process.env.HYPERSPELL_API_KEY,
});

const HYPERSPELL_COLLECTION = process.env.HYPERSPELL_COLLECTION || 'forge-b4x6';

// Initialize Express web server
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// 🧠 STRUCTURED PRODUCT STATE (In-Memory)
// ========================================
let productState = {
  product_name: "",
  target_users: "",
  problem_statement: "",
  core_features: [],
  tech_stack: [],
  constraints: [],
  frozen: false,
  history: [],
  hyperspellEnabled: true
};

// ========================================
// 🔮 HYPERSPELL HELPERS (Sponsor Integration)
// ========================================

// Store message in Hyperspell for long-term context
async function storeInHyperspell(author, content, metadata = {}) {
  if (!productState.hyperspellEnabled) return null;

  try {
    const memory = await hyperspell.memories.add({
      text: content,
      collection: HYPERSPELL_COLLECTION,
      metadata: {
        author,
        timestamp: new Date().toISOString(),
        product_name: productState.product_name || 'unknown',
        ...metadata
      }
    });
    console.log(`✅ Stored in Hyperspell: ${memory.resource_id}`);
    return memory.resource_id;
  } catch (error) {
    console.error('❌ Hyperspell storage error:', error.message);
    return null;
  }
}

// Retrieve relevant context from Hyperspell
async function getHyperspellContext(query = null) {
  if (!productState.hyperspellEnabled) return [];

  try {
    const memories = [];
    const page = await hyperspell.memories.list({
      collection: HYPERSPELL_COLLECTION,
      limit: 50 // Get last 50 messages
    });

    for (const memory of page.items) {
      memories.push({
        text: memory.text || memory.content || memory.data || '',
        metadata: memory.metadata,
        id: memory.resource_id || memory.id
      });
    }

    console.log(`📚 Retrieved ${memories.length} memories from Hyperspell`);
    return memories;
  } catch (error) {
    console.error('❌ Hyperspell retrieval error:', error.message);
    return [];
  }
}

// ========================================
// 🤖 LLM HELPER: Extract Structured Updates
// ========================================
async function extractProductUpdates(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Extract structured product updates from the following message.
Return JSON with fields:
- product_name (string)
- target_users (string)
- problem_statement (string)
- core_features (array of strings)
- tech_stack (array of strings)
- constraints (array of strings)

Only include fields that are clearly mentioned.
Do not hallucinate. If nothing relevant, return empty JSON {}.
Always return valid JSON only, no other text.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error("Error extracting updates:", error);
    return {};
  }
}

// ========================================
// 🔀 MERGE UPDATES INTO PRODUCT STATE
// ========================================
function mergeUpdates(updates) {
  const conflicts = [];

  // Merge simple string fields
  if (updates.product_name) productState.product_name = updates.product_name;
  if (updates.target_users) productState.target_users = updates.target_users;
  if (updates.problem_statement) productState.problem_statement = updates.problem_statement;

  // Merge arrays (avoid duplicates)
  if (updates.core_features) {
    updates.core_features.forEach(feature => {
      if (!productState.core_features.includes(feature)) {
        productState.core_features.push(feature);
      }
    });
  }

  // Detect tech stack conflicts
  if (updates.tech_stack) {
    const newTech = updates.tech_stack;
    const existingTech = productState.tech_stack;

    // Common conflict pairs
    const conflictPairs = [
      ['firebase', 'supabase'],
      ['react', 'vue', 'angular'],
      ['mongodb', 'postgresql', 'mysql'],
      ['rest', 'graphql'],
    ];

    newTech.forEach(tech => {
      const techLower = tech.toLowerCase();

      // Check for conflicts
      for (const pair of conflictPairs) {
        if (pair.some(t => techLower.includes(t))) {
          const conflictingExisting = existingTech.find(existing =>
            pair.some(t => existing.toLowerCase().includes(t) && !techLower.includes(t))
          );

          if (conflictingExisting) {
            conflicts.push(`${conflictingExisting} vs ${tech}`);
          }
        }
      }

      // Add if not duplicate
      if (!existingTech.some(t => t.toLowerCase() === techLower)) {
        productState.tech_stack.push(tech);
      }
    });
  }

  if (updates.constraints) {
    updates.constraints.forEach(constraint => {
      if (!productState.constraints.includes(constraint)) {
        productState.constraints.push(constraint);
      }
    });
  }

  return conflicts;
}

// ========================================
// 📋 GENERATE FORMATTED SUMMARY
// ========================================
function generateSummary() {
  const { product_name, target_users, problem_statement, core_features, tech_stack, constraints, frozen } = productState;

  let summary = "## 📦 Product Specification\n\n";

  if (product_name) summary += `**Product:** ${product_name}\n`;
  if (target_users) summary += `**Target Users:** ${target_users}\n`;
  if (problem_statement) summary += `**Problem:** ${problem_statement}\n\n`;

  if (core_features.length > 0) {
    summary += `**Core Features:**\n${core_features.map(f => `  • ${f}`).join('\n')}\n\n`;
  }

  if (tech_stack.length > 0) {
    summary += `**Tech Stack:**\n${tech_stack.map(t => `  • ${t}`).join('\n')}\n\n`;
  }

  if (constraints.length > 0) {
    summary += `**Constraints:**\n${constraints.map(c => `  • ${c}`).join('\n')}\n\n`;
  }

  summary += `**Status:** ${frozen ? '🔒 FROZEN' : '🔓 Open for updates'}\n`;

  return summary || "No product information captured yet. Start chatting about your idea!";
}

// ========================================
// 🚀 GENERATE MVP CODE
// ========================================
async function generateMVP() {
  try {
    const spec = generateSummary();

    // 🔮 Retrieve full conversation context from Hyperspell (Sponsor Integration)
    const hyperspellMemories = await getHyperspellContext();
    const conversationContext = hyperspellMemories.length > 0
      ? `\n\nFull Conversation History (from Hyperspell):\n${hyperspellMemories.map(m => `- ${m.metadata?.author || 'User'}: ${m.text}`).join('\n')}`
      : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a senior full-stack engineer.
Generate a minimal Next.js MVP application based on the following product spec.
Keep it simple and focused only on core features.

Return EXACTLY this structure:
1. Folder structure (tree format)
2. package.json content
3. pages/index.js content
4. Any necessary API routes or components
5. Setup instructions

Be concise but complete. Use modern React patterns.`
        },
        {
          role: "user",
          content: `Product Specification:\n${spec}${conversationContext}\n\nGenerate the MVP code.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating MVP:", error);
    return "❌ Failed to generate MVP. Please check your OpenAI API key and try again.";
  }
}

// ========================================
// 💬 DISCORD MESSAGE HANDLER
// ========================================
discord.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  const content = message.content.trim();

  // ========================================
  // 🔧 COMMAND: !summary
  // ========================================
  if (content === '!summary') {
    const summary = generateSummary();
    return message.reply(summary);
  }

  // ========================================
  // 🔧 COMMAND: !context (Hyperspell)
  // ========================================
  if (content === '!context') {
    const memories = await getHyperspellContext();

    let contextSummary = `📚 **Context & Memory Status**\n\n`;
    contextSummary += `🔮 **Hyperspell Integration** (Sponsor)\n`;
    contextSummary += `✅ Memories stored: ${memories.length}\n`;
    contextSummary += `📦 Collection: ${HYPERSPELL_COLLECTION}\n`;
    contextSummary += `⚡ Status: Active & Syncing\n\n`;

    // Show actual conversation from history
    if (productState.history.length > 0) {
      contextSummary += `💬 **Recent Conversation:**\n`;
      productState.history.slice(-5).forEach((msg, idx) => {
        const text = msg.content.substring(0, 80) + (msg.content.length > 80 ? '...' : '');
        contextSummary += `${idx + 1}. **${msg.author}**: ${text}\n`;
      });
    } else {
      contextSummary += `💬 No conversation yet. Start chatting!\n`;
    }

    return message.reply(contextSummary);
  }

  // ========================================
  // 🔧 COMMAND: !freeze
  // ========================================
  if (content === '!freeze') {
    if (productState.frozen) {
      return message.reply("⚠️ Spec is already frozen.");
    }

    productState.frozen = true;
    return message.reply("🔒 **Spec frozen.** Further discussion will not affect generation.\n\nUse `!generate` to create your MVP.");
  }

  // ========================================
  // 🔧 COMMAND: !generate
  // ========================================
  if (content === '!generate') {
    if (!productState.frozen) {
      return message.reply("⚠️ Please freeze the spec first using `!freeze`");
    }

    message.reply("🚀 Generating your MVP... This may take 20-30 seconds.");

    const mvpCode = await generateMVP();

    // Split response if too long for Discord (2000 char limit)
    const chunks = mvpCode.match(/[\s\S]{1,1900}/g) || [];
    for (const chunk of chunks) {
      await message.channel.send("```\n" + chunk + "\n```");
    }

    await message.channel.send("🎉 **MVP Generated!**\n\nMock deployment: https://forge-demo.vercel.app");
    return;
  }

  // ========================================
  // 🧠 NORMAL MESSAGE: Extract & Update State
  // ========================================
  if (!productState.frozen) {
    // Store message in history
    productState.history.push({
      author: message.author.username,
      content: content,
      timestamp: new Date().toISOString()
    });

    // 🔮 Store in Hyperspell for long-term context (Sponsor Integration)
    await storeInHyperspell(message.author.username, content, {
      channel: message.channel.name,
      messageId: message.id
    });

    // Extract structured updates via LLM
    const updates = await extractProductUpdates(content);

    if (Object.keys(updates).length > 0) {
      const conflicts = mergeUpdates(updates);

      // Notify about conflicts
      if (conflicts.length > 0) {
        message.react('⚠️');
        await message.reply(`⚠️ **Tech stack conflict detected:**\n${conflicts.map(c => `  • ${c}`).join('\n')}`);
      } else {
        message.react('✅');
      }
    }
  }
});

// ========================================
// 🟢 BOT READY
// ========================================
discord.on('ready', () => {
  console.log(`✅ Forge bot logged in as ${discord.user.tag}`);
  console.log(`🎯 Ready to capture product specs!`);
  console.log(`🔮 Hyperspell enabled - Context collection: ${HYPERSPELL_COLLECTION}`);
  console.log(`\nCommands:`);
  console.log(`  !summary  - View current spec`);
  console.log(`  !context  - View Hyperspell context`);
  console.log(`  !freeze   - Lock spec`);
  console.log(`  !generate - Generate MVP`);
});

// ========================================
// 🌐 WEB DASHBOARD API ENDPOINTS
// ========================================

// API: Get current product state
app.get('/api/state', (req, res) => {
  res.json(productState);
});

// API: Get conversation history
app.get('/api/history', (req, res) => {
  res.json(productState.history);
});

// API: Get stats
app.get('/api/stats', (req, res) => {
  res.json({
    totalMessages: productState.history.length,
    featureCount: productState.core_features.length,
    techStackCount: productState.tech_stack.length,
    constraintCount: productState.constraints.length,
    frozen: productState.frozen
  });
});

// Serve dashboard HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forge Dashboard - Product State Monitor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
    }
    h1 {
      font-size: 3em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .subtitle {
      font-size: 1.2em;
      opacity: 0.9;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }
    .card-title {
      font-size: 1.3em;
      font-weight: 600;
      color: #667eea;
    }
    .badge {
      background: #667eea;
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .badge.frozen {
      background: #e74c3c;
    }
    .badge.open {
      background: #2ecc71;
    }
    .product-name {
      font-size: 2em;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 10px;
    }
    .field-label {
      font-weight: 600;
      color: #666;
      margin-bottom: 5px;
    }
    .field-value {
      color: #333;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    ul {
      list-style: none;
    }
    ul li {
      padding: 8px 0;
      padding-left: 20px;
      position: relative;
    }
    ul li:before {
      content: "•";
      color: #667eea;
      font-weight: bold;
      font-size: 1.5em;
      position: absolute;
      left: 0;
    }
    .history-item {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 10px;
      border-left: 4px solid #667eea;
    }
    .history-author {
      font-weight: 600;
      color: #667eea;
      margin-bottom: 5px;
    }
    .history-content {
      color: #555;
      margin-bottom: 5px;
    }
    .history-time {
      font-size: 0.85em;
      color: #999;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
    }
    .stat-box {
      text-align: center;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      color: white;
    }
    .stat-value {
      font-size: 2.5em;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
      font-style: italic;
    }
    .refresh-info {
      text-align: center;
      color: white;
      margin-top: 20px;
      opacity: 0.8;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .live-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #2ecc71;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔥 Forge Dashboard</h1>
      <p class="subtitle"><span class="live-indicator"></span>Real-time Product State Monitor</p>
    </header>

    <div class="grid">
      <!-- Stats Card -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Statistics</span>
        </div>
        <div class="stats-grid" id="stats">
          <div class="stat-box">
            <div class="stat-value" id="messageCount">0</div>
            <div class="stat-label">Messages</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" id="featureCount">0</div>
            <div class="stat-label">Features</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" id="techCount">0</div>
            <div class="stat-label">Tech Stack</div>
          </div>
        </div>
      </div>

      <!-- Product Overview Card -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <span class="card-title">📦 Product Overview</span>
          <span class="badge" id="statusBadge">Open</span>
        </div>
        <div id="productOverview">
          <div class="empty-state">No product information captured yet...</div>
        </div>
      </div>
    </div>

    <div class="grid">
      <!-- Core Features Card -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">⚡ Core Features</span>
          <span class="badge" id="featureBadge">0</span>
        </div>
        <ul id="featuresList">
          <li class="empty-state">No features defined yet</li>
        </ul>
      </div>

      <!-- Tech Stack Card -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🛠 Tech Stack</span>
          <span class="badge" id="techBadge">0</span>
        </div>
        <ul id="techList">
          <li class="empty-state">No tech stack defined yet</li>
        </ul>
      </div>

      <!-- Constraints Card -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">⚠️ Constraints</span>
          <span class="badge" id="constraintBadge">0</span>
        </div>
        <ul id="constraintsList">
          <li class="empty-state">No constraints defined yet</li>
        </ul>
      </div>
    </div>

    <!-- Conversation History Card -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">💬 Conversation History</span>
        <span class="badge" id="historyBadge">0</span>
      </div>
      <div id="historyList">
        <div class="empty-state">No messages yet...</div>
      </div>
    </div>

    <div class="refresh-info">
      Auto-refreshing every 2 seconds • Last update: <span id="lastUpdate">Never</span>
    </div>
  </div>

  <script>
    async function fetchData() {
      try {
        const [stateRes, statsRes] = await Promise.all([
          fetch('/api/state'),
          fetch('/api/stats')
        ]);

        const state = await stateRes.json();
        const stats = await statsRes.json();

        updateDashboard(state, stats);
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    function updateDashboard(state, stats) {
      // Update stats
      document.getElementById('messageCount').textContent = stats.totalMessages;
      document.getElementById('featureCount').textContent = stats.featureCount;
      document.getElementById('techCount').textContent = stats.techStackCount;

      // Update status badge
      const statusBadge = document.getElementById('statusBadge');
      statusBadge.textContent = state.frozen ? '🔒 Frozen' : '🔓 Open';
      statusBadge.className = 'badge ' + (state.frozen ? 'frozen' : 'open');

      // Update product overview
      const overview = document.getElementById('productOverview');
      if (state.product_name || state.target_users || state.problem_statement) {
        overview.innerHTML = \`
          \${state.product_name ? \`<div class="product-name">\${state.product_name}</div>\` : ''}
          \${state.target_users ? \`
            <div class="field-label">Target Users</div>
            <div class="field-value">\${state.target_users}</div>
          \` : ''}
          \${state.problem_statement ? \`
            <div class="field-label">Problem Statement</div>
            <div class="field-value">\${state.problem_statement}</div>
          \` : ''}
        \`;
      } else {
        overview.innerHTML = '<div class="empty-state">No product information captured yet...</div>';
      }

      // Update features
      const featuresList = document.getElementById('featuresList');
      document.getElementById('featureBadge').textContent = state.core_features.length;
      if (state.core_features.length > 0) {
        featuresList.innerHTML = state.core_features.map(f => \`<li>\${f}</li>\`).join('');
      } else {
        featuresList.innerHTML = '<li class="empty-state">No features defined yet</li>';
      }

      // Update tech stack
      const techList = document.getElementById('techList');
      document.getElementById('techBadge').textContent = state.tech_stack.length;
      if (state.tech_stack.length > 0) {
        techList.innerHTML = state.tech_stack.map(t => \`<li>\${t}</li>\`).join('');
      } else {
        techList.innerHTML = '<li class="empty-state">No tech stack defined yet</li>';
      }

      // Update constraints
      const constraintsList = document.getElementById('constraintsList');
      document.getElementById('constraintBadge').textContent = state.constraints.length;
      if (state.constraints.length > 0) {
        constraintsList.innerHTML = state.constraints.map(c => \`<li>\${c}</li>\`).join('');
      } else {
        constraintsList.innerHTML = '<li class="empty-state">No constraints defined yet</li>';
      }

      // Update history
      const historyList = document.getElementById('historyList');
      document.getElementById('historyBadge').textContent = state.history.length;
      if (state.history.length > 0) {
        historyList.innerHTML = state.history.slice().reverse().map(h => \`
          <div class="history-item">
            <div class="history-author">\${h.author}</div>
            <div class="history-content">\${h.content}</div>
            <div class="history-time">\${new Date(h.timestamp).toLocaleString()}</div>
          </div>
        \`).join('');
      } else {
        historyList.innerHTML = '<div class="empty-state">No messages yet...</div>';
      }
    }

    // Initial fetch
    fetchData();

    // Auto-refresh every 2 seconds
    setInterval(fetchData, 2000);
  </script>
</body>
</html>
  `);
});

// ========================================
// 🚀 START WEB SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`🌐 Dashboard running at http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET /api/state`);
  console.log(`   - GET /api/history`);
  console.log(`   - GET /api/stats`);
});

// ========================================
// 🚀 START DISCORD BOT
// ========================================
discord.login(process.env.DISCORD_TOKEN);
