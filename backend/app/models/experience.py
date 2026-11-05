from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.db.base import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=True)
    employment_type = Column(String(100), default="Full-time", nullable=True)
    start_date = Column(String(100), nullable=False)
    end_date = Column(String(100), default="Present", nullable=False)
    is_current = Column(Boolean, default=True, nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(String(500), default="", nullable=False)
    company_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
