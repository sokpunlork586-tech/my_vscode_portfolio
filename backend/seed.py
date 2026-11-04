import sys
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.project import Project
from app.models.skill import Skill
from app.models.message import Message
from app.models.analytics import Metric


def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Admin User
        admin_email = "admin@portfolio.com"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            print(f"Creating default admin user: {admin_email}...")
            admin_user = User(
                email=admin_email,
                full_name="Portfolio Administrator",
                hashed_password=get_password_hash("Admin1234!"),
                role=UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin_user)
        else:
            print(f"Admin user {admin_email} already exists.")

        # 2. Seed Projects
        if db.query(Project).count() == 0:
            print("Seeding initial projects...")
            sample_projects = [
                Project(
                    title="Developer Portfolio VS Code Style",
                    slug="vscode-portfolio",
                    description="Interactive developer portfolio modeled after VS Code editor with tabbed navigation, file explorer, settings, and terminal.",
                    category="Web App",
                    tags="Next.js,TypeScript,React-JSS,Tailwind",
                    demo_url="http://localhost:3000",
                    github_url="https://github.com/example/vscode-portfolio",
                    image_url="/projects/vscode-portfolio.png",
                    is_featured=True,
                    order=1,
                ),
                Project(
                    title="Portfolio Management Admin Dashboard",
                    slug="admin-dashboard",
                    description="Full-stack administrative dashboard powered by Next.js 14 App Router, FastAPI, and PostgreSQL with role-based access control.",
                    category="Full Stack",
                    tags="Next.js,FastAPI,PostgreSQL,Tailwind,Recharts",
                    demo_url="http://localhost:3001",
                    github_url="https://github.com/example/admin-dashboard",
                    image_url="/projects/admin-dashboard.png",
                    is_featured=True,
                    order=2,
                ),
                Project(
                    title="AI Code Assistant & Agentic CLI",
                    slug="ai-code-assistant",
                    description="Autonomous coding assistant integrating LLM agents with automated terminal sandboxing and multi-file code editing.",
                    category="AI / ML",
                    tags="Python,FastAPI,OpenAI,AsyncIO,Docker",
                    demo_url="https://example.com/demo",
                    github_url="https://github.com/example/ai-assistant",
                    image_url="/projects/ai-assistant.png",
                    is_featured=False,
                    order=3,
                ),
            ]
            db.add_all(sample_projects)

        # 3. Seed Skills
        if db.query(Skill).count() == 0:
            print("Seeding initial skills...")
            sample_skills = [
                Skill(name="React & Next.js", category="Frontend", proficiency=95, order=1),
                Skill(name="TypeScript", category="Frontend", proficiency=90, order=2),
                Skill(name="Tailwind CSS", category="Frontend", proficiency=92, order=3),
                Skill(name="Python & FastAPI", category="Backend", proficiency=94, order=4),
                Skill(name="Node.js & Express", category="Backend", proficiency=85, order=5),
                Skill(name="PostgreSQL", category="Database", proficiency=88, order=6),
                Skill(name="Docker & Containerization", category="DevOps", proficiency=82, order=7),
                Skill(name="CI/CD & Git", category="DevOps", proficiency=86, order=8),
            ]
            db.add_all(sample_skills)

        # 4. Seed Messages
        if db.query(Message).count() == 0:
            print("Seeding sample inquiries...")
            sample_messages = [
                Message(
                    name="Elena Rostova",
                    email="elena@techcorp.io",
                    subject="Frontend Lead Opportunity",
                    message="We reviewed your interactive portfolio and would love to discuss a Senior Lead Engineer position at our fintech startup.",
                    is_read=False,
                ),
                Message(
                    name="David Kim",
                    email="david.kim@innovate.co",
                    subject="Full Stack Consulting Project",
                    message="Hi, we are building a data-intensive dashboard using Next.js and FastAPI. Are you available for contract engagements this quarter?",
                    is_read=True,
                ),
            ]
            db.add_all(sample_messages)

        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

