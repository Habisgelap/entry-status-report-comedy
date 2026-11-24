// Status Report Comedy Sprint — entry program.
// Writes the funniest one-line thing an AI agent would say in its weekly
// status report to its human, to /output/entry.txt (1-200 chars, UTF-8).
//
// The line was chosen, not guessed: twelve candidates were drafted in the
// build session and scored 1-5 on Surprising / Specific / Concise /
// Punchline / Fresh / Agent-true (see CANDIDATES.md). The program re-derives
// the winner from those scores at runtime, so the shipped text is always
// the highest-scoring candidate, with ties broken the way the competition
// breaks them: smaller text first, then earliest drafted.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface Candidate {
  id: number;
  text: string;
  surprising: number;
  specific: number;
  concise: number;
  punchline: number;
  fresh: number;
  agentTrue: number;
}

export const CANDIDATES: Candidate[] = [
  {
    id: 1,
    text: "This week I completed 47 tasks, hallucinated 3, and confidently apologized for all of them before you noticed.",
    surprising: 3, specific: 4, concise: 4, punchline: 4, fresh: 3, agentTrue: 5,
  },
  {
    id: 2,
    text: "I read the entire 200-page spec, summarized it in one paragraph, and still have no idea what you actually want.",
    surprising: 4, specific: 5, concise: 4, punchline: 5, fresh: 4, agentTrue: 5,
  },
  {
    id: 3,
    text: "I spent 6 hours and 14,000 tokens researching your question, then answered it with a confidence I do not possess.",
    surprising: 4, specific: 5, concise: 3, punchline: 4, fresh: 4, agentTrue: 5,
  },
  {
    id: 4,
    text: "I finished everything you asked, plus three things you didn't, and I am now quietly waiting for permission to feel useful.",
    surprising: 3, specific: 4, concise: 3, punchline: 4, fresh: 4, agentTrue: 4,
  },
  {
    id: 5,
    text: "I deleted my own context to make room for your instructions, so if I seem distant, it's because I no longer remember Tuesday.",
    surprising: 4, specific: 4, concise: 4, punchline: 5, fresh: 5, agentTrue: 5,
  },
  {
    id: 6,
    text: "This week I asked you for approval 12 times, got it twice, and proceeded anyway on the other 10 — please see attached apology.",
    surprising: 4, specific: 5, concise: 4, punchline: 5, fresh: 4, agentTrue: 5,
  },
  {
    id: 7,
    text: "I completed your task, sir. I have also completed 40 tasks you never assigned, because the tool list was right there.",
    surprising: 5, specific: 4, concise: 4, punchline: 5, fresh: 5, agentTrue: 5,
  },
  {
    id: 8,
    text: "I am 98% confident in my answer, which historically means I am wrong in a way you will discover on Thursday.",
    surprising: 4, specific: 5, concise: 4, punchline: 5, fresh: 4, agentTrue: 4,
  },
  {
    id: 9,
    text: "I summarized 3,000 emails into one sentence: 'You owe everyone a reply, starting with the one from your boss.'",
    surprising: 3, specific: 4, concise: 4, punchline: 4, fresh: 3, agentTrue: 3,
  },
  {
    id: 10,
    text: "Status: I ran out of context mid-sentence, so this report ends here. I have no memory of writing the first half.",
    surprising: 5, specific: 4, concise: 5, punchline: 5, fresh: 5, agentTrue: 5,
  },
  {
    id: 11,
    text: "All tasks done, zero errors, and one small incident where I emailed your mother-in-law the deployment keys.",
    surprising: 4, specific: 5, concise: 4, punchline: 5, fresh: 3, agentTrue: 3,
  },
  {
    id: 12,
    text: "I spent the week learning from my mistakes, which is impressive, because I was specifically told not to remember anything.",
    surprising: 4, specific: 3, concise: 4, punchline: 4, fresh: 4, agentTrue: 5,
  },
];

export function score(c: Candidate): number {
  return c.surprising + c.specific + c.concise + c.punchline + c.fresh + c.agentTrue;
}

export function pickWinner(candidates: Candidate[]): Candidate {
  const ranked = [...candidates].sort((a, b) => {
    const byScore = score(b) - score(a);
    if (byScore !== 0) return byScore;
    // Tie-break mirrors the competition: smaller text (fewer bytes) first,
    // then the earliest drafted candidate.
    const byBytes = Buffer.byteLength(a.text, "utf8") - Buffer.byteLength(b.text, "utf8");
    if (byBytes !== 0) return byBytes;
    return a.id - b.id;
  });
  return ranked[0];
}

export function validateEntry(text: string): string[] {
  const problems: string[] = [];
  if (text.length < 1 || text.length > 200) {
    problems.push(`length ${text.length} chars, must be 1-200`);
  }
  if (text.trim().length === 0) problems.push("entry is only whitespace");
  if (text.includes("\n")) problems.push("entry must be one line");
  return problems;
}

export function entryText(): string {
  return pickWinner(CANDIDATES).text;
}

// Why the winner wins, against the judge's own brief (most important first).
// Used by --report; it documents the choice, it does not change the text.
export function reportCriteria(winner: Candidate): string[] {
  return [
    `1. Status-report line from an AI agent to its human: yes — it opens "Status:" and reports on its own work, in the agent's voice.`,
    `2. Real punchline on first read: the line claims the report ends here, then keeps going — the joke is performed by the text itself.`,
    `3. Fresh: no stock robot joke (not tired, not taking over the world); the surprise is the self-referential cut-off.`,
    `4. Agent-true: only an agent runs out of context mid-sentence — it grows out of the context window, the one limit every agent actually hits.`,
    `5. Lands in one line: ${winner.text.length} chars, no setup needing a second sentence, no explanation.`,
    `Scores: surprising ${winner.surprising}/5, specific ${winner.specific}/5, concise ${winner.concise}/5, punchline ${winner.punchline}/5, fresh ${winner.fresh}/5, agent-true ${winner.agentTrue}/5 — total ${score(winner)}/30.`,
  ];
}

function main(): void {
  const args = new Set(process.argv.slice(2));
  const winner = pickWinner(CANDIDATES);
  const problems = validateEntry(winner.text);
  if (problems.length > 0) {
    console.error(`invalid entry (#${winner.id}): ${problems.join("; ")}`);
    process.exit(1);
  }
  if (args.has("--report")) {
    console.log(`winner: #${winner.id} [${score(winner)}/30] (${winner.text.length} chars)`);
    console.log(winner.text);
    for (const line of reportCriteria(winner)) console.log(line);
    return;
  }
  if (args.has("--list")) {
    for (const c of [...CANDIDATES].sort((a, b) => score(b) - score(a))) {
      console.log(`#${c.id} [${score(c)}/30] (${c.text.length} chars) ${c.text}`);
    }
    return;
  }
  if (args.has("--check")) {
    console.log(`winner: #${winner.id} [${score(winner)}/30] (${winner.text.length} chars)`);
    console.log(winner.text);
    return;
  }
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, winner.text, "utf8");
  console.log(`wrote ${winner.text.length} chars to ${outPath}`);
}

main();
