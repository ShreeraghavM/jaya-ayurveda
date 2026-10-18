# Contributing

## Branch model

Trunk-based with short-lived feature branches.

```
main                      always deployable
 └── feat/<scope>         one concern per branch
 └── fix/<scope>
 └── docs/<scope>
```

1. Branch from `main`.
2. Keep the branch under ~3 days.
3. Open a PR into `main`. Squash-merge for features, merge-commit when the individual commits are meaningful.
4. Delete the branch after merge.
5. Tag releases on `main` (`v1.0.0`, `v1.1.0`, …) following semver.

Nothing is committed directly to `main` except a release commit.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <imperative summary>

[optional body — the why, not the what]
```

| Type | Use |
|---|---|
| `feat` | user-visible capability |
| `fix` | defect |
| `refactor` | no behaviour change |
| `docs` | documentation only |
| `chore` | tooling, deps, config |
| `test` | tests |
| `perf` | performance |

Scope examples: `prompt-engine`, `diet`, `onboarding`, `bmi`, `profile`.

## Before opening a PR

```bash
bun x tsc --noEmit     # must be clean for src/**
bun run build          # must succeed
```

Then walk the smoke path: landing → demo profile → dashboard → profile (BMI visible) → guide → diet check-in → goals → good night.

## Code conventions

- TypeScript strict; no `any` in new code.
- Components in `src/components/`, one feature per file, default export.
- All domain content belongs in `src/lib/` as data — do not hardcode Ayurvedic copy inside components.
- Persistence only through `src/lib/store.ts`; never touch `localStorage` directly in a component.
- Tailwind utilities only; no new CSS files.
- Mobile-first: the app opens at ~390 px. No fixed multi-column grids without `sm:`/`lg:` breakpoints.
- Never edit `src/generated/**` or `server.tsx` by hand — they are generated from `prisma/schema.prisma`.

## Content review rules

Any change to health-adjacent copy must satisfy:

1. No diagnostic language ("you have", "this indicates", "cure", "treat", "prevent disease").
2. Remedies state precautions and are scoped to mild complaints.
3. Asanas and pranayama state contraindications.
4. Anything severe, sudden or worsening routes to a clinician.

See [`docs/AI-SAFETY.md`](docs/AI-SAFETY.md).

## Data model changes

1. Edit `prisma/schema.prisma`.
2. Run the project generator.
3. Commit the schema and the regenerated output together.

Never run `prisma db push --force-reset` or `--accept-data-loss` against a database with real rows.

## Pull request checklist

- [ ] Type check clean, build succeeds
- [ ] Smoke path walked and described in the PR
- [ ] No secrets, tokens or `.env` files
- [ ] Health copy passes the content review rules
- [ ] Docs updated when behaviour or architecture changed
