"""FastAPI application entrypoint."""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.config import get_settings
from app.db import dispose_engine

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup/shutdown lifecycle."""
    settings = get_settings()
    logging.basicConfig(level=settings.LOG_LEVEL)
    logger.info("apex-backend starting", extra={"env": settings.ENV, "version": __version__})
    try:
        yield
    finally:
        await dispose_engine()
        logger.info("apex-backend shutdown complete")


def create_app() -> FastAPI:
    """Application factory."""
    settings = get_settings()
    app = FastAPI(
        title="Apex Dialer API",
        version=__version__,
        description="Production AI voice dialer — backend API.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["health"])
    async def health() -> dict[str, Any]:
        """Liveness probe. Deliberately cheap — no DB hit here."""
        return {"status": "ok"}

    @app.get("/", tags=["meta"])
    async def root() -> dict[str, str]:
        return {"name": settings.APP_NAME, "version": __version__}

    # Phase 1: mount real routers here, e.g.
    # from app.api.routers import calls, campaigns, agents
    # app.include_router(calls.router, prefix="/api/v1/calls", tags=["calls"])

    return app


app = create_app()
