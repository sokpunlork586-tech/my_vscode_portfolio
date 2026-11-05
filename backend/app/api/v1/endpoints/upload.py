import shutil
import time
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from app.core.deps import require_admin
from app.models.user import User

router = APIRouter()

UPLOAD_ROOT = Path(__file__).resolve().parents[4] / "uploads"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    current_user: User = Depends(require_admin),
):
    # Sanitize folder name
    clean_folder = "".join(c for c in folder if c.isalnum() or c in ("-", "_")).lower()
    if not clean_folder:
        clean_folder = "general"

    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    target_dir = UPLOAD_ROOT / clean_folder
    target_dir.mkdir(parents=True, exist_ok=True)

    timestamp = int(time.time())
    safe_filename = f"{clean_folder}_{timestamp}{ext}"
    target_path = target_dir / safe_filename

    try:
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save upload: {e}")

    url = f"/uploads/{clean_folder}/{safe_filename}"
    return {
        "url": url,
        "filename": safe_filename,
        "folder": clean_folder,
    }
