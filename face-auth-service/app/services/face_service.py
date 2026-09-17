"""
Core face-matching logic.

Storage model:
  Each registered user gets exactly one file: storage/face_encodings/{user_id}.npy
  containing a 128-dimension face encoding vector (NOT the original photo).
  The original uploaded image is never written to disk — it's decoded in memory,
  encoded into a vector, and discarded immediately after the vector is saved.
  This significantly limits the privacy blast radius if the storage directory
  were ever exposed, since a face encoding cannot be reversed into a photo.
"""
import os
import numpy as np
import face_recognition
from io import BytesIO
from PIL import Image

from app.config.settings import settings


def _user_encoding_path(user_id: str) -> str:
    safe_id = "".join(c for c in str(user_id) if c.isalnum() or c in ("-", "_"))
    return os.path.join(settings.STORAGE_DIR, f"{safe_id}.npy")


def _load_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    return np.array(image)


class FaceServiceError(Exception):
    """Raised for expected, user-facing failures (no face found, etc.)."""
    pass


def extract_single_face_encoding(image_bytes: bytes) -> np.ndarray:
    """
    Decodes an image and returns the face encoding for exactly one face.
    Raises FaceServiceError with a clear message if zero or multiple faces
    are detected, since both cases make registration/verification ambiguous.
    """
    image = _load_image_from_bytes(image_bytes)
    face_locations = face_recognition.face_locations(image)

    if len(face_locations) == 0:
        raise FaceServiceError("No face detected in the image. Please ensure your face is clearly visible and well-lit.")
    if len(face_locations) > 1:
        raise FaceServiceError("Multiple faces detected. Please make sure only you are in frame.")

    encodings = face_recognition.face_encodings(image, known_face_locations=face_locations)
    return encodings[0]


def register_face(user_id: str, image_bytes: bytes) -> None:
    """Encodes the given image and saves it as the user's reference face."""
    encoding = extract_single_face_encoding(image_bytes)
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    np.save(_user_encoding_path(user_id), encoding)


def has_registered_face(user_id: str) -> bool:
    return os.path.exists(_user_encoding_path(user_id))


def delete_face(user_id: str) -> bool:
    path = _user_encoding_path(user_id)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False


def verify_face(user_id: str, image_bytes: bytes) -> dict:
    """
    Compares a freshly-captured image against the user's stored encoding.
    Returns a dict with match result and a distance score (lower = closer match).
    """
    path = _user_encoding_path(user_id)
    if not os.path.exists(path):
        raise FaceServiceError("No registered face found for this user. Please register your face first.")

    stored_encoding = np.load(path)
    new_encoding = extract_single_face_encoding(image_bytes)

    distance = float(face_recognition.face_distance([stored_encoding], new_encoding)[0])
    is_match = distance <= settings.MATCH_TOLERANCE

    return {
        "match": is_match,
        "distance": round(distance, 4),
        "tolerance": settings.MATCH_TOLERANCE
    }
