from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Punlork", nullable=False)
    full_name = Column(String(255), default="Punlork Sok", nullable=False)
    role = Column(String(255), default="Full-Stack & Python Developer", nullable=False)
    status = Column(String(255), default="Available for projects", nullable=False)
    avatar_url = Column(String(500), default="/images/profile.png", nullable=True)
    bio = Column(Text, nullable=True)
    tech_stack = Column(String(1000), default="", nullable=False)
    main_line = Column(String(255), default="Hi! I'm Punlork.", nullable=False)
    typed_lines = Column(Text, default='["I\'m a Full-Stack Developer."]', nullable=False)
    quick_navigation = Column(Text, default="[]", nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
