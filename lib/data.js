/* ─── SoftiIntel — single source of truth for content & SEO ─── */

export const SITE = {
  name: "SoftiIntel",
  tagline: "The AI-native creative technology agency",
  url: "https://softiintel.com",
  email: "ulfaths@softiintel.com",
  linkedin: "https://www.linkedin.com/company/110878416",
  description:
    "SoftiIntel is an AI-powered creative technology agency: AI agents, custom CRM development, web & mobile apps, automation, AI integrations and digital transformation — wrapped in award-level immersive design.",
};

export const SERVICES = [
  {
    slug: "ai-agents",
    title: "AI Agents",
    accent: "#5ee6ff",
    short: "Autonomous digital workers that research, write, qualify and act — around the clock.",
    hero: "Hire software that thinks.",
    body: "We design and deploy autonomous AI agents that plug into your stack and take real work off your team's plate — lead qualification, research, support triage, reporting, follow-ups. Not chat toys: governed, observable agents with clear hand-off rules.",
    deliverables: ["Agent strategy & workflow mapping", "Custom agent development", "Tool & CRM integrations", "Guardrails, evals & monitoring"],
    caseStudy: { client: "Regional logistics firm", result: "1,400 support tickets/month resolved autonomously, 71% deflection rate, CSAT up 18 points." },
    faqs: [
      ["What exactly is an AI agent?", "An AI agent is software that can reason about a goal, choose tools, and execute multi-step work autonomously — like qualifying inbound leads, drafting responses, or compiling research — with human oversight where it matters."],
      ["Will an AI agent work with our existing tools?", "Yes. We integrate agents with your CRM, helpdesk, email, WhatsApp and internal databases through APIs, so the agent operates inside the systems you already use."],
      ["How do we keep an AI agent safe and on-brand?", "Every SoftiIntel agent ships with guardrails: scoped permissions, approval checkpoints for sensitive actions, evaluation suites and full audit logs."],
      ["How long does it take to deploy an AI agent?", "A focused single-workflow agent typically ships in 3–6 weeks, including integration, testing and a supervised pilot phase."],
    ],
  },
  {
    slug: "crm-development",
    title: "CRM Development",
    accent: "#7c6cff",
    short: "A customer system moulded to your pipeline — not a template you contort around.",
    hero: "Your business is not a template.",
    body: "Off-the-shelf CRMs force your process into their boxes. We build the inverse: pipelines, fields, automations and dashboards shaped to exactly how your team sells and serves — and it's yours, with no per-seat ransom.",
    deliverables: ["Custom pipeline & data model", "Sales & service automations", "Owner dashboards & reporting", "WhatsApp, email & invoice actions"],
    caseStudy: { client: "12-person SME distributor", result: "Quote-to-close time cut from 9 days to 36 hours with automated follow-ups and one-click documents." },
    faqs: [
      ["Why build a custom CRM instead of using Salesforce or HubSpot?", "For SMEs, big-suite CRMs are expensive, overloaded and rigid. A custom CRM costs less over 3 years, matches your exact workflow and never charges per seat."],
      ["Can a custom CRM integrate with WhatsApp and email?", "Yes — we wire one-click WhatsApp messages, email sequences, invoicing and call logging directly into your pipeline view."],
      ["How long does custom CRM development take?", "Most SoftiIntel CRM builds launch a working core in 4–8 weeks, then evolve in weekly increments with your team's feedback."],
      ["Who owns the CRM after launch?", "You do. Full source code, your infrastructure or ours, no lock-in."],
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    accent: "#5ee6ff",
    short: "Fast, SEO-first, standards-grade builds — including immersive WebGL experiences like this one.",
    hero: "The web, engineered to be felt.",
    body: "From conversion-focused marketing sites to 3D storytelling experiences, we ship performant, accessible, search-optimised builds on modern stacks — Next.js, edge rendering, WebGL where it earns its keep.",
    deliverables: ["Next.js & headless builds", "3D / WebGL immersive storytelling", "Technical SEO & Core Web Vitals", "CMS & analytics wiring"],
    caseStudy: { client: "D2C skincare brand", result: "Lighthouse 98 performance, organic traffic +212% in 6 months after relaunch." },
    faqs: [
      ["Do immersive 3D websites hurt SEO or speed?", "Not when engineered properly. We server-render all content, lazy-load WebGL, and budget performance so immersive sites still pass Core Web Vitals."],
      ["Which technologies does SoftiIntel use for web development?", "Next.js, React, Three.js/WebGL, GSAP and Tailwind, deployed on edge infrastructure with CI/CD."],
      ["Can you redesign our existing website without losing rankings?", "Yes — we migrate with full redirect maps, structured data and pre/post crawl audits to protect and usually improve rankings."],
    ],
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    accent: "#ffb454",
    short: "Your business in their pocket — bookings, loyalty, ordering, built for small teams.",
    hero: "Closer than a browser tab.",
    body: "We build mobile apps that give small businesses a direct line to their customers: bookings, ordering, loyalty, push re-engagement — designed for quick access and zero training.",
    deliverables: ["iOS & Android (cross-platform)", "Bookings, ordering & loyalty", "Push notification campaigns", "App store launch & ASO"],
    caseStudy: { client: "Salon chain (3 locations)", result: "41% of bookings moved in-app within 90 days; no-shows down 27% via automated reminders." },
    faqs: [
      ["Native or cross-platform — what does SoftiIntel recommend?", "For most SMEs, cross-platform (one codebase for iOS and Android) ships faster and costs less, with native-feeling performance."],
      ["How much does a small business mobile app cost?", "Focused MVPs typically land well below agency-suite pricing because we scope to the features your customers actually use. We quote fixed, not hourly."],
      ["Can the app connect to our CRM and WhatsApp?", "Yes — apps we build plug into your CRM, WhatsApp automation and payment stack so everything stays in sync."],
    ],
  },
  {
    slug: "automation",
    title: "Automation Solutions",
    accent: "#5ef0b0",
    short: "WhatsApp flows, back-office bots and follow-ups that never sleep.",
    hero: "Your best employee never sleeps.",
    body: "We automate the repetitive half of your business: WhatsApp replies and order updates, invoice chasing, report generation, data entry between systems. You keep the judgement calls; the robots keep the routine.",
    deliverables: ["WhatsApp business automation", "Workflow & back-office bots", "Abandoned-enquiry recovery", "Reporting on autopilot"],
    caseStudy: { client: "E-commerce retailer", result: "Recovered 23% of abandoned enquiries with automated WhatsApp follow-ups — paid for itself in 11 days." },
    faqs: [
      ["What can WhatsApp automation actually do?", "Instant answers to common questions, booking confirmations, order status updates, payment reminders and re-engagement campaigns — in your tone of voice, 24/7."],
      ["Is WhatsApp automation allowed by Meta?", "Yes — we build on the official WhatsApp Business API with approved templates, so your number stays compliant and safe."],
      ["Which processes should we automate first?", "We start with a process audit: highest-volume, lowest-judgement tasks first — usually enquiries, reminders and status updates."],
    ],
  },
  {
    slug: "ai-integrations",
    title: "AI Integrations",
    accent: "#ff6ec7",
    short: "LLMs wired into your product and ops — search, copilots, document intelligence.",
    hero: "Intelligence, embedded.",
    body: "We retrofit intelligence into the software you already run: semantic search over your documents, copilots inside your tools, extraction from invoices and forms, classification and routing. Measured by hours saved, not demos.",
    deliverables: ["LLM features in your product", "Document intelligence & OCR", "Semantic search / RAG pipelines", "Evaluation & cost optimisation"],
    caseStudy: { client: "Accounting practice", result: "Invoice processing time cut 83% with document-AI extraction feeding straight into their ledger." },
    faqs: [
      ["What is an AI integration versus an AI agent?", "Integrations add intelligence to existing software (smart search, extraction, suggestions). Agents act autonomously on goals. Most clients start with integrations, then graduate workflows to agents."],
      ["Is our data safe when integrating AI?", "Yes — we design for data privacy: scoped access, no training on your data, regional hosting options and full audit trails."],
      ["Which AI models does SoftiIntel work with?", "We're model-agnostic: Claude, GPT, Gemini and open-weight models — chosen per task for quality, latency and cost."],
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    accent: "#c9a2ff",
    short: "Internal tools and platforms that fit like they were grown in-house — because they were.",
    hero: "Software that fits like skin.",
    body: "When spreadsheets buckle and SaaS subscriptions multiply, we build the one system that replaces seven: operations platforms, client portals, inventory, scheduling — designed around your people.",
    deliverables: ["Internal tools & portals", "Inventory, ops & scheduling systems", "Legacy system modernisation", "API design & integrations"],
    caseStudy: { client: "Construction firm", result: "Replaced 6 tools and 40 weekly spreadsheet-hours with one ops platform; payback in under 5 months."},
    faqs: [
      ["How do you keep custom software affordable for SMEs?", "Tight scoping, modern frameworks and weekly shipping increments — you see working software every week and steer before money is spent in the wrong direction."],
      ["What happens after launch — who maintains it?", "Your choice: we hand over clean, documented code, or stay on retainer for evolution. Either way, you own everything."],
      ["Can you modernise our legacy system without downtime?", "Yes — we run strangler-pattern migrations: the new system grows around the old one until it can be switched off safely."],
    ],
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    accent: "#5ee6ff",
    short: "A pragmatic roadmap from paper-and-spreadsheets to an AI-operated business.",
    hero: "Evolve before it's urgent.",
    body: "Transformation isn't a 200-page deck — it's a sequence of shipped systems. We audit how your business actually runs, then deliver the roadmap in increments: digitise, integrate, automate, and finally let AI agents operate the routine.",
    deliverables: ["Digital maturity audit", "Transformation roadmap & quick wins", "Systems integration", "Team enablement & training"],
    caseStudy: { client: "Family-run wholesaler", result: "From paper orders to a connected CRM + WhatsApp + inventory stack in 5 months; order errors down 92%." },
    faqs: [
      ["Where should a small business start with digital transformation?", "With the bottleneck that costs you most — usually order intake, follow-ups or reporting. We find it in a 2-week audit and ship a fix first, strategy second."],
      ["How is SoftiIntel different from a consulting firm?", "We're builders. Every recommendation comes with the team that can ship it — strategy and execution under one roof."],
      ["How do you measure transformation success?", "Hours saved, error rates, response times and revenue per employee — agreed up front, reported monthly."],
    ],
  },
];

export const AGENTS_SHOWCASE = [
  { name: "Scout", role: "Lead Qualifier", desc: "Watches every inbound channel, scores and enriches leads, books the good ones straight into your calendar.", steps: ["Capture enquiry", "Enrich & score", "Qualify via chat", "Book meeting"] },
  { name: "Relay", role: "Support Triage", desc: "Resolves the repetitive 70% of tickets and routes the rest to the right human with full context attached.", steps: ["Read ticket", "Resolve or escalate", "Draft reply", "Log to CRM"] },
  { name: "Ledger", role: "Back-office Analyst", desc: "Extracts data from invoices and forms, reconciles records, and compiles your Monday-morning numbers.", steps: ["Ingest documents", "Extract & validate", "Reconcile", "Report"] },
  { name: "Echo", role: "Follow-up Engine", desc: "Never lets a warm enquiry go cold — polite, on-brand persistence across WhatsApp and email.", steps: ["Detect silence", "Compose follow-up", "Send & track", "Hand off on reply"] },
];

export const WORK = [
  { client: "Meridian Logistics", sector: "Supply chain", title: "An AI agent fleet for freight support", result: "71% ticket deflection", accent: "#5ee6ff" },
  { client: "Casa Verde", sector: "D2C retail", title: "Immersive 3D storefront & storytelling", result: "+212% organic traffic", accent: "#5ef0b0" },
  { client: "Northwind Salons", sector: "Services", title: "Bookings app with automated re-engagement", result: "–27% no-shows", accent: "#ffb454" },
  { client: "Atlas Build Co.", sector: "Construction", title: "One ops platform to replace seven tools", result: "5-month payback", accent: "#c9a2ff" },
];

export const HOME_FAQS = [
  ["What does SoftiIntel do?", "SoftiIntel is an AI-native creative technology agency. We build AI agents, custom CRMs, websites, mobile apps, automations and AI integrations for businesses that want intelligence working for them around the clock."],
  ["Who does SoftiIntel work with?", "Primarily ambitious SMEs and growing teams — businesses big enough to feel operational pain, small enough to move fast on fixing it."],
  ["How do projects with SoftiIntel start?", "With a conversation and a 2-week discovery sprint: we map your workflows, find the highest-leverage opportunity, and ship a first working increment."],
  ["Where is SoftiIntel located?", "We operate remote-first and serve clients globally, with deep experience in WhatsApp-first markets."],
];

export const COUNTRIES = [
  ["IN", "India", "+91"], ["US", "United States", "+1"], ["GB", "United Kingdom", "+44"],
  ["AE", "United Arab Emirates", "+971"], ["SA", "Saudi Arabia", "+966"], ["SG", "Singapore", "+65"],
  ["AU", "Australia", "+61"], ["CA", "Canada", "+1"], ["DE", "Germany", "+49"],
  ["FR", "France", "+33"], ["NL", "Netherlands", "+31"], ["ES", "Spain", "+34"],
  ["IT", "Italy", "+39"], ["PT", "Portugal", "+351"], ["IE", "Ireland", "+353"],
  ["CH", "Switzerland", "+41"], ["SE", "Sweden", "+46"], ["NO", "Norway", "+47"],
  ["DK", "Denmark", "+45"], ["FI", "Finland", "+358"], ["PL", "Poland", "+48"],
  ["CZ", "Czechia", "+420"], ["AT", "Austria", "+43"], ["BE", "Belgium", "+32"],
  ["NZ", "New Zealand", "+64"], ["JP", "Japan", "+81"], ["KR", "South Korea", "+82"],
  ["CN", "China", "+86"], ["HK", "Hong Kong", "+852"], ["MY", "Malaysia", "+60"],
  ["TH", "Thailand", "+66"], ["ID", "Indonesia", "+62"], ["PH", "Philippines", "+63"],
  ["VN", "Vietnam", "+84"], ["BD", "Bangladesh", "+880"], ["PK", "Pakistan", "+92"],
  ["LK", "Sri Lanka", "+94"], ["NP", "Nepal", "+977"], ["QA", "Qatar", "+974"],
  ["KW", "Kuwait", "+965"], ["BH", "Bahrain", "+973"], ["OM", "Oman", "+968"],
  ["EG", "Egypt", "+20"], ["NG", "Nigeria", "+234"], ["KE", "Kenya", "+254"],
  ["ZA", "South Africa", "+27"], ["BR", "Brazil", "+55"], ["MX", "Mexico", "+52"],
  ["AR", "Argentina", "+54"], ["TR", "Türkiye", "+90"],
];

/** Per-route particle theme for the shared WebGL background.
 *  morph: 1 = scroll drives the full ten-scene formation journey (home);
 *         0 = field parks in a calm nebula so sub-pages read as backdrop. */
export const ROUTE_THEMES = {
  "/": { a: "#5ee6ff", b: "#7c6cff", energy: 1.0, morph: 1 },
  "/about": { a: "#7c6cff", b: "#5ee6ff", energy: 0.6, morph: 0 },
  "/services": { a: "#5ee6ff", b: "#5ef0b0", energy: 0.8, morph: 0 },
  "/ai-agents": { a: "#5ee6ff", b: "#ff6ec7", energy: 1.2, morph: 0 },
  "/work": { a: "#ffb454", b: "#7c6cff", energy: 0.9, morph: 0 },
  "/contact": { a: "#5ef0b0", b: "#5ee6ff", energy: 0.7, morph: 0 },
};
