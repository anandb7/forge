import { useState, useMemo } from "react";
import { Plus, MessageSquare, TrendingUp, Users, CheckCircle, Search, Copy, ExternalLink, Check, Sparkles, ChevronDown, ChevronUp, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpinionCard, Opinion, Category } from "@/components/OpinionCard";
import { SubmitOpinionModal } from "@/components/SubmitOpinionModal";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const SAMPLE_OPINIONS: Opinion[] = [
  {
    id: "1",
    author: "Alex Rivera",
    avatarColor: "#6366f1",
    category: "Tech Stack",
    priority: "High",
    status: "In Review",
    title: "Migrate from REST to GraphQL for our core API",
    body: "GraphQL would significantly reduce over-fetching issues we've been seeing. Our mobile clients are pulling too much data and it's hurting performance on slower connections.",
    upvotes: 12,
    downvotes: 3,
    timestamp: "Feb 18, 10:24 AM",
  },
  {
    id: "2",
    author: "Sarah Chen",
    avatarColor: "#10b981",
    category: "Features",
    priority: "Critical",
    status: "Open",
    title: "Add real-time collaboration to the editor",
    body: "Our biggest competitors all have live co-editing. This is becoming a deal-breaker in sales calls. We need to at least prototype this with Yjs or similar CRDT approach.",
    upvotes: 24,
    downvotes: 1,
    timestamp: "Feb 18, 09:15 AM",
  },
  {
    id: "3",
    author: "Marcus Johnson",
    avatarColor: "#f59e0b",
    category: "Design",
    priority: "Medium",
    status: "Approved",
    title: "Redesign the onboarding flow with progressive disclosure",
    body: "New users are dropping off at step 3 of onboarding. I propose we implement a progressive disclosure pattern — show only what's necessary upfront, reveal complexity gradually.",
    upvotes: 18,
    downvotes: 2,
    timestamp: "Feb 17, 04:30 PM",
  },
  {
    id: "4",
    author: "Priya Patel",
    avatarColor: "#ec4899",
    category: "Process",
    priority: "High",
    status: "Open",
    title: "Introduce weekly async standups instead of daily calls",
    body: "Daily standups are eating into deep work time. I suggest a written async update every Monday + Thursday, with video only for blockers. Could save ~2.5 hours/week per dev.",
    upvotes: 15,
    downvotes: 7,
    timestamp: "Feb 17, 02:00 PM",
  },
  {
    id: "5",
    author: "Tom Nakamura",
    avatarColor: "#0ea5e9",
    category: "Tech Stack",
    priority: "Low",
    status: "Open",
    title: "Evaluate Bun as a replacement for Node.js in our CLI tools",
    body: "Bun's startup time is dramatically faster than Node. Our internal CLI tools could benefit massively. Worth a 2-day spike to measure the actual impact before committing.",
    upvotes: 9,
    downvotes: 4,
    timestamp: "Feb 16, 11:45 AM",
  },
  {
    id: "6",
    author: "Lisa Wang",
    avatarColor: "#8b5cf6",
    category: "Features",
    priority: "Medium",
    status: "Rejected",
    title: "Build a native mobile app instead of PWA",
    body: "PWAs have limitations on iOS that frustrate our mobile users. A React Native wrapper around our core features would provide a much better native experience for push notifications.",
    upvotes: 6,
    downvotes: 11,
    timestamp: "Feb 15, 03:20 PM",
  },
];

const ALL_CATEGORIES: ("All" | Category)[] = ["All", "Features", "Tech Stack", "Design", "Process"];

function generatePRD(_opinions: Opinion[]): string {
  return `# PRD: Uber Eats "Food for Good" (V1 MVP)

**Document Status:** Approved | **Target Release:** Q3 | **Product Manager:** Sarah
**Cross-Functional Leads:** Priya (Routing), David (Infra), Leo (UX), Elena (NGO CX), Marcus (Rest. Sales)

---

## 1. Executive Summary

Every day, restaurant partners throw away thousands of pounds of unsold, edible food due to the logistical friction of donating it at closing time. Concurrently, local NGOs struggle with food insecurity. "Food for Good" leverages Uber Eats' existing dispatch algorithms and driver network to seamlessly route end-of-day surplus food to verified local NGOs. By removing the friction for restaurants and automating the logistics, we transform food waste into community nourishment while providing a clear business incentive (tax deductions) to our partners.

---

## 2. Problem Statements

**For Restaurants:** Donating food requires too much manual tracking and coordination at the end of exhausting shifts. They lack an easy way to claim tax deductions for surplus inventory.

**For NGOs:** Predicting and receiving ad-hoc donations is chaotic. They lack the staff to manually coordinate logistics or vet food safety at scale.

**For Uber:** We have idle driver capacity late at night but lack a subsidized, high-social-impact feature to boost brand equity and driver retention.

---

## 3. Goals & Non-Goals

### Goals (MVP)
- Enable restaurants to donate surplus food in under 3 taps on their existing tablet.
- Automate driver matching to deliver food to verified NGOs in < 25 minutes.
- Generate automated, audit-compliant estimated tax receipts for restaurants.
- Maintain a 99% food safety compliance rate via NGO-driven Trust Scores.

### Non-Goals (Out of Scope for V1)
- Building a volunteer driver network (too high latency/infra cost; we will use the paid fleet).
- Itemized, SKU-level food tracking (adds too much friction for restaurant staff).
- Integrated tax advisory (we provide estimates, not legal tax advice).

---

## 4. Target Personas & User Journeys

### A. The Restaurant Manager ("The Donor")
**Need:** Quick offloading of food, valid tax write-offs.
**Journey:** At closing, staff taps a new "Food for Good" button on their Uber tablet. They select volume (e.g., "2 Boxes") and toggle tags (Hot ♨️ or Cold ❄️). They seal the boxes and hand them to the assigned driver.
**Value Prop:** Zero-friction disposal and an automated end-of-month estimated tax receipt.

### B. The Driver ("The Courier")
**Need:** Fast trips, no waiting around, high incentives.
**Journey:** Opts into "Community Runs" in app settings. Receives a special green-badged ping. Picks up food, drives to NGO, takes a photo of the boxes inside the door (no signature required), and leaves.
**Value Prop:** Earns standard base fare (subsidized by Uber CSR) plus 3x Uber Pro Points to hit tier status faster.

### C. The NGO Director ("The Recipient")
**Need:** Safe, predictable food arrivals without constant monitoring.
**Journey:** Uses a "Set and Forget" portal to set weekly capacity (e.g., "50 meals, 9 PM - 1 AM"). Receives food automatically. The next morning, receives a push notification to rate the previous night's food quality (🌟, ⚠️, 🛑).
**Value Prop:** Reliable food supply with emergency surge controls.

---

## 5. Key Features & UX Requirements

**"Tag & Bag" UI** — Restaurant-side input. Replaces itemized lists with bulk categories.
  Flow: 3 Taps: Volume → Hot/Cold Toggle → Confirm.

**NGO Preference Center** — Dashboard for NGOs to define operating hours and max daily capacity limits.
  Flow: Web portal: "Set and Forget" toggles.

**Emergency Surge Push** — Real-time override for NGOs when restaurants have massive surplus (e.g., holidays).
  Flow: App Push: "High surplus area. Accept 20 extra meals?" [Yes] [No]

**Trust Score System** — NGO-driven auditing. Restaurants get strikes for sending unsafe/trash food.
  Flow: Morning-after emoji rating (🌟/⚠️/🛑). Drops < 4.5 pause tax benefits.

**Contactless Audit** — Proof of delivery for Legal/Tax purposes without forcing NGO staff to sign screens.
  Flow: Driver takes a photo of the dropped-off boxes. Geotagged & timestamped.

---

## 6. Technical Architecture & API Strategy

### A. Core Routing Constraints (Priya - Eng)
- **Time Limit:** Hard cap of 25 minutes from pickup to drop-off.
- **Bag Constraints:** Query driver profile DB; only ping drivers with has_insulated_bag == true.
- **Batching Logic:** Hot and Cold payloads cannot be batched in the same vehicle if the total route exceeds 20 minutes.
- **Staggered Surge Arrivals:** If an NGO accepts a surge push, the API will queue dispatches to enforce a delay_arrival == 300s (5 mins) between drivers to prevent physical traffic jams at the shelter.

### B. Edge Case Handling: "Cascade Match" & Orphaned Food
If the primary NGO is closed upon arrival:
1. Driver marks Dropoff_Failed in app.
2. Backend instantly queries closest_open_ngo within a 10-minute radius.
3. If Match = True: Reroute driver (CSR pays extra mileage).
4. If Match = False (Terminal State): Instruct driver to safely dispose/keep food. Log event to monitor driver fraud rates.

### C. Data & Infra (David - Eng)
- **Tax Receipt Microservice:** A cron job will run monthly, joining completed delivery data (volume x average menu price) with the AWS bucket holding the driver's delivery photos (metadata: timestamp, GPS) to generate a PDF receipt.
- **Trust Score DB:** A simple relational table tracking restaurant_id against ngo_ratings. A trigger will automatically revoke the tax_eligible boolean if the score drops below the threshold.

---

## 7. Key Decisions & Trade-Offs

**Paid Drivers (CSR Subsidized) + Uber Pro Points** vs. Volunteer network
→ Building a volunteer parallel dispatch was a 6-month Eng effort and highly unreliable at midnight. Utilizing the paid fleet guarantees SLAs.

**Photo-Proof of Delivery** vs. NGO digital signatures
→ NGOs are understaffed; waiting for signatures degrades driver experience. Photos + GPS metadata satisfy legal audit trails.

**Post-Delivery Auditing (Trust Score)** vs. Pre-delivery photo checks
→ Forcing tired restaurant workers to photograph every box creates friction, leading to drop-off. Trust scores enable self-policing.

---

## 8. Effort Estimation & Timeline (T-Shirt Sizing)

**Total Estimated Time to MVP: 6 Sprints (12 Weeks)**

- **Sprint 1-2 (Design & Legal):** Finalize wireframes (Leo), Draft tax/liability disclaimers (Marcus/Legal).
- **Sprint 3-4 (Backend / Routing):** Build Cascade Match logic, Staggered Arrival logic, and driver filtering (Priya). DB schema for Trust Scores (David).
- **Sprint 5 (Frontend Integrations):** Update Restaurant Tablet UI, Driver App (Green Pings/Points), NGO Web Portal.
- **Sprint 6 (Testing & QA):** End-to-end integration testing, QA edge cases (Orphaned food simulations).

---

## 9. Success Metrics (KPIs)

- **Primary Metric:** Number of meals diverted from waste to NGOs per week.
- **Adoption:** % of active restaurants utilizing the feature at least 1x/week.
- **Reliability:** % of successful drop-offs vs. Orphaned Food terminal states (Target: >95% success).
- **Quality:** Average Restaurant Trust Score (Target: >4.8).
- **Driver Engagement:** Opt-in rate for "Community Runs."`;
}

/** Converts the PRD into a concise, action-oriented Lovable build prompt */
function buildLovablePrompt(opinions: Opinion[]): string {
  const sorted = [...opinions].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  const byCategory: Partial<Record<Category, Opinion[]>> = {};
  sorted.forEach((op) => {
    if (!byCategory[op.category]) byCategory[op.category] = [];
    byCategory[op.category]!.push(op);
  });

  const lines: string[] = [
    `Build a web application called "Food for Good" based on our team's voted product requirements:\n`,
  ];

  const features = byCategory["Features"];
  if (features?.length) {
    lines.push("FEATURES (implement these in priority order):");
    features.slice(0, 3).forEach((o, i) => lines.push(`  ${i + 1}. ${o.title} — ${o.body}`));
  }

  const tech = byCategory["Tech Stack"];
  if (tech?.length) {
    lines.push("\nTECH STACK PREFERENCES:");
    tech.slice(0, 2).forEach((o) => lines.push(`  • ${o.title}: ${o.body}`));
  }

  const design = byCategory["Design"];
  if (design?.length) {
    lines.push("\nDESIGN DIRECTION:");
    design.slice(0, 2).forEach((o) => lines.push(`  • ${o.title}: ${o.body}`));
  }

  const critical = sorted.filter((o) => o.priority === "Critical");
  if (critical.length) {
    lines.push("\nMUST-HAVE (Critical Priority):");
    critical.forEach((o) => lines.push(`  - ${o.title}`));
  }

  lines.push(`\nPrioritize the highest-voted features, modern accessible UI, and clean component architecture. The team has ${opinions.length} collective opinions backing these requirements.`);

  return lines.join("\n");
}

export default function Index() {
  const [opinions, setOpinions] = useState<Opinion[]>(SAMPLE_OPINIONS);
  const [activeCategory, setActiveCategory] = useState<"All" | Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"votes" | "newest">("votes");
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [building, setBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);

  const prd = useMemo(() => generatePRD(opinions), [opinions]);
  const lovablePrompt = useMemo(() => buildLovablePrompt(opinions), [opinions]);

  const handleVote = (id: string, type: "up" | "down") => {
    setOpinions((prev) =>
      prev.map((op) =>
        op.id === id
          ? {
              ...op,
              upvotes: type === "up" ? op.upvotes + 1 : op.upvotes,
              downvotes: type === "down" ? op.downvotes + 1 : op.downvotes,
            }
          : op
      )
    );
  };

  const handleSubmit = (opinion: Opinion) => {
    setOpinions((prev) => [opinion, ...prev]);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const BUILD_STEPS = [
    "Analysing PRD & extracting requirements…",
    "Ranking features by team vote score…",
    "Synthesising Lovable build prompt…",
    "Launching Lovable with your prompt…",
  ];

  const handleBuildInLovable = async () => {
    setBuilding(true);
    setBuildStep(0);
    for (let i = 0; i < BUILD_STEPS.length; i++) {
      setBuildStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    const encoded = encodeURIComponent(lovablePrompt);
    window.open(`https://lovable.dev/?autosubmit=true#prompt=${encoded}`, "_blank");
    await new Promise((r) => setTimeout(r, 400));
    setBuilding(false);
    setBuildStep(0);
  };

  // keep old alias for copy button
  const handleSendToLovable = handleBuildInLovable;

  const filtered = opinions
    .filter((op) => (activeCategory === "All" ? true : op.category === activeCategory))
    .filter((op) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        op.title.toLowerCase().includes(q) ||
        op.body.toLowerCase().includes(q) ||
        op.author.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "votes") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      return 0;
    });

  const totalOpinions = opinions.length;
  const approvedCount = opinions.filter((o) => o.status === "Approved").length;
  const uniqueAuthors = new Set(opinions.map((o) => o.author)).size;
  const topCategory = (() => {
    const counts: Record<string, number> = {};
    opinions.forEach((o) => { counts[o.category] = (counts[o.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  })();

  const stats = [
    { label: "Total Opinions", value: totalOpinions, icon: MessageSquare, gradient: "gradient-stat-blue" },
    { label: "Team Members", value: uniqueAuthors, icon: Users, gradient: "gradient-stat-cyan" },
    { label: "Approved", value: approvedCount, icon: CheckCircle, gradient: "gradient-stat-green" },
    { label: "Top Category", value: topCategory, icon: TrendingUp, gradient: "gradient-stat-orange" },
  ];

  const promptLines = prd.split("\n");
  const previewLines = promptLines.slice(0, 6);
  const hasMore = promptLines.length > 6;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        <img src={dashboardHero} alt="Dashboard header" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 px-6 md:px-10 py-10 max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sky-300 text-sm font-semibold tracking-widest uppercase mb-2">Team Pulse</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Feature Board</h1>
              <p className="mt-2 text-slate-300 text-base max-w-xl">
                Collect your team's ideas, vote on priorities, and generate a ready-to-build PRD for Lovable.
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="mt-2 gap-2 font-semibold px-5 py-2.5 shadow-primary rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Share Opinion
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {stats.map((stat) => (
              <div key={stat.label} className={`${stat.gradient} rounded-xl p-4 flex items-center gap-3`}>
                <stat.icon className="h-5 w-5 text-white/80 shrink-0" />
                <div>
                  <p className="text-white/70 text-xs font-medium">{stat.label}</p>
                  <p className="text-white text-xl font-bold leading-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">

        {/* ── Generated Prompt Section ── */}
        <div className="rounded-2xl border border-primary/20 bg-card shadow-card overflow-hidden">
          {/* Header */}
          <div className="gradient-card-accent px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Food for Good</h2>
                <p className="text-white/70 text-xs">Product Requirements Document · {opinions.length} team opinions · updates live as votes change</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                size="sm"
                onClick={handleBuildInLovable}
                disabled={building}
                className="gap-2 bg-white text-primary font-semibold hover:bg-white/90 disabled:opacity-70"
              >
                <Rocket className="h-3.5 w-3.5" />
                {building ? "Building…" : "Build MVP"}
              </Button>
            </div>
          </div>

          {/* PRD body */}
          <div className="px-6 py-5 bg-muted/30">
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {promptExpanded ? prd : previewLines.join("\n") + (hasMore && !promptExpanded ? "\n…" : "")}
            </pre>
            {hasMore && (
              <button
                onClick={() => setPromptExpanded(!promptExpanded)}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {promptExpanded ? (
                  <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
                ) : (
                  <><ChevronDown className="h-3.5 w-3.5" /> Show full PRD</>
                )}
              </button>
            )}
          </div>

          {/* Build Script Panel */}
          {building && (
            <div className="border-t border-border px-6 py-4 bg-muted/20">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Build Script Running…</p>
              <div className="space-y-2">
                {BUILD_STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${i <= buildStep ? "opacity-100" : "opacity-30"}`}>
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${i < buildStep ? "border-primary bg-primary" : i === buildStep ? "border-primary animate-pulse" : "border-border"}`}>
                      {i < buildStep && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                    <span className={i < buildStep ? "text-foreground line-through opacity-60" : i === buildStep ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="border-t border-border px-6 py-4 bg-primary/5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Clicking <span className="font-semibold text-foreground">Build MVP</span> runs a script that synthesises your PRD into an actionable prompt and opens Lovable with it pre-filled — ready to build.
            </p>
            <Button onClick={handleBuildInLovable} disabled={building} className="gap-2 font-semibold shadow-primary disabled:opacity-70">
              <Rocket className="h-4 w-4" />
              {building ? "Running script…" : "Build MVP →"}
            </Button>
          </div>
        </div>

        {/* ── Opinions Section ── */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Team Opinions</h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opinions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-52 h-9 text-sm"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "votes" | "newest")}
                className="text-sm border border-border rounded-lg px-3 bg-card text-foreground cursor-pointer"
              >
                <option value="votes">Top Voted</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Opinion Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No opinions found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Try a different category or be the first to share one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((opinion) => (
                <OpinionCard key={opinion.id} opinion={opinion} onVote={handleVote} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SubmitOpinionModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
