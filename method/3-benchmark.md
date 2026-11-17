# Stage 3 — Benchmark

Goal: one fixed record per skill and reviewer, with a verdict.
Output: `reviews/<handle>/<skill-id>.md`, plus one row per pass in the daily log.

The field definitions and the scales are in [`templates/README.md`](../templates/README.md).
This page gives the rules of the work.

## What enters stage 3

Only `keep` rows with a stage and a category.
`python3 scripts/sb.py pick --by <handle>` lists them in this order:

1. Your postponed skills whose `next` date has come (`due:<date>`), and your skills postponed on a blocker (`blocked`).
2. Skills where the other reviewer said `adopt` or `adapt` and you have no verdict. (`2nd-opinion`)
3. Skills nobody has reviewed, priority 1 first.
4. Skills the other reviewer already rejected or merged.

## Depth and time boxes

Each pass has one depth. The time box is a hard stop.
When the box ends, write what you have and set the verdict or leave it empty.

| Depth | Box | Evidence it adds |
|---|---|---|
| `skim` | 10 min | Front matter and body skim. |
| `desk` | 30 min | Full directory, scripts, license, token measure, cluster compare. |
| `trial` | 60 min | One real task in `work_repo` or `personal_repo` (see `catalog/project.csv`). |
| `postponed` | 5 min | Nothing. The log row says why and until when. |

A skill can get many passes on many days.
A typical path is `skim` → `desk` → `trial`.
Most skills stop at `skim` with `reject` or at `desk` with `merge`.
Only a skill that may reach the shortlist needs a trial.

## Evidence

The `evidence` list says what the verdict rests on.

| Value | Meaning |
|---|---|
| `desk` | Reading the source. Always present. |
| `work` | A trial in the work project. |
| `personal` | A trial in the personal project. |

Hands-on trials are optional.
The board and the tables show the depth, so a reader sees how strong each verdict is.

## Hands-on trial protocol

1. Install the skill in a scratch location. Never in the shared `~/.agents/skills` before the verdict.
   Example: `cp -r <skill dir> ~/.claude/skills/` in a throwaway profile, or a project-local `.claude/skills/`.
2. Pick one real task from the target repo. Write it down first, in one line.
3. Run the agent on that task with the skill. Note the minutes and the tokens the agent reports.
4. Remove the skill.
5. Write `### <date> trial <work|personal>` under `## Comments after testing`: task, result, what broke, what surprised.

Do not commit or push to the target repo as part of the trial unless the task needs it.
Use jj there too. Keep the approval rule: no commit or push without your own "go".

## Verdict rules

| Verdict | Use it when | Needs |
|---|---|---|
| `adopt` | It works as is and no installed skill does the job. | desk or deeper, `license`, a use case, empty `overlaps` |
| `adapt` | It works after edits you can list. | desk or deeper, `license`, a use case, `## Changes` |
| `merge` | It has good parts, but another skill should carry them. | `merge_into` |
| `reject` | We do not want it. | `reject_reason` |

`python3 scripts/sb.py check` enforces the "Needs" column.

### The baseline rule

A skill that overlaps an installed skill (`catalog/installed.csv`) cannot be `adopt`.
It is `merge` if it has a part that the installed skill lacks.
It is `reject` (`overlap`) if it has nothing new.
Put the installed names in `overlaps`. The check does the rest.

Watch for these overlaps in our setup:

- Orchestration routers (omc, omx, omo, gstack, BMAD) against `herdr`, `herdr-core`.
- Terse output (`caveman.*`) against the ponytail family and RTK.
- Browser skills against `surf`.
- Interview skills against `grilling`.
- Git instructions in any skill: jj is our VCS. That is an `adapt` edit at least.

## Team verdict and the shortlist

The script computes the team verdict. See [templates/README.md](../templates/README.md#team-verdict).

The shortlist is `tables/shortlist.md`: every skill whose team verdict is `adopt` or `adapt`.
The queue asks the other reviewer for a second opinion on each of them.
A second opinion is not required. A split is visible in `tables/splits.md` until someone resolves it.

## When to stop

Stop benchmarking a cluster when one contender reaches `adopt` or `adapt` and the other contenders are `merge` or `reject`.
Stop the project phase when every priority 1 skill has a team verdict.
