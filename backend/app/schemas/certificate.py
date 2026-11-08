from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CertificateBase(BaseModel):
    title: str = "Certificate"
    issuer: str = "Self / Issuer"
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    order: int = 0


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class CertificateResponse(CertificateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

