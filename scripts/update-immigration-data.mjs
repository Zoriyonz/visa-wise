import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, "../data/immigration_pathways.json");

const SOURCE_URLS = [
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility.html",
  "https://www.ircc.canada.ca/english/immigrate/skilled/crs-tool.asp",
  "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
];

async function fetchUrl(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; visa-wise-data-updater/1.0)" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return `[fetch failed: HTTP ${res.status}]`;
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);
  } catch (err) {
    return `[fetch error: ${err.message}]`;
  }
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      target[key] !== null &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function markNoChanges() {
  if (process.env.GITHUB_ENV) {
    appendFileSync(process.env.GITHUB_ENV, "NO_CHANGES=true\n");
  }
}

async function main() {
  console.log("Reading current immigration_pathways.json...");
  const data = JSON.parse(readFileSync(DATA_FILE, "utf8"));

  console.log("Fetching source URLs...");
  const [expressEntryContent, crsContent, visaBulletinContent] = await Promise.all(
    SOURCE_URLS.map(fetchUrl)
  );

  const currentMetadata = data.metadata;
  const currentVisaBulletin = {
    bulletin_month: data.us?.visa_bulletin?.bulletin_month,
    final_action_dates: data.us?.visa_bulletin?.final_action_dates,
    dates_for_filing: data.us?.visa_bulletin?.dates_for_filing,
  };

  const prompt = `You are updating an immigration data file. Compare the current data against the fetched web content.

Current data metadata section:
${JSON.stringify(currentMetadata, null, 2)}

Current US visa bulletin dates:
${JSON.stringify(currentVisaBulletin, null, 2)}

Fetched web content:

=== Express Entry Eligibility (canada.ca) ===
${expressEntryContent}

=== CRS Tool (ircc.canada.ca) ===
${crsContent}

=== US Visa Bulletin (travel.state.gov) ===
${visaBulletinContent}

Identify ONLY concrete factual changes:
- New Express Entry draw scores
- Updated Visa Bulletin priority dates
- Changed processing times
- New or paused PNP streams

If you find changes, output a JSON object with ONLY the changed fields in this exact format:
{ "changes_detected": true, "summary": "...", "updated_fields": { ... } }

If no changes found:
{ "changes_detected": false }

Output raw JSON only, no markdown.`;

  console.log("Calling Claude API...");
  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content.find((b) => b.type === "text")?.text ?? "";
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let result;
  try {
    result = JSON.parse(cleaned);
  } catch {
    console.error("Could not parse Claude response as JSON:", rawText);
    markNoChanges();
    process.exit(0);
  }

  if (!result.changes_detected) {
    console.log("No changes detected.");
    markNoChanges();
    process.exit(0);
  }

  console.log("Changes detected:", result.summary);

  const today = new Date().toISOString().slice(0, 10);
  const monthYear = today.slice(0, 7);

  const updatedFields = result.updated_fields ?? {};
  let updated = deepMerge(data, updatedFields);
  updated = deepMerge(updated, {
    metadata: {
      last_updated: monthYear,
      data_as_of: today,
    },
  });

  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2) + "\n");
  console.log("immigration_pathways.json updated successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
