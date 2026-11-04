from datetime import datetime
from pathlib import Path
import shutil
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin, get_current_user
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()

BACKEND_DIR = Path(__file__).resolve().parents[4]
WORKSPACE_ROOT = BACKEND_DIR.parent
UPLOAD_DIR = BACKEND_DIR / "uploads"
FRONTEND_IMAGES_DIR = WORKSPACE_ROOT / "vscode-portfolio" / "public" / "images"


@router.get("", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    return db.query(User).order_by(User.id.asc()).all()


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_pw = get_password_hash(user_in.password)
    user_data = user_in.model_dump(exclude={"password"})
    user = User(**user_data, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user



@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        user.hashed_password = get_password_hash(update_data.pop("password"))

    for field, val in update_data.items():
        setattr(user, field, val)

    db.commit()
    db.refresh(user)
    return user


async def _process_and_save_avatar(file: UploadFile, user: User, db: Session) -> User:
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP, GIF.",
        )

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size exceeds the 5MB maximum limit.",
        )

    ext = "png"
    if file.filename and "." in file.filename:
        file_ext = file.filename.rsplit(".", 1)[-1].lower()
        if file_ext in ["jpg", "jpeg", "png", "webp", "gif"]:
            ext = file_ext

    avatars_dir = UPLOAD_DIR / "avatars"
    avatars_dir.mkdir(parents=True, exist_ok=True)
    filename = f"avatar_{user.id}_{int(datetime.now().timestamp())}.{ext}"
    target_path = avatars_dir / filename

    with open(target_path, "wb") as f:
        f.write(contents)

    # Sync to vscode-portfolio public/images/profile.png
    try:
        FRONTEND_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(target_path, FRONTEND_IMAGES_DIR / "profile.png")
    except Exception:
        pass

    user.avatar_url = f"/uploads/avatars/{filename}"
    db.commit()
    db.refresh(user)
    return user


@router.post("/me/avatar", response_model=UserResponse)
async def upload_current_user_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    return await _process_and_save_avatar(file, current_user, db)


@router.post("/{user_id}/avatar", response_model=UserResponse)
async def upload_user_avatar(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await _process_and_save_avatar(file, user, db)



