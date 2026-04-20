# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential curl libpq-dev ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# ---------- builder ----------
FROM base AS builder
COPY pyproject.toml ./
RUN pip install --upgrade pip \
 && pip wheel --wheel-dir /wheels .

# ---------- dev ----------
FROM base AS dev
COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install -e '.[dev]'
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ---------- runtime ----------
FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends libpq5 curl ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --system apex \
 && useradd  --system --gid apex --home /app apex

COPY --from=builder /wheels /wheels
COPY pyproject.toml ./
RUN pip install --upgrade pip \
 && pip install --no-index --find-links=/wheels apex-backend \
 && rm -rf /wheels

COPY --chown=apex:apex . .

USER apex
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
