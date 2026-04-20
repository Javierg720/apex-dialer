# Contributing

## Branching

- `main` is protected and always deployable.
- Feature branches: `feat/<short-name>`, fixes: `fix/<short-name>`, chores: `chore/<short-name>`.
- Rebase on `main` before opening a PR. Squash-merge on the GitHub side.

## Commit style

Conventional Commits. Keep subjects under 72 chars. Examples:

```
feat(backend): add predictive dialer pacing algorithm
fix(dashboard): correct waveform scroll on long calls
chore: bump ruff to 0.5
```

## Required local checks

Install pre-commit once:

```bash
pip install pre-commit
pre-commit install
```

The hook runs ruff, black, prettier, eslint, and trufflehog before each commit.

## Backend

```bash
cd backend
pip install -e '.[dev]'
ruff check .
black --check .
mypy .
pytest
```

## Dashboard

```bash
cd dashboard
npm ci
npm run lint
npm run typecheck
npm run build
```

## PR checklist

- [ ] All CI green (`backend-ci`, `dashboard-ci`, `infra-ci` as applicable)
- [ ] New code has type hints / TS types
- [ ] Public API changes updated in `docs/api-contract.md`
- [ ] No secrets, no `.env`, no real phone numbers / PII in fixtures
- [ ] Migrations are reversible (`alembic downgrade -1` works)
