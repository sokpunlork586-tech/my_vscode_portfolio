from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=False, index=True)  # Frontend, Backend, Database, DevOps
    proficiency = Column(Integer, default=80, nullable=False)  # 0 to 100
    icon = Column(String(100), nullable=True)
    order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

