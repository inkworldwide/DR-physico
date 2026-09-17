"""
Lightweight in-memory rate limiter. Fine for a single-process deployment;
if this service is ever scaled to multiple instances, replace with a
Redis-backed limiter so limits are shared across processes.
"""
import time
from collections import defaultdict
from fastapi import Request, HTTPException, status

from app.config.settings import settings

_requests_by_ip: dict[str, list[float]] = defaultdict(list)


async def rate_limit(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    window_start = now - 60  # 1-minute sliding window

    _requests_by_ip[ip] = [t for t in _requests_by_ip[ip] if t > window_start]

    if len(_requests_by_ip[ip]) >= settings.RATE_LIMIT_PER_MINUTE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many face-scan requests. Please wait a moment and try again."
        )

    _requests_by_ip[ip].append(now)
