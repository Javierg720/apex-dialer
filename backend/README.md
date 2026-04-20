# Backend — Apex Dialer

FastAPI service. Python 3.11, SQLAlchemy 2 async, Alembic, Pydantic v2.

> **Phase 0 (current):** Skeleton only. Exposes `/health`.
> **Phase 1:** Real source is migrated here from `Javierg720/ringai`
> (`sonus_ai/` package, dialer services, Asterisk integration).

## Local dev

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'

uvicorn app.main:app --reload
```

## Tests / lint

```bash
ruff check .
black --check .
mypy .
pytest
```

## Migrations

```bash
alembic revision --autogenerate -m "add calls table"
alembic upgrade head
```

## Layout

```
app/
  main.py         # FastAPI app, lifespan, /health
  config.py       # pydantic-settings
  db.py           # async engine + session
  api/
    deps.py       # shared dependencies (auth, db)
    routers/      # one module per resource
  core/           # logging, security, telemetry
  models/         # SQLAlchemy ORM
  schemas/        # Pydantic request/response
  services/       # business logic (dialer, AMI, STT, TTS)
migrations/       # Alembic env + versions
tests/            # pytest-asyncio
```
