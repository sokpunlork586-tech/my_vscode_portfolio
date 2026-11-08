from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class EducationBase(BaseModel):
    institution: str = "Unspecified Institution"
    degree: str = "Program / Course"
    field_of_study: Optional[str] = None
    start_date: str = "2024"
    end_date: str = "Present"
    grade: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    order: int = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None


class EducationResponse(EducationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
