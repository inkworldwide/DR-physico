from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.face_routes import router as face_router
from app.config.settings import settings

app = FastAPI(
    title="Physico Edvance — Face Attendance Service",
    description=(
        "Internal microservice for face-based attendance marking. "
        "Not intended to be exposed to the public internet — see README.md."
    ),
    version="1.0.0"
)

# This service is only ever called server-to-server from the Node backend,
# so CORS is intentionally locked down to nothing (no browser ever calls
# this directly). Adjust only if you have a verified reason to.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

app.include_router(face_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "face-attendance"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
