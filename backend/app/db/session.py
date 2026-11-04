import logging
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("db")
Base = declarative_base()

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DEV_SQLITE_PATH = (BACKEND_DIR / "portfolio_dev.db").as_posix()


def get_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite"):
        # Ensure deterministic path for sqlite
        if "portfolio_dev.db" in db_url:
            return create_engine(f"sqlite:///{DEV_SQLITE_PATH}", connect_args={"check_same_thread": False})
        return create_engine(db_url, connect_args={"check_same_thread": False})
    
    try:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            connect_args={"connect_timeout": 3}
        )
        with engine.connect() as conn:
            pass
        return engine
    except Exception as e:
        logger.warning(f"PostgreSQL connection error: {e}. Falling back to SQLite at {DEV_SQLITE_PATH}.")
        return create_engine(f"sqlite:///{DEV_SQLITE_PATH}", connect_args={"check_same_thread": False})


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
