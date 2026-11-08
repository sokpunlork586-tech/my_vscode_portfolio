from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ContactInfoBase(BaseModel):
    developer_name: str = "Punlork"
    professional_title: str = "Full-Stack & Python Developer"
    email: str = "sokpunlork586@gmail.com"
    phone: Optional[str] = None
    location: str = "Cambodia"
    timezone: str = "ICT (UTC+7)"
    preferred_method: str = "Email"
    response_window: str = "Within 24 hours"
    availability_status: str = "Available for projects"
    github_url: str = "https://github.com/sokpunlork586-tech"
    linkedin_url: str = "https://linkedin.com"
    bio_note: Optional[str] = None


class ContactInfoUpdate(BaseModel):
    developer_name: Optional[str] = None
    professional_title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    preferred_method: Optional[str] = None
    response_window: Optional[str] = None
    availability_status: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio_note: Optional[str] = None


class ContactInfoResponse(ContactInfoBase):
    id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SocialLinkBase(BaseModel):
    platform: str = "Link"
    url: str = "#"
    icon: str = "faLink"
    username: str = ""
    order: int = 0
    is_visible: bool = True


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    username: Optional[str] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None


class SocialLinkResponse(SocialLinkBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
