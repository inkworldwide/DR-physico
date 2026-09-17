from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status

from app.services.face_service import (
    register_face, verify_face, has_registered_face, delete_face, FaceServiceError
)
from app.utils.internal_auth import require_internal_service_secret
from app.utils.rate_limit import rate_limit

router = APIRouter(prefix="/api/face", tags=["face"])

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


async def _read_and_validate_image(image: UploadFile) -> bytes:
    if image.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be JPEG, PNG, or WEBP."
        )
    data = await image.read()
    if len(data) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image is too large (max 5MB)."
        )
    return data


@router.post("/register", dependencies=[Depends(require_internal_service_secret), Depends(rate_limit)])
async def register(user_id: str = Form(...), image: UploadFile = File(...)):
    """Registers (or re-registers) a user's reference face."""
    image_bytes = await _read_and_validate_image(image)
    try:
        register_face(user_id, image_bytes)
    except FaceServiceError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    return {"success": True, "message": "Face registered successfully."}


@router.post("/verify", dependencies=[Depends(require_internal_service_secret), Depends(rate_limit)])
async def verify(user_id: str = Form(...), image: UploadFile = File(...)):
    """Verifies a freshly captured face against the user's stored reference face."""
    image_bytes = await _read_and_validate_image(image)
    try:
        result = verify_face(user_id, image_bytes)
    except FaceServiceError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    return {"success": True, **result}


@router.get("/status/{user_id}", dependencies=[Depends(require_internal_service_secret)])
async def status_check(user_id: str):
    """Whether this user has a registered face on file."""
    return {"registered": has_registered_face(user_id)}


@router.delete("/{user_id}", dependencies=[Depends(require_internal_service_secret)])
async def remove_face(user_id: str):
    """Deletes a user's stored face encoding (e.g. on account deletion or opt-out)."""
    deleted = delete_face(user_id)
    return {"success": True, "deleted": deleted}
