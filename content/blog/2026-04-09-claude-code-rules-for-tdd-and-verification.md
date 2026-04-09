---
title: Claude Code rules for TDD and verification
path: /blog/claude-code-rules-for-tdd-and-verification/
date: 2026-04-09
draft: false
---

The most useful rules for a coding agent are the ones that force it to slow down and prove things. Without them, it can wander, guess, and bring old bugs back while sounding confident the whole time.

The rules that matter most to me come from the Claude Code Skills repository. They make two demands clear. First, TDD is mandatory. Second, the work is not done until a real world verification scenario passes against a real system.

Those rules cost time and tokens. They also make the result much more trustworthy. If the goal is reliable software, that trade is worth making.

## Why rules matter

Coding agents are fast at producing plausible answers. That is not the same thing as producing correct software.

If the rules are loose, the agent tends to skip straight to code, fill gaps with guesses, and declare success as soon as the local change looks reasonable. That loop feels productive, but it creates fragile results. A strict rule set changes the loop. It tells Claude what counts as proof, what order to work in, and what must happen before a task can count as complete.

That matters most when fixing bugs or changing behavior that already worked once. A loose loop can reintroduce the same problem a week later. A disciplined loop makes the agent show the failure first, fix only that failure, and then prove the change in a situation that looks like real use.

## TDD first, not later

The TDD rules are blunt on purpose. Claude does not get to write production code before it writes a failing test. It has to run that test and confirm the test fails for the right reason. Only then does it move to the smallest code change that can make the test pass.

That sequence matters because it prevents fake progress. A passing test written after the code proves very little. A failing test written first proves that the problem was real and that the fix changed something specific.

The same rules also set a high bar for completion. The task is not done when one test passes. The task is done when tests pass, the build passes, lint passes, coverage stays high, and the required progress reporting is complete. That turns TDD from a slogan into an operating rule.

In practice, this means Claude has to work in smaller moves. If a parser breaks on empty input, the first step is not a rewrite. The first step is a test that shows the empty input still breaks. After that, Claude makes the smallest change that handles the case and runs the full checks again.

## Verification means real world proof

The verification plan rule closes the loophole that TDD leaves open. Tests can still pass in a narrow sandbox while the real task fails in practice.

That is why the skills repo requires a `VERIFICATION_PLAN.md`. It should describe real world scenarios, use real systems, and avoid mocks, fakes, and made up stand ins. The work is not done until that plan passes.

This is the part that matters most. A coding agent can satisfy itself too easily inside a test suite. A real verification step forces it to prove that the feature works where it will actually be used.

For example, if the task changes an import flow, the verification plan should not stop at unit tests for a parser. It should run a real import against the actual service or database, using realistic data, and confirm the full flow behaves correctly from start to finish. If that scenario fails, the task is still open.

## Put the guardrails in `CLAUDE.md` up front

These rules work best when the project states them at the start instead of adding them after the first bad run.

The project setup guidance says to put the guardrails in `CLAUDE.md` from the beginning. That file should make TDD mandatory and point to `VERIFICATION_PLAN.md` so the agent knows how the project defines proof.

That matters because agents follow the local rules they can see. If `CLAUDE.md` says nothing, Claude will often fall back to a vague default loop: inspect a little, code a lot, and stop early. If `CLAUDE.md` says test first, confirm red, make the smallest passing change, and run the real verification plan, the working loop becomes much harder to bend.

It also makes the expectations durable. The rules do not live in one prompt that disappears. They live with the project, where every new task can inherit them.

## What the loop looks like in practice

The working loop is simple.

First, write the test first.

Second, run it and watch it fail for the right reason.

Third, make the smallest code change that can pass.

Fourth, run the real verification scenario from `VERIFICATION_PLAN.md` against a real system.

Fifth, only mark the work done when the real scenario succeeds.

That loop sounds strict because it is strict. It also gives the agent fewer chances to drift.

Say a bug report says a scheduled job skips entries created near midnight. The first move is a test that reproduces that exact case. Claude runs it and confirms the failure comes from the date handling, not from a broken fixture or a bad assumption. Then Claude makes the smallest fix that gets the test to pass. After that, Claude follows `VERIFICATION_PLAN.md` and runs the job against the real scheduling path and real storage, with data that crosses midnight, to confirm the skipped entries now appear. Only then is the bug actually fixed.

## Why this is worth the extra friction

This approach is slower. It uses more tokens. It can feel repetitive.

It is still the right trade when the goal is software that works outside the chat window. The extra friction stops the easy failure modes: wandering into unrelated changes, guessing instead of checking, and claiming completion before the result survives contact with reality.

That is why I like these rules. They do not try to make Claude look smart. They try to make Claude behave carefully. For real work, that matters more.