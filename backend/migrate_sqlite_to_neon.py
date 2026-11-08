"""
migrate_sqlite_to_neon.py
Automated ETL migration script transferring records from SQLite to Neon PostgreSQL.
"""
import sys
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import settings
from app.db.base import Base
from app.models.user import User
from app.models.profile import Profile
from app.models.project import Project
from app.models.skill import Skill
from app.models.education import Education
from app.models.experience import Experience
from app.models.certificate import Certificate
from app.models.contact import ContactInfo, SocialLink
from app.models.message import Message
from app.models.analytics import Metric

SQLITE_PATH = BACKEND_DIR / "portfolio_dev.db"

if not SQLITE_PATH.exists():
    print(f"Error: Source SQLite database not found at {SQLITE_PATH}")
    sys.exit(1)

MODELS = [
    User,
    Profile,
    Project,
    Skill,
    Education,
    Experience,
    Certificate,
    ContactInfo,
    SocialLink,
    Message,
    Metric,
]


def run_migration():
    print(f"Connecting to source SQLite: {SQLITE_PATH}")
    sqlite_engine = create_engine(f"sqlite:///{SQLITE_PATH.as_posix()}")
    SqliteSession = sessionmaker(bind=sqlite_engine)

    print("Connecting to target Neon PostgreSQL...")
    print(f"Database URL: {settings.DATABASE_URL.split('@')[-1]}")  # Redacted output
    pg_engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    PgSession = sessionmaker(bind=pg_engine)

    sqlite_db = SqliteSession()
    pg_db = PgSession()

    try:
        print("\nStep 1: Creating Neon PostgreSQL schema (Base.metadata.create_all)...")
        Base.metadata.create_all(bind=pg_engine)
        print("Schema successfully initialized in Neon!")

        print("\nStep 2: Migrating records from SQLite to Neon...")
        total_migrated = 0
        for model in MODELS:
            table_name = model.__tablename__
            rows = sqlite_db.query(model).all()
            count = len(rows)
            print(f"Processing table '{table_name}' ({count} source rows)...")

            for item in rows:
                data = {c.name: getattr(item, c.name) for c in model.__table__.columns}
                pk_val = data.get("id")
                existing = pg_db.query(model).filter(model.id == pk_val).first() if pk_val else None

                if not existing:
                    new_obj = model(**data)
                    pg_db.add(new_obj)
                    total_migrated += 1

            pg_db.commit()
            print(f"  -> '{table_name}' synchronized.")

        print(f"\nStep 3: Synchronizing PostgreSQL auto-increment sequences...")
        with pg_engine.connect() as conn:
            for model in MODELS:
                t_name = model.__tablename__
                query = text(f"""
                    SELECT setval(
                        pg_get_serial_sequence('{t_name}', 'id'),
                        COALESCE((SELECT MAX(id) FROM {t_name}), 1),
                        (SELECT MAX(id) IS NOT NULL FROM {t_name})
                    );
                """)
                try:
                    conn.execute(query)
                    conn.commit()
                    print(f"  -> Sequence for '{t_name}' synchronized.")
                except Exception as seq_err:
                    print(f"  -> Notice: sequence sync skipped for {t_name}: {seq_err}")

        print(f"\nStep 4: Verifying final Neon table counts...")
        with pg_engine.connect() as conn:
            total_neon = 0
            for model in MODELS:
                t_name = model.__tablename__
                cnt = conn.execute(text(f"SELECT count(*) FROM {t_name};")).fetchone()[0]
                total_neon += cnt
                print(f"  [NEON TABLE] {t_name:15}: {cnt} rows")
            print(f"\nTotal Records in Neon PostgreSQL: {total_neon}")

        print("\nMIGRATION COMPLETED SUCCESSFULLY!")

    except Exception as e:
        pg_db.rollback()
        print(f"\nMigration FAILED: {e}")
        sys.exit(1)
    finally:
        sqlite_db.close()
        pg_db.close()


if __name__ == "__main__":
    run_migration()
