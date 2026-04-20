"""Health endpoint smoke tests."""

from __future__ import annotations

from httpx import AsyncClient


async def test_health_returns_ok(client: AsyncClient) -> None:
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


async def test_root_returns_metadata(client: AsyncClient) -> None:
    resp = await client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "apex-dialer-backend"
    assert "version" in data
