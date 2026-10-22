// Runs the same AI tasks on each model and writes a side-by-side report.
//   npm test                          -> all models, all tasks
//   npm test -- --models claude-haiku-5-5
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import {
  INTERVIEWER_SYSTEM,
  FEEDBACK_SYSTEM,
  RETELL_SYSTEM,
  POSTING_SYSTEM,
  feedbackSchema,
  retellSchema,
  postingSchema,
} from "./prompts.ts";
import { interviews, story, retells, postings } from "./scenarios.ts";

// USD per million tokens (input, output, cache read, cache write 5m).
const PRICES: Record<string, { input: number; output: number; cacheRead: number; cacheWrite: number }> = {
  "claude-opus-5-5": { input: 4.0, output: 20.0, cacheRead: 0.2, cacheWrite: 5.0 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
};

const args = process.argv.slice(2);
const modelsArg = args.indexOf("--models");
const MODELS = modelsArg >= 0 ? args[modelsArg + 1].split(",") : Object.keys(PRICES);

const client = new Anthropic();

interface CallStats {
  ms: number;
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  cacheReadTokens: number;
  servedBy: string;
}

interface CallResult {
  text: string;
  stats: CallStats;
}

function cost(model: string, usage: Anthropic.Beta.BetaUsage): number {
  const p = PRICES[model];
  if (!p) return 0;
  return (
    (usage.input_tokens * p.input +
      usage.output_tokens * p.output +
      (usage.cache_read_input_tokens ?? 0) * p.cacheRead +
      (usage.cache_creation_input_tokens ?? 0) * p.cacheWrite) /
    1_000_000
  );
}

async function call(
  model: string,
  system: string,
  messages: Anthropic.Beta.BetaMessageParam[],
  effort: "low" | "medium",
  schema?: Record<string, unknown>,
): Promise<CallResult> {
  const start = performance.now();
  const response = await client.beta.messages.create({
    model,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
    output_config: schema ? { effort, format: { type: "json_schema", schema } } : { effort },
  });
  const ms = performance.now() - start;

  if (response.stop_reason === "refusal") {
    throw new Error(`Refused (${response.stop_details?.category ?? "no category"})`);
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("Hit max_tokens");
  }
  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return {
    text,
    stats: {
      ms,
      // Bill at the model that actually served the request.
      costUsd: cost(response.model, response.usage),
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      thinkingTokens: response.usage.output_tokens_details?.thinking_tokens ?? 0,
      cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
      servedBy: response.model,
    },
  };
}

function errorText(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return "Invalid or missing API key (set ANTHROPIC_API_KEY)";
  if (err instanceof Anthropic.RateLimitError) return "Rate limited - try again later";
  if (err instanceof Anthropic.APIError) return `API error ${err.status}: ${err.message}`;
  return err instanceof Error ? err.message : String(err);
}

function sum(stats: CallStats[]): CallStats {
  return stats.reduce(
    (a, s) => ({
      ms: a.ms + s.ms,
      costUsd: a.costUsd + s.costUsd,
      inputTokens: a.inputTokens + s.inputTokens,
      outputTokens: a.outputTokens + s.outputTokens,
      thinkingTokens: a.thinkingTokens + s.thinkingTokens,
      cacheReadTokens: a.cacheReadTokens + s.cacheReadTokens,
      servedBy: a.servedBy || s.servedBy,
    }),
    { ms: 0, costUsd: 0, inputTokens: 0, outputTokens: 0, thinkingTokens: 0, cacheReadTokens: 0, servedBy: "" },
  );
}

interface InterviewRun {
  transcript: { speaker: "Interviewer" | "Learner"; text: string; ms?: number }[];
  turnStats: CallStats[];
  feedback?: unknown;
  feedbackStats?: CallStats;
  error?: string;
}

async function runInterview(model: string, scenario: (typeof interviews)[number]): Promise<InterviewRun> {
  const run: InterviewRun = { transcript: [], turnStats: [] };
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    {
      role: "user",
      content: `[App] Job: ${scenario.job}\nQuestions:\n${scenario.questions
        .map((q, i) => `${i + 1}. ${q}`)
        .join("\n")}\n\nGreet the learner in one short sentence and ask question 1.`,
    },
  ];
  try {
    for (let i = 0; i <= scenario.learnerAnswers.length; i++) {
      const turn = await call(model, INTERVIEWER_SYSTEM, messages, "low");
      run.turnStats.push(turn.stats);
      run.transcript.push({ speaker: "Interviewer", text: turn.text, ms: turn.stats.ms });
      messages.push({ role: "assistant", content: turn.text });
      if (turn.text.includes("[END]") || i === scenario.learnerAnswers.length) break;
      const answer = scenario.learnerAnswers[i];
      run.transcript.push({ speaker: "Learner", text: answer });
      messages.push({ role: "user", content: answer });
    }

    const transcriptText = run.transcript.map((t) => `${t.speaker}: ${t.text}`).join("\n");
    const fb = await call(
      model,
      FEEDBACK_SYSTEM,
      [{ role: "user", content: `Job: ${scenario.job}\n\nTranscript:\n${transcriptText}` }],
      "medium",
      feedbackSchema,
    );
    run.feedback = JSON.parse(fb.text);
    run.feedbackStats = fb.stats;
  } catch (err) {
    run.error = errorText(err);
  }
  return run;
}

interface JsonRun {
  output?: unknown;
  stats?: CallStats;
  error?: string;
}

async function runJson(model: string, system: string, content: string, schema: Record<string, unknown>): Promise<JsonRun> {
  try {
    const r = await call(model, system, [{ role: "user", content }], "medium", schema);
    return { output: JSON.parse(r.text), stats: r.stats };
  } catch (err) {
    return { error: errorText(err) };
  }
}

const results: Record<string, {
  interviews: Record<string, InterviewRun>;
  retells: Record<string, JsonRun>;
  postings: Record<string, JsonRun>;
}> = {};

for (const model of MODELS) {
  console.log(`\n=== ${model} ===`);
  results[model] = { interviews: {}, retells: {}, postings: {} };

  for (const s of interviews) {
    process.stdout.write(`interview ${s.id} ... `);
    const r = await runInterview(model, s);
    results[model].interviews[s.id] = r;
    console.log(r.error ? `ERROR: ${r.error}` : "ok");
  }
  for (const r of retells) {
    process.stdout.write(`retell ${r.id} ... `);
    const out = await runJson(model, RETELL_SYSTEM, `Story the learner heard:\n${story}\n\nWhat the learner wrote:\n${r.text}`, retellSchema);
    results[model].retells[r.id] = out;
    console.log(out.error ? `ERROR: ${out.error}` : "ok");
  }
  for (const p of postings) {
    process.stdout.write(`posting ${p.id} ... `);
    const out = await runJson(model, POSTING_SYSTEM, `Job posting:\n${p.text}`, postingSchema);
    results[model].postings[p.id] = out;
    console.log(out.error ? `ERROR: ${out.error}` : "ok");
  }
}

// ---------- Summary ----------

interface Summary {
  interviewSessionUsd: number;
  avgTurnMs: number;
  feedbackMs: number;
  retellUsd: number;
  postingUsd: number;
  errors: number;
}

function avg(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

const summaries: Record<string, Summary> = {};
for (const model of MODELS) {
  const r = results[model];
  const ivs = Object.values(r.interviews).filter((x) => !x.error);
  const allTurns = ivs.flatMap((x) => x.turnStats);
  const ok = <T extends { error?: string; stats?: CallStats }>(xs: T[]) => xs.filter((x) => !x.error && x.stats).map((x) => x.stats!);
  summaries[model] = {
    interviewSessionUsd: avg(ivs.map((x) => sum([...x.turnStats, ...(x.feedbackStats ? [x.feedbackStats] : [])]).costUsd)),
    avgTurnMs: avg(allTurns.map((s) => s.ms)),
    feedbackMs: avg(ivs.flatMap((x) => (x.feedbackStats ? [x.feedbackStats.ms] : []))),
    retellUsd: avg(ok(Object.values(r.retells)).map((s) => s.costUsd)),
    postingUsd: avg(ok(Object.values(r.postings)).map((s) => s.costUsd)),
    errors:
      Object.values(r.interviews).filter((x) => x.error).length +
      Object.values(r.retells).filter((x) => x.error).length +
      Object.values(r.postings).filter((x) => x.error).length,
  };
}

console.log("\n=== Summary ===");
console.table(
  Object.fromEntries(
    Object.entries(summaries).map(([m, s]) => [
      m,
      {
        "$ / interview": s.interviewSessionUsd.toFixed(4),
        "sec / reply": (s.avgTurnMs / 1000).toFixed(1),
        "sec / feedback": (s.feedbackMs / 1000).toFixed(1),
        "$ / retell": s.retellUsd.toFixed(4),
        "$ / posting": s.postingUsd.toFixed(4),
        errors: s.errors,
      },
    ]),
  ),
);

// ---------- Report ----------

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const json = (v: unknown) => `<pre>${esc(JSON.stringify(v, null, 2))}</pre>`;
const scoreBox = `<p class="score">Your rating (1-5): ____ &nbsp; Notes: ______________________</p>`;

function columns(render: (model: string) => string): string {
  return `<div class="cols">${MODELS.map((m) => `<section><h4>${esc(m)}</h4>${render(m)}${scoreBox}</section>`).join("")}</div>`;
}

const summaryRows = MODELS.map((m) => {
  const s = summaries[m];
  return `<tr><td>${esc(m)}</td><td>$${s.interviewSessionUsd.toFixed(4)}</td><td>${(s.avgTurnMs / 1000).toFixed(1)} s</td><td>${(s.feedbackMs / 1000).toFixed(1)} s</td><td>$${s.retellUsd.toFixed(4)}</td><td>$${s.postingUsd.toFixed(4)}</td><td>${s.errors}</td></tr>`;
}).join("");

let body = `<h1>AI model test</h1>
<p>${new Date().toISOString().slice(0, 10)} · Rate each answer without looking at the price first. Speech-to-text and voice costs are not included.</p>
<table><tr><th>Model</th><th>$ / interview (6 questions + feedback)</th><th>Wait per reply</th><th>Wait for feedback</th><th>$ / retell</th><th>$ / job posting</th><th>Errors</th></tr>${summaryRows}</table>`;

body += `<h2>1. Practice interviews</h2>`;
for (const s of interviews) {
  body += `<h3>${esc(s.job)}</h3>`;
  body += columns((m) => {
    const r = results[m].interviews[s.id];
    if (r.error) return `<p class="err">${esc(r.error)}</p>`;
    const lines = r.transcript
      .map((t) => `<p class="${t.speaker === "Learner" ? "learner" : "ai"}"><b>${t.speaker}:</b> ${esc(t.text)}${t.ms ? ` <span class="ms">${(t.ms / 1000).toFixed(1)}s</span>` : ""}</p>`)
      .join("");
    return `${lines}<h5>Feedback</h5>${json(r.feedback)}`;
  });
}

body += `<h2>2. Listen and retell</h2><p><b>Story:</b> ${esc(story)}</p>`;
for (const r of retells) {
  body += `<h3>Learner wrote (${r.id}): “${esc(r.text)}”</h3>`;
  body += columns((m) => {
    const x = results[m].retells[r.id];
    return x.error ? `<p class="err">${esc(x.error)}</p>` : json(x.output);
  });
}

body += `<h2>3. Practice for this job (posting reader + scam check)</h2>`;
for (const p of postings) {
  body += `<h3>Posting: ${p.id}</h3><pre>${esc(p.text)}</pre>`;
  body += columns((m) => {
    const x = results[m].postings[p.id];
    return x.error ? `<p class="err">${esc(x.error)}</p>` : json(x.output);
  });
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI Model Test</title>
<style>
body{font-family:system-ui,sans-serif;margin:0 auto;max-width:1200px;padding:16px;color:#1b1f2a;background:#fff}
table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #ddd;padding:6px 8px;text-align:left}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
section{border:1px solid #ddd;border-radius:10px;padding:12px;min-width:0}
pre{white-space:pre-wrap;background:#f6f6f3;padding:8px;border-radius:6px;font-size:13px}
.learner{color:#9a3412}.ai{color:#0f6b7a}.ms{color:#888;font-size:12px}.err{color:#b91c1c;font-weight:600}
.score{border-top:1px dashed #ccc;padding-top:8px;color:#555}
</style></head><body>${body}</body></html>`;

fs.mkdirSync("results", { recursive: true });
fs.writeFileSync("results/results.json", JSON.stringify({ models: MODELS, summaries, results }, null, 2));
fs.writeFileSync("results/report.html", html);
console.log("\nWrote results/report.html and results/results.json");
