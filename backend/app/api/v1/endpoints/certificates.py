import logging
from pathlib import Path
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.certificate import Certificate
from app.models.user import User
from app.schemas.certificate import CertificateCreate, CertificateUpdate, CertificateResponse

logger = logging.getLogger("certificates")
router = APIRouter()

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
CERTIFICATES_MD_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "tabs" / "certificates.md"


def sync_certificates_to_markdown(db: Session) -> None:
    try:
        items = db.query(Certificate).order_by(Certificate.order.asc(), Certificate.id.desc()).all()
        lines = ["### Certificates that I have earned over time\n"]
        for cert in items:
            link = cert.credential_url or "#"
            lines.append(f"- [{cert.title}]({link})\n")
            lines.append(f"  - Issuer: {cert.issuer}")
            if cert.issue_date:
                lines.append(f"  - Issued: {cert.issue_date}")
            if cert.credential_id:
                lines.append(f"  - Credential ID: `{cert.credential_id}`")
            if cert.description:
                lines.append(f"  - {cert.description}")
            if cert.image_url:
                lines.append(f"  - [View Certificate]({cert.image_url})")
            lines.append("")

        CERTIFICATES_MD_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CERTIFICATES_MD_PATH, "w", encoding="utf-8") as f:
            f.write("\n".join(lines).strip() + "\n")
    except Exception as e:
        logger.warning(f"Could not sync certificates.md: {e}")


@router.get("", response_model=List[CertificateResponse])
def list_certificates(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
) -> Any:
    query = db.query(Certificate)
    if search and isinstance(search, str):
        s = f"%{search}%"
        query = query.filter(
            (Certificate.title.ilike(s)) |
            (Certificate.issuer.ilike(s)) |
            (Certificate.credential_id.ilike(s)) |
            (Certificate.description.ilike(s))
        )
    return query.order_by(Certificate.order.asc(), Certificate.id.desc()).all()


@router.get("/{id}", response_model=CertificateResponse)
def get_certificate(
    id: int,
    db: Session = Depends(get_db),
) -> Any:
    cert = db.query(Certificate).filter(Certificate.id == id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert


@router.post("", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificate(
    cert_in: CertificateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    cert = Certificate(**cert_in.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    sync_certificates_to_markdown(db)
    return cert


@router.put("/{id}", response_model=CertificateResponse)
def update_certificate(
    id: int,
    cert_in: CertificateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    cert = db.query(Certificate).filter(Certificate.id == id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")

    update_data = cert_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(cert, field, val)

    db.commit()
    db.refresh(cert)
    sync_certificates_to_markdown(db)
    return cert


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    cert = db.query(Certificate).filter(Certificate.id == id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")

    db.delete(cert)
    db.commit()
    sync_certificates_to_markdown(db)
    return None
