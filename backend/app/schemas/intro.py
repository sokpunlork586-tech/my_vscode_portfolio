from typing import List, Optional
from pydantic import BaseModel


class IntroBase(BaseModel):
    main_line: str = "Hi! I'm Punlork."
    typed: List[str] = ["Software Developer", "Python Developer"]


class IntroUpdate(BaseModel):
    main_line: Optional[str] = None
    typed: Optional[List[str]] = None


class IntroResponse(IntroBase):
    pass

