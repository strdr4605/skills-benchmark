# Skill inventory

Checked: 2026-11-15. Source: GitHub recursive tree API, HEAD of each repository.

**Selected source files: 1647. Distinct Git blob contents: 1641.**

These are candidate files, not a verified count of portable or independently useful skills. Identical blob hashes identify exact byte duplicates only. They do not identify equivalent workflows. Different names can do the same job. The same name can have different behavior.

The selection removes translations, obvious platform mirrors, templates, test fixtures, and repository-only maintenance skills where identified. It retains different packaged platform implementations in Oh My OpenAgent. No skill bodies were executed. No skills were installed. Only four source documents were fetched for dependency spot checks; this is not a complete compatibility or license audit.

| Project | Scoped raw files | Selected source files | Notes |
|---|---:|---:|---|
| [mattpocock/skills](https://github.com/mattpocock/skills/tree/5863806dd4e15c63174bee4e7515a4256792ecfa) | 39 | 39 | Includes 8 in-progress skills. |
| [obra/superpowers](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7) | 15 | 15 | Source skill files. |
| [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code/tree/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b) | 1068 | 314 | Source skill files. |
| [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills/tree/2c606141936f1eeef17fa3043a72095b4765b9c2) | 1 | 1 | Source skill files. |
| [anthropics/skills](https://github.com/anthropics/skills/tree/1780c5e5a552fd4d1c9d6a7b0cab26b0c2bef064) | 20 | 19 | Source skill files. |
| [github/spec-kit](https://github.com/github/spec-kit/tree/2ee2b1e8005905db05f5717300a469b3068b908f) | 2 | 0 | Two repository-maintenance skills excluded. Product workflows use templates and CLI generation. |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/1f50119f717e935f135d605ce537223d1d7a0dac) | 13 | 7 | Seven source skills; six CLI asset copies excluded. |
| [garrytan/gstack](https://github.com/garrytan/gstack/tree/0326b144af36676d599dcf63a9fad9a870d22ed6) | 71 | 69 | Excludes two test fixtures; includes platform wrappers and optional integrations. |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman/tree/b4ee71d557d96e3cbc14f88fa6e953a1362865f5) | 28 | 22 | Uses 22 top-level source skills; excludes plugin mirrors. |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/39b723ceebf81474d0557c1fecd01eddab585563) | 25 | 25 | Source skill files. |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill/tree/f6b76575f949707b4e3c37cd86cb44b0b98643e8) | 1 | 1 | Source skill files. |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2) | 864 | 863 | Excludes template-skill; includes 832 service automation skills. |
| [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec/tree/ea635dd255f8686dcf48626bbcbe0e3fd59b6067) | 31 | 12 | Uses 12 product skills; excludes four maintainer skills and 15 fixtures. |
| [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent/tree/98c9ed3b4171920f29126c3b91c26b61f5db9cb8) | 61 | 45 | 45 packaged implementations; 37 directory names. Platform implementations retained. Maintainer skills excluded. |
| [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done/tree/bdcaab2c752d9a33a1a1ca9acf3a3c81fb991815) | 0 | 0 | No checked-in SKILL.md. Has 67 commands/gsd/*.md files; installation can generate skills. Zero does not mean no capability. |
| [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD/tree/e435a22574fe55722841086e5566420178b98df3) | 36 | 32 | Excludes three fixtures and one sample skill. |
| [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode/tree/dec7e4188c0e3de6b92fb3d734ee5c95326021ed) | 84 | 84 | Source skill files. |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62) | 9 | 9 | Source skill files. |
| [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex/tree/08d569cd6b0b4031e2ce978af14a7f9ccd4e00bc) | 53 | 29 | Uses 29 top-level skills; excludes 24 plugin copies. |
| [cursor/plugins](https://github.com/cursor/plugins/tree/bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7) | 61 | 61 | 58 main skills plus three Benny automation skills. Excludes 58 Claude Code mirrors and other Cursor plugins. |

## What we can adopt

Use this inventory as a library. Select skills for a task. Do not enable all workflow routers together.

- Start with 10 to 20 selected skills. This is a proposed working set, not a measured compatible subset.
- First review Matt Pocock engineering skills, Addy Osmani design and debugging skills, Karpathy guidelines, Vercel frontend skills, and selected pstack principles.
- Existing session skills include grilling, prototype, and unslop. Inspect their installed versions before adding overlapping copies. The system also supplies skill-creator.
- Preserve the complete skill directory, referenced scripts and assets, source attribution, and applicable license. Copying SKILL.md alone can break dependencies.
- Review every selected license before copying. No blanket redistribution permission was established by this inventory.
- Install orchestration frameworks through their supported installer or plugin. Their hooks, tools, state, and model configuration can be required. Select one orchestration owner for a given setup.
- Review tool names and paths for the target agent. For example, pstack poteto-mode references sibling skills and poteto-agent. Oh My OpenAgent programming requires language references. gstack review declares harness tool names.
- Adapt any Git-specific instructions for repositories that use jj. Preserve the existing requirement to wait for approval before commits and pushes.
- Most Composio entries are service automations. Count those separately from engineering workflows. Check each service integration before use.

## Reproducibility

Each project link above is pinned to the inspected commit. The JSON inventory records selected paths and blob hashes. Total excludes generated skills and non-SKILL.md commands, agents, hooks, rules, and templates. Counts change with upstream revisions.
