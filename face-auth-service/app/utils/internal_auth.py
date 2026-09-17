"""
This service is meant to be called ONLY by the Physico Edvance Node backend,
never directly by a browser. We enforce that with a shared secret header
rather than exposing this service publicly with no protection at all.

In production, this service should also sit behind a firewall / private
network so it isn't reachable from the public internet at all — the shared
secret is a second layer, not a substitute for network-level isolation.
"""
from fastapi import Header, HTTPException, status
from app.config.settings import settings


async def require_internal_service_secret(x_service_secret: str = Header(default=None)):
    if not x_service_secret or x_service_secret != settings.SERVICE_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing service credentials."
        )
    return True
