from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db.base import Base


class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True, index=True)
    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=False, index=True)
    field_of_study = Column(String(255), nullable=True)
    start_date = Column(String(100), nullable=False)
    end_date = Column(String(100), default="Present", nullable=False)
    grade = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
