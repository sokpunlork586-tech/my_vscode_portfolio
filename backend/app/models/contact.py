from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.db.base import Base


class ContactInfo(Base):
    __tablename__ = "contact_infos"

    id = Column(Integer, primary_key=True, index=True)
    developer_name = Column(String(255), default="Punlork", nullable=False)
    professional_title = Column(String(255), default="Full-Stack & Python Developer", nullable=False)
    email = Column(String(255), default="sokpunlork586@gmail.com", nullable=False)
    phone = Column(String(100), nullable=True)
    location = Column(String(255), default="Cambodia", nullable=False)
    timezone = Column(String(100), default="ICT (UTC+7)", nullable=False)
    preferred_method = Column(String(100), default="Email", nullable=False)
    response_window = Column(String(100), default="Within 24 hours", nullable=False)
    availability_status = Column(String(100), default="Available for projects", nullable=False)
    github_url = Column(String(500), default="https://github.com/sokpunlork586-tech", nullable=False)
    linkedin_url = Column(String(500), default="https://linkedin.com", nullable=False)
    bio_note = Column(Text, nullable=True)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(100), nullable=False)
    url = Column(String(500), nullable=False)
    icon = Column(String(100), default="faLink", nullable=False)
    username = Column(String(100), default="", nullable=False)
    order = Column(Integer, default=0, nullable=False)
    is_visible = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
