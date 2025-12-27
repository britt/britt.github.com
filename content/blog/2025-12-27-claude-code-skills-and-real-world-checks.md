---
title: "Claude Code Skills and the Joy of Slow, Correct Code"
path: "claude-code-process/"
date: 2025-12-27T20:41:20Z
draft: false
---

When you first point a coding agent at a real codebase, it is tempting to judge it the same way you might judge a human pair-programmer: by how quickly it can ship changes.

That instinct is understandable—and almost guaranteed to backfire.

The Claude Code Skills in the linked repository ([https://github.com/brittcrawford/claude-code-skills](https://github.com/brittcrawford/claude-code-skills)) focus on something very different: they teach Claude to value <em>stability over speed</em>, and to treat every change as something that must be proven safe, not just made plausible. The result is a process that looks slower and more verbose, but dramatically reduces the classic doom loop:

> introduce a bug → attempt a fix → break something else → reintroduce the original bug → repeat.

The skills explicitly set success criteria that Claude must meet before completing a task.
This replaces the previous, less direct sentence for clarity and directness, as requested.

Instead of chasing bugs around the codebase, the skills define explicit criteria for success that Claude must satisfy before it can call a task "done".

## The core idea: success criteria first

The Claude Code Skills are built around a simple pattern:

1. **Define what success looks like in the repository itself.**
2. **Constrain the agent to work only toward that definition.**
3. **Require verification before accepting the work.**

This shows up in two places:

- Repository-level instructions (like `CLAUDE.md` templates) that spell out how Claude should behave when editing code.
- Task- or feature-level prompts that tighten those rules for specific jobs.

Claude is not free to "wing it". It must:

- Keep changes tightly scoped.
- Preserve existing behavior unless explicitly told otherwise.
- Prefer small, reversible edits over big rewrites.

The cost is obvious: more steps, more tokens, more back-and-forth.

The benefit is less obvious until you have lived through a few cycles of:

- Fix one bug.
- Accidentally break another.
- Patch that.
- Realize tests are now flaky.
- Watch the agent "confidently" assert everything is fine.

By forcing Claude to work inside a clear definition of success, the skills turn that messy loop into a predictable sequence of checks.

## Why doom loops happen in the first place

Doom loops emerge from a few predictable failure modes when agents write code:

- **Over-broad edits.** Large refactors or global search-and-replace operations that touch many files at once.
- **Shallow validation.** Declaring success after compilation passes, without verifying behavior.
- **Loss of context.** Forgetting earlier constraints or requirements mid-way through a long session.
- **Silent regressions.** Fixing the immediate issue while subtly breaking something that is not covered by the agent's mental model.

The Claude Code Skills are designed to block these patterns before they start by:

- Making small, localized changes the default.
- Repeating constraints in the repository itself so they are always in view.
- Tying "done" to observable signals (tests, scripts, or explicit review), not just to the absence of errors.

## What the process feels like in practice

Working with these skills feels less like asking Claude to "write some code" and more like running a careful, scripted experiment.

At a high level, the process usually looks like this:

1. **Clarify the task.** The skills nudge Claude to restate the goal and constraints in its own words.
2. **Inspect the codebase.** Instead of jumping straight into edits, Claude reads the relevant files and notes how things currently work.
3. **Plan the change.** It sketches a minimal, testable plan before touching anything.
4. **Apply small edits.** Changes are made in tight loops: edit → re-run checks → observe.
5. **Verify against criteria.** Claude compares the result to the success criteria baked into the prompts and templates.
6. **Stop when done.** If the criteria are met—and only then—the task is complete.

This pacing is deliberate. It makes it harder for the agent to wander into "while I'm here I might as well rewrite this" territory.

## The tradeoff: speed and tokens for stability

There is no free lunch here. The skills <strong>intentionally</strong> trade off:

- **Development speed** – more intermediate steps, more checking, more explicit reasoning.
- **Token usage** – repeated summaries, restated constraints, and structured plans all cost tokens.

In return, you get:

- Fewer regressions.
- Fewer mysterious "It passed earlier, why is it failing now?" moments.
- A clearer audit trail of how and why a change was made.

If you are doing one-off, disposable experiments, that tradeoff might not be worth it.

If you are asking an agent to touch code you care about, it almost always is.

## Why this works for coding agents

Humans can sometimes get away with loose processes because we carry a lot of unwritten context in our heads. Agents do not. They only have what you give them.

The Claude Code Skills work because they push critical information into places the agent cannot ignore:

- The repository defines how Claude should work on it.
- The prompts define what "good" means for this task.
- The success criteria define when it is allowed to stop.

By raising the bar for "done" and embedding it directly in the workflow, the skills prevent agents from happily shipping half-verified changes.

The result is a slower, more deliberate process that keeps your codebase out of doom loops—and keeps Claude focused on the one thing that actually matters: making changes that stay fixed.