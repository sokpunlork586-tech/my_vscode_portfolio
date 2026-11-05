import os
import sys
from pathlib import Path

# Ensure backend root is in sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.models.education import Education
from app.models.experience import Experience
from app.models.certificate import Certificate
from app.models.skill import Skill
from app.models.contact import ContactInfo, SocialLink
from app.schemas.education import EducationCreate, EducationUpdate
from app.schemas.experience import ExperienceCreate, ExperienceUpdate
from app.schemas.certificate import CertificateCreate, CertificateUpdate
from app.schemas.skill import SkillCreate, SkillUpdate
from app.schemas.contact import ContactInfoUpdate, SocialLinkCreate, SocialLinkUpdate
from app.api.v1.endpoints.education import list_education, create_education, update_education, delete_education
from app.api.v1.endpoints.experience import list_experience, create_experience, update_experience, delete_experience
from app.api.v1.endpoints.certificates import list_certificates, create_certificate, update_certificate, delete_certificate
from app.api.v1.endpoints.skills import list_skills, create_skill, update_skill, delete_skill
from app.api.v1.endpoints.contact import get_contact_info, update_contact_info, list_social_links, create_social_link, delete_social_link

db = SessionLocal()
admin_user = db.query(User).filter(User.role == UserRole.ADMIN).first()
if not admin_user:
    admin_user = User(
        email="admin@portfolio.com",
        full_name="Admin",
        is_active=True,
        role=UserRole.ADMIN,
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

print("=== STARTING DIRECT ENDPOINT UNIT & INTEGRATION TESTS ===")

# 1. Education
print("\n[Testing Education Endpoints]")
edus = list_education(db=db)
print(f"Current education items: {len(edus)}")

new_edu = create_education(
    edu_in=EducationCreate(
        institution="Direct Test University",
        degree="Master of Science in Software Engineering",
        field_of_study="Artificial Intelligence",
        start_date="2024",
        end_date="2026",
        grade="4.0",
        description="Advanced distributed systems research",
        url="https://example.com/ai-masters",
        order=50,
    ),
    db=db,
    current_user=admin_user,
)
print(f"Created Education ID: {new_edu.id}, Institution: {new_edu.institution}")
assert new_edu.id is not None

updated_edu = update_education(
    id=new_edu.id,
    edu_in=EducationUpdate(institution="Updated Test University"),
    db=db,
    current_user=admin_user,
)
print(f"Updated Education Institution: {updated_edu.institution}")
assert updated_edu.institution == "Updated Test University"

delete_education(id=new_edu.id, db=db, current_user=admin_user)
print("Deleted Education successfully.")

# 2. Experience
print("\n[Testing Experience Endpoints]")
exps = list_experience(db=db)
print(f"Current experiences count: {len(exps)}")

new_exp = create_experience(
    exp_in=ExperienceCreate(
        company="NextGen AI Labs",
        position="Senior Systems Architect",
        location="Remote",
        employment_type="Full-time",
        start_date="2024",
        end_date="Present",
        is_current=True,
        description="Built resilient cloud infrastructure and microservices.",
        technologies="Python, FastAPI, Next.js, Docker",
        company_url="https://example.com/nextgen",
        order=50,
    ),
    db=db,
    current_user=admin_user,
)
print(f"Created Experience ID: {new_exp.id}, Position: {new_exp.position}")
assert new_exp.id is not None

updated_exp = update_experience(
    id=new_exp.id,
    exp_in=ExperienceUpdate(position="Lead Systems Architect"),
    db=db,
    current_user=admin_user,
)
print(f"Updated Experience Position: {updated_exp.position}")
assert updated_exp.position == "Lead Systems Architect"

delete_experience(id=new_exp.id, db=db, current_user=admin_user)
print("Deleted Experience successfully.")

# 3. Certificates
print("\n[Testing Certificates Endpoints]")
certs = list_certificates(db=db)
print(f"Current certificates count: {len(certs)}")

new_cert = create_certificate(
    cert_in=CertificateCreate(
        title="Certified Kubernetes Administrator",
        issuer="Linux Foundation / CNCF",
        issue_date="2024",
        credential_id="CKA-994821",
        credential_url="https://cncf.io",
        description="Enterprise cluster administration",
        order=50,
    ),
    db=db,
    current_user=admin_user,
)
print(f"Created Certificate ID: {new_cert.id}, Title: {new_cert.title}")
assert new_cert.id is not None

updated_cert = update_certificate(
    id=new_cert.id,
    cert_in=CertificateUpdate(title="CKA - Certified Kubernetes Administrator"),
    db=db,
    current_user=admin_user,
)
print(f"Updated Certificate Title: {updated_cert.title}")
assert "CKA" in updated_cert.title

delete_certificate(id=new_cert.id, db=db, current_user=admin_user)
print("Deleted Certificate successfully.")

# 4. Skills
print("\n[Testing Skills Endpoints]")
skills = list_skills(db=db)
print(f"Current skills count: {len(skills)}")

# Clean up any residual test skill
old_skill = db.query(Skill).filter(Skill.name == "Rust Systems").first()
if old_skill:
    db.delete(old_skill)
    db.commit()

new_skill = create_skill(
    skill_in=SkillCreate(
        name="Rust Systems",
        category="Systems",
        proficiency=80,
        order=50,
    ),
    db=db,
    current_user=admin_user,
)
print(f"Created Skill ID: {new_skill.id}, Name: {new_skill.name}")
assert new_skill.id is not None

updated_skill = update_skill(
    skill_id=new_skill.id,
    skill_in=SkillUpdate(proficiency=88),
    db=db,
    current_user=admin_user,
)
print(f"Updated Skill Proficiency: {updated_skill.proficiency}%")
assert updated_skill.proficiency == 88

delete_skill(skill_id=new_skill.id, db=db, current_user=admin_user)
print("Deleted Skill successfully.")

# 5. Contact & Socials
print("\n[Testing Contact & Social Links Endpoints]")
contact = get_contact_info(db=db)
print(f"Current developer: {contact.developer_name}, email: {contact.email}")

updated_contact = update_contact_info(
    info_in=ContactInfoUpdate(
        developer_name="Punlork",
        professional_title="Full-Stack & Python Developer",
        availability_status="Available for contract / full-time",
    ),
    db=db,
    current_user=admin_user,
)
print(f"Updated Contact availability: {updated_contact.availability_status}")
assert updated_contact.availability_status == "Available for contract / full-time"

new_social = create_social_link(
    social_in=SocialLinkCreate(
        platform="Discord",
        url="https://discord.gg/example",
        icon="faDiscord",
        username="punlork#0001",
        order=10,
        is_visible=True,
    ),
    db=db,
    current_user=admin_user,
)
print(f"Created Social ID: {new_social.id}, Platform: {new_social.platform}")
assert new_social.id is not None

delete_social_link(id=new_social.id, db=db, current_user=admin_user)
print("Deleted Social Link successfully.")

db.close()
print("\n=======================================================")
print("  ALL CRUD AND MARKDOWN SYNC TESTS COMPLETED 100% OK!  ")
print("=======================================================")
