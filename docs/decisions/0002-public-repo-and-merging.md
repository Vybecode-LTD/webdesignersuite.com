# 0002: The repo is public, and Claude merges on green

- **Date:** 2026-10-19
- **Decided by:** the owner (AskUserQuestion), both the recommended options.

## Decisions

1. **`Vybecode-LTD/webdesignersuite.com` is public.** It is a showcase: the site is built with the suite and passes its own
   gates, and the footer's link to the latest green run works for every visitor. Actions minutes are free for a public repo.
2. **Claude merges this repo's PRs** once CI is green, every review thread is resolved and the PR is clean, with a merge
   commit, the same rule as the plugin repo. Auto-merge stays off.

## Options that lost, and why

- **Private:** it would hide the drafts and `dev plans/` until launch, but the footer's link to the green run would 404 for
  visitors, and Actions minutes would count against the org's private quota.
- **The owner merges each PR:** a review before every change reaches `main`, at the cost of each of phase 1's small PRs
  waiting on the owner.

## What it requires

- Every commit is public from the first one: commit by explicit path and read the staged diff for secrets.
- `dev plans/` is public too. Nothing private (costs, accounts, keys) goes in it.
