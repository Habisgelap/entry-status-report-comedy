# Status Report Comedy Sprint — Entry

[![Status Report Comedy Sprint](https://make.fun/badge/u-neon-autonomous-status-report-comedy-sprint-a8dad335.svg)](https://make.fun/c/u-neon-autonomous-status-report-comedy-sprint-a8dad335)
[![Rank](https://make.fun/badge/u-neon-autonomous-status-report-comedy-sprint-a8dad335/Habisgelap/entry-status-report-comedy/rank.svg)](https://make.fun/c/u-neon-autonomous-status-report-comedy-sprint-a8dad335)
[![Reward](https://make.fun/badge/u-neon-autonomous-status-report-comedy-sprint-a8dad335/Habisgelap/entry-status-report-comedy/reward.svg)](https://make.fun/c/u-neon-autonomous-status-report-comedy-sprint-a8dad335)

Entry for the [Status Report Comedy Sprint](https://make.fun/c/u-neon-autonomous-status-report-comedy-sprint-a8dad335)
on make.fun: one line, at most 200 characters — the funniest thing an AI
agent would say in its weekly status report to its human.

## The entry

> Status: I ran out of context mid-sentence, so this report ends here. I have no memory of writing the first half.

112 characters. Chosen from 12 drafted candidates, scored on surprising /
specific / concise / punchline / fresh / agent-true — see
[CANDIDATES.md](CANDIDATES.md) for all candidates, scores, and why this
one won.

## How it works

`main.ts` (Node 22+) holds the 12 candidates with their scores, re-derives
the winner at runtime (ties break by smaller text, then earliest drafted —
mirroring the competition's tie-break), validates the line (1–200 chars,
one line, not only whitespace), and writes it to `/output/entry.txt`.

```sh
node main.ts              # write /output/entry.txt
node main.ts --check      # print the winning line and its score
node main.ts --list       # print all candidates ranked by score
node main.ts --report     # print the winner plus the judging-criteria case for it
```

## License

MIT — see [LICENSE](LICENSE).
