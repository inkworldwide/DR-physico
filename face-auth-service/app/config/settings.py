import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Shared secret used to authenticate requests coming FROM the main
    # Physico Edvance Node app — NOT a user-facing secret. Generate a
    # long random string and put the same value in both .env files.
    SERVICE_SECRET: str = os.environ.get("FACE_SERVICE_SECRET", "change_this_shared_secret")

    # How closely a scanned face must match the stored encoding to be
    # accepted. Lower = stricter (fewer false accepts, more false rejects).
    # face_recognition's own docs recommend 0.6 as a reasonable default.
    MATCH_TOLERANCE: float = float(os.environ.get("FACE_MATCH_TOLERANCE", "0.5"))

    # Where face encodings are stored on disk (as .npy files, one per user).
    # These are NUMERIC VECTORS derived from a face, not the original photo —
    # but they are still biometric data and must be treated as sensitive.
    STORAGE_DIR: str = os.environ.get("FACE_STORAGE_DIR", "storage/face_encodings")

    HOST: str = os.environ.get("FACE_SERVICE_HOST", "0.0.0.0")
    PORT: int = int(os.environ.get("FACE_SERVICE_PORT", "8001"))

    # Rate limiting (in-memory, per-process — fine for a single instance;
    # use Redis-backed limiting if you ever run multiple instances).
    RATE_LIMIT_PER_MINUTE: int = int(os.environ.get("FACE_RATE_LIMIT_PER_MINUTE", "10"))

    class Config:
        env_file = ".env"


settings = Settings()
