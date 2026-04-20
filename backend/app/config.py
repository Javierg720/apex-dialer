"""Typed application settings loaded from environment / .env."""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration.

    All values are loaded from environment variables, optionally sourced from
    a local `.env` file in development. Production deployments should pass
    real env vars and leave `.env` absent.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # --- Core ---
    APP_NAME: str = "apex-dialer-backend"
    ENV: str = Field(default="development")
    LOG_LEVEL: str = Field(default="INFO")

    # --- Datastores ---
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://apex:apex@postgres:5432/apex",
        description="Async SQLAlchemy URL (asyncpg driver).",
    )
    REDIS_URL: str = Field(default="redis://redis:6379/0")

    # --- Auth ---
    JWT_SECRET_KEY: str = Field(
        default="change-me-in-production",
        description="Signing secret for JWTs. Rotate regularly in prod.",
    )
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_EXPIRE_MINUTES: int = Field(default=60 * 12)

    # --- CORS ---
    CORS_ORIGINS: list[str] = Field(
        default_factory=lambda: [
            "http://localhost",
            "http://localhost:5173",
            "http://localhost:3000",
        ]
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached settings accessor."""
    return Settings()
