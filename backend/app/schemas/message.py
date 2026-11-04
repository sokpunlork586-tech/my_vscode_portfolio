from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class MessageBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_archived: Optional[bool] = None


class MessageResponse(MessageBase):
    id: int
    is_read: bool
    is_archived: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageListResponse(BaseModel):
    items: List[MessageResponse]
    total: int
    unread_count: int
