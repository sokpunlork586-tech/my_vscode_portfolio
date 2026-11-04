from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate, MessageUpdate, MessageResponse, MessageListResponse

router = APIRouter()


@router.get("", response_model=MessageListResponse)
def list_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    unread_only: bool = False,
    archived: bool = False,
) -> Any:
    query = db.query(Message).filter(Message.is_archived == archived)
    if unread_only:
        query = query.filter(Message.is_read == False)
    
    total = query.count()
    unread_count = db.query(Message).filter(Message.is_read == False).count()
    items = query.order_by(Message.created_at.desc()).all()

    return {
        "items": items,
        "total": total,
        "unread_count": unread_count,
    }


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    message_in: MessageCreate,
    db: Session = Depends(get_db),
) -> Any:
    msg = Message(**message_in.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.patch("/{message_id}", response_model=MessageResponse)
def update_message_status(
    message_id: int,
    message_in: MessageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    update_data = message_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(msg, field, val)

    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return None

