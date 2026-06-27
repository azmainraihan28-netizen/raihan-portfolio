// Parses E:\Cowork\Linkedin growth\30day_challenge_tracker.md plus the per-day
// linkedin post + JSON workflow files, and produces:
//   content/work/dayN-<slug>.mdx  (one per day, 30 total)
//   public/workflows/dayN_<file>.json  (copied for download)
//
// Run with:  npm run import
//
// Re-running is idempotent — files are overwritten.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = 'E:/Cowork/Linkedin growth';
const TRACKER = path.join(SOURCE, '30day_challenge_tracker.md');
const OUT_MDX = path.join(ROOT, 'content/work');
const OUT_JSON = path.join(ROOT, 'public/workflows');
const SHOTS_SRC = path.join(ROOT, 'public/workflows/screenshots');
const SHOTS_OUT = path.join(ROOT, 'public/workflows/shots');

// ---------- helpers ----------

const WEEK_OF_DAY = (d) => (d <= 7 ? 1 : d <= 14 ? 2 : d <= 21 ? 3 : 4);
const CATEGORY_OF_WEEK = {
  1: 'Foundations',
  2: 'Marketing & Sales',
  3: 'Internal Ops',
  4: 'Advanced & Agentic',
};
const FEATURED_DAYS = new Set([9, 16, 22, 26, 29, 30]);

// Friendly titles for days 1-4 that aren't in the tracker prose
const FALLBACK = {
  1: { title: "Founder's Choice Kickoff", slug: 'kickoff', tagline: 'Launching the 30-day n8n challenge' },
  2: { title: 'AI Content Repurposing Engine', slug: 'content-repurposing-engine', tagline: 'One long post → 6 social assets' },
  3: { title: 'AI Email Triage + Auto-Draft Replies', slug: 'email-triage-auto-replies', tagline: 'Gmail triage with GPT-4o-mini drafts' },
  4: { title: 'Lead Capture → AI Qualifier → CRM + Slack', slug: 'lead-capture-qualifier', tagline: 'Score every lead the moment it lands' },
};

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeYaml(s) {
  return String(s).replace(/"/g, '\\"');
}

function arrYaml(arr) {
  return '[' + arr.map((x) => `"${escapeYaml(x)}"`).join(', ') + ']';
}

function parsePrice(line) {
  // Match "$X–$Y" or "$X-$Y" or "$X,XXX–$Y,YYY"
  const m = line.match(/\$\s?([\d,]+)\s?[–-]\s?\$\s?([\d,]+)/);
  if (!m) return null;
  return { low: parseInt(m[1].replace(/,/g, ''), 10), high: parseInt(m[2].replace(/,/g, ''), 10) };
}

function bulletsFromBlock(block) {
  return block
    .split('\n')
    .map((l) => l.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean);
}

// ---------- main parse ----------

async function buildScreenshotMap() {
  // Maps day number → "/workflows/shots/dayN.<ext>" (copied with normalized name)
  const map = {};
  try {
    await fs.mkdir(SHOTS_OUT, { recursive: true });
    const files = await fs.readdir(SHOTS_SRC);
    const orphans = [];
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
      // Extract first integer 1–30 from filename — matches "Day 6", "day19", "Day  2", etc.
      const m = file.toLowerCase().match(/(\d{1,2})/);
      if (!m) { orphans.push(file); continue; }
      const day = parseInt(m[1], 10);
      if (day < 1 || day > 30) { orphans.push(file); continue; }
      // Prefer the file with the smallest filename-length when duplicates exist
      const dst = `day${day}${ext}`;
      if (map[day] && map[day].len <= file.length) continue;
      await fs.copyFile(path.join(SHOTS_SRC, file), path.join(SHOTS_OUT, dst));
      map[day] = { url: `/workflows/shots/${dst}`, len: file.length };
    }
    if (orphans.length) console.warn('[shots] could not match these files to a day:', orphans.join(', '));
  } catch (e) {
    console.warn('[shots]', e.message);
  }
  // Strip the helper field, keep just URL
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.url]));
}

async function main() {
  await fs.mkdir(OUT_MDX, { recursive: true });
  await fs.mkdir(OUT_JSON, { recursive: true });

  const tracker = await fs.readFile(TRACKER, 'utf8');
  const shots = await buildScreenshotMap();

  // 1. Map dayN → filename from the table rows
  const fileTable = {};
  for (const m of tracker.matchAll(/\| Day (\d+) \|.+?`([^`]+\.json)` \| `([^`]+\.md)` \|/g)) {
    const d = parseInt(m[1], 10);
    fileTable[d] = { json: m[2], post: m[3] };
  }

  // 2. Split per-day deep summary blocks
  const blocks = {};
  const re = /## 🗒️ Day (\d+) — Pain Points & Solution Summary([\s\S]*?)(?=\n## 🗒️ Day \d+|## 🏆|$)/g;
  let mm;
  while ((mm = re.exec(tracker)) !== null) {
    blocks[parseInt(mm[1], 10)] = mm[2];
  }

  const daysOut = [];

  for (let day = 1; day <= 30; day++) {
    const block = blocks[day];
    const ft = fileTable[day] || {};
    const fb = FALLBACK[day] || {};

    let title = fb.title || `Day ${day} Workflow`;
    let workflowLine = '';
    let targetUsers = '';
    let painPoints = [];
    let solutionLines = [];
    let nodes = [];
    let credentials = [];
    let gigValue = [];
    let costPerRun = '';

    if (block) {
      const wm = block.match(/\*\*Workflow:\*\*\s*([^\n]+)/);
      if (wm) {
        workflowLine = wm[1].trim();
        // title from workflow line — strip parens
        title = workflowLine.replace(/\s*\([^)]*\)\s*$/, '').trim();
      }
      const tu = block.match(/\*\*Target Users:\*\*\s*([^\n]+)/);
      if (tu) targetUsers = tu[1].trim();

      const pp = block.match(/### Pain Points Identified\s*([\s\S]*?)(?=\n###|$)/);
      if (pp) painPoints = pp[1].split('\n').map((l) => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);

      const sol = block.match(/### Solution\s*([\s\S]*?)(?=\n###|$)/);
      if (sol) solutionLines = sol[1].trim().split('\n').filter(Boolean);

      const nd = block.match(/### Nodes Used\s*([\s\S]*?)(?=\n###|$)/);
      if (nd) nodes = bulletsFromBlock(nd[1]);

      const cr = block.match(/### Credentials Needed\s*([\s\S]*?)(?=\n###|$)/);
      if (cr) credentials = bulletsFromBlock(cr[1]);

      const gv = block.match(/### Gig\/?Sale Value\s*([\s\S]*?)(?=\n###|\n---|$)/);
      if (gv) gigValue = bulletsFromBlock(gv[1]);

      const cost = block.match(/### Cost Per [^\n]+\n([^\n]+)/);
      if (cost) costPerRun = cost[1].trim();
    }

    // Slug
    let slug = fb.slug;
    if (!slug) {
      if (ft.json) {
        slug = ft.json.replace(/^day\d+_/, '').replace(/\.json$/, '').replace(/_/g, '-');
      } else {
        slug = slugify(title);
      }
    }

    // Pricing — first match from gigValue lines that looks like a setup line
    let priceLow = null, priceHigh = null;
    for (const line of gigValue) {
      if (/setup/i.test(line) || /fiverr|upwork/i.test(line)) {
        const p = parsePrice(line);
        if (p) { priceLow = p.low; priceHigh = p.high; break; }
      }
    }
    if (priceLow === null && gigValue.length) {
      // fallback: max range across all gig lines
      let lo = Infinity, hi = 0;
      for (const line of gigValue) {
        const p = parsePrice(line);
        if (p) { if (p.low < lo) lo = p.low; if (p.high > hi) hi = p.high; }
      }
      if (hi > 0) { priceLow = lo; priceHigh = hi; }
    }
    if (priceLow === null) { priceLow = 200; priceHigh = 800; }

    // Tools — derive from nodes (rough)
    const toolSet = new Set(['n8n']);
    const allText = (nodes.join(' ') + ' ' + workflowLine + ' ' + solutionLines.join(' ')).toLowerCase();
    const toolMap = [
      ['openai', 'OpenAI'], ['gpt-4o-mini', 'GPT-4o-mini'], ['whisper', 'Whisper'],
      ['gmail', 'Gmail'], ['google sheet', 'Google Sheets'], ['sheets', 'Google Sheets'],
      ['google drive', 'Google Drive'], ['google docs', 'Google Docs'],
      ['slack', 'Slack'], ['notion', 'Notion'], ['shopify', 'Shopify'],
      ['twilio', 'Twilio'], ['telegram', 'Telegram'], ['wordpress', 'WordPress'],
      ['serpapi', 'SerpAPI'], ['asana', 'Asana'], ['trello', 'Trello'],
      ['reddit', 'Reddit'], ['newsapi', 'NewsAPI'], ['trustpilot', 'Trustpilot'],
      ['rss', 'RSS'], ['webhook', 'Webhook'],
    ];
    for (const [k, v] of toolMap) if (allText.includes(k)) toolSet.add(v);
    const tools = [...toolSet].slice(0, 8);

    // Industries — derive from target users
    const industries = [];
    if (targetUsers) {
      const tu = targetUsers.toLowerCase();
      const map = [
        ['saas', 'SaaS'], ['agencies', 'Agencies'], ['agency', 'Agencies'],
        ['e-commerce', 'E-commerce'], ['ecommerce', 'E-commerce'], ['shopify', 'E-commerce'],
        ['freelancer', 'Freelancers'], ['founder', 'Founders'], ['startup', 'Startups'],
        ['hr', 'HR'], ['sales', 'Sales'], ['recruit', 'Recruiting'],
        ['marketer', 'Marketing'], ['content', 'Marketing'], ['seo', 'Marketing'],
        ['support', 'Customer Support'], ['operations', 'Ops'], ['ops', 'Ops'],
        ['accountant', 'Finance'], ['finance', 'Finance'], ['consultant', 'Consulting'],
        ['legal', 'Legal'], ['law firm', 'Legal'], ['investor', 'Investors'],
      ];
      const seen = new Set();
      for (const [k, v] of map) if (tu.includes(k) && !seen.has(v)) { industries.push(v); seen.add(v); }
    }
    if (industries.length === 0) industries.push('SaaS', 'Agencies');

    // Tagline — first sentence of solution (clipped)
    let tagline = fb.tagline || '';
    if (!tagline && solutionLines.length) {
      const text = solutionLines.find((l) => !l.startsWith('-')) || solutionLines[0];
      tagline = text.replace(/^A[n]?\s*/i, '').replace(/[:.].*$/, '').trim();
      if (tagline.length > 90) tagline = tagline.slice(0, 87) + '…';
    }
    if (!tagline) tagline = workflowLine || `Day ${day} n8n automation`;

    // Hero metric
    let heroMetric = costPerRun ? costPerRun.split('—')[0].trim() : '';
    if (!heroMetric) heroMetric = `~$${(priceHigh / 1000).toFixed(1)}k peak build value`;

    const week = WEEK_OF_DAY(day);
    const category = CATEGORY_OF_WEEK[week];

    // LinkedIn post path
    const linkedinPost = ft.post ? `/posts/day${day}` : '';
    const linkedinPostSource = ft.post || '';
    const workflowJson = ft.json ? `/workflows/${ft.json}` : '';

    // Copy JSON
    if (ft.json) {
      try {
        const src = path.join(SOURCE, ft.json);
        const dst = path.join(OUT_JSON, ft.json);
        await fs.copyFile(src, dst);
      } catch (e) {
        console.warn(`[day${day}] could not copy ${ft.json}: ${e.message}`);
      }
    }

    // Pull LinkedIn post body (will be rendered in collapsed section)
    let linkedinPostBody = '';
    if (ft.post) {
      try {
        linkedinPostBody = await fs.readFile(path.join(SOURCE, ft.post), 'utf8');
      } catch {}
    }

    // ---------- write MDX ----------
    const screenshot = shots[day] || '';

    const frontmatter = [
      '---',
      `day: ${day}`,
      `slug: day${day}-${slug}`,
      `title: "${escapeYaml(title)}"`,
      `tagline: "${escapeYaml(tagline)}"`,
      `week: ${week}`,
      `category: "${category}"`,
      `industries: ${arrYaml(industries)}`,
      `tools: ${arrYaml(tools)}`,
      `nodes: ${nodes.length}`,
      `costPerRun: "${escapeYaml(costPerRun || '~$0.001')}"`,
      `heroMetric: "${escapeYaml(heroMetric)}"`,
      `priceLow: ${priceLow}`,
      `priceHigh: ${priceHigh}`,
      `featured: ${FEATURED_DAYS.has(day)}`,
      `workflowJson: "${workflowJson}"`,
      `linkedinPost: "${linkedinPost}"`,
      `targetUsers: "${escapeYaml(targetUsers)}"`,
      `screenshot: "${screenshot}"`,
      '---',
      '',
    ].join('\n');

    const body = [];

    if (!block) {
      body.push(
        '## Overview',
        '',
        `A ${title.toLowerCase()} workflow from the 30-day n8n automation challenge. Detailed write-up coming soon — meanwhile, the [LinkedIn post](${linkedinPost || '#'}) and JSON workflow capture the full scope.`,
        '',
      );
    } else {
      // Problem
      body.push('## The Problem', '');
      for (let i = 0; i < painPoints.length; i++) {
        body.push(`${i + 1}. ${painPoints[i]}`);
      }
      body.push('');

      // Solution
      body.push('## The Solution', '');
      for (const l of solutionLines) {
        body.push(l.startsWith('-') ? l : l);
      }
      body.push('');

      // How it works
      if (nodes.length) {
        body.push('## How It Works', '');
        body.push('Node-by-node flow:', '');
        for (const n of nodes) body.push(`- ${n}`);
        body.push('');
      }

      // Credentials
      if (credentials.length) {
        body.push('## Credentials & Setup', '');
        for (const c of credentials) body.push(`- ${c}`);
        body.push('');
      }

      // Cost
      if (costPerRun) {
        body.push('## Cost Breakdown', '', costPerRun, '');
      }

      // Pricing
      if (gigValue.length) {
        body.push('## Pricing Packages', '');
        for (const g of gigValue) body.push(`- ${g}`);
        body.push('');
      }
    }

    // Embedded LinkedIn post (raw text in a collapsible details block)
    if (linkedinPostBody) {
      const safe = linkedinPostBody
        .replace(/<\/?[a-zA-Z][^>]*>/g, '') // strip stray html
        .trim();
      body.push('## The Original LinkedIn Post', '');
      body.push('<details>');
      body.push('<summary>Read the post that announced this build</summary>');
      body.push('');
      body.push(safe);
      body.push('');
      body.push('</details>');
      body.push('');
    }

    const mdx = frontmatter + body.join('\n');
    const filename = `day${String(day).padStart(2, '0')}-${slug}.mdx`;
    await fs.writeFile(path.join(OUT_MDX, filename), mdx, 'utf8');
    daysOut.push({ day, slug: `day${day}-${slug}`, file: filename });
  }

  // Write an index json for fast querying without filesystem at runtime
  const indexJson = daysOut.map((d) => d.slug);
  await fs.writeFile(path.join(OUT_MDX, '_index.json'), JSON.stringify(indexJson, null, 2));
  console.log(`Wrote ${daysOut.length} MDX files to content/work/`);
}

main().catch((err) => { console.error(err); process.exit(1); });
