# Format review

Before anyone benchmarks a skill, check that the format works for you.
This folder holds those reviews. It holds no skill records.

## Who writes here

One file per reviewer per date: `format-review/<handle>-<YYYY-MM-DD>.md`.
The owner merges. Nobody edits another reviewer's file.

## What to judge

Answer each point with evidence from your own run. Not with opinion.

| # | Question | Evidence you bring |
|---|---|---|
| 1 | Can you find the method, the record template and the checks in 10 minutes? | The files you opened, in order. |
| 2 | Does the loop work without help? | The commands you ran, and where you got stuck. |
| 3 | Can you fill one record in one sitting? | The field that confused you, or took longest. |
| 4 | Are the scales unambiguous? | Two records where you would have picked a different band. |
| 5 | Do the checks fail for the right reasons? | One error you forced, and what the message told you. |
| 6 | Does the two-reviewer rule hold? | A test pull request that touches the other person's folder. Did CI reject it? |
| 7 | Does the board show what you need? | The thing you looked for and did not find. |
| 8 | Is the daily log cheap to fill? | The minutes it took, and the field you skipped. |
| 9 | What breaks because your setup differs? | The command that failed, with the setup line. |
| 10 | What would you add, remove or rename? | The list. Keep it short. |

State plainly what works. A review that only lists faults is not useful.

## Dry run, without touching the real catalog

The `examples/` folder is a complete small instance. Copy it and work there.

```sh
git clone git@github.com:strdr4605/skills-benchmark.git
cd skills-benchmark

cp -R examples /tmp/sb-dryrun

python3 scripts/sb.py --data /tmp/sb-dryrun pick --by friend
python3 scripts/sb.py --data /tmp/sb-dryrun day --by friend <skill-id>
```

`day` writes the log and the record stubs. Fill the log row first: depth, then
minutes. Then fill the record. A record with no pass in the log fails the check.

```sh
python3 scripts/sb.py --data /tmp/sb-dryrun check
python3 scripts/sb.py --data /tmp/sb-dryrun build --site /tmp/sb-dryrun/site/data.json
python3 -m http.server -d /tmp/sb-dryrun/site 8000
# open http://localhost:8000
```

Nothing in `catalog/`, `reviews/` or `log/` changes during a dry run.
Delete `/tmp/sb-dryrun` when you are done.

## Skeleton

```markdown
# Format review — <handle> — <YYYY-MM-DD>

Setup used: <agents, version control, platforms>

## What works

- ...

## What does not work

- ...

## Changes I would make

1. <file> — <what and why>

## Evidence

- <command> → <result>
```
