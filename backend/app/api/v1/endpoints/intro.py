import json
from pathlib import Path
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.deps import require_admin
from app.models.user import User
from app.schemas.intro import IntroResponse, IntroUpdate

router = APIRouter()

BACKEND_DIR = Path(__file__).resolve().parents[4]
WORKSPACE_ROOT = BACKEND_DIR.parent
STATIC_JSON_PATH = WORKSPACE_ROOT / "vscode-portfolio" / "src" / "data" / "json" / "static.json"


def get_static_data() -> dict:
    if STATIC_JSON_PATH.exists():
        try:
            with open(STATIC_JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return {
                    "main_line": data.get("mainLine", "Hi! I'm Punlork."),
                    "typed": data.get("typed", []),
                }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read static.json: {e}")
    return {
        "main_line": "Hi! I'm Punlork.",
        "typed": [
            "I'm a Developer.",
            "I'm an INTJ-T through and through.",
        ],
    }


@router.get("", response_model=IntroResponse)
def get_intro_data() -> Any:
    return get_static_data()


@router.put("", response_model=IntroResponse)
def update_intro_data(
    intro_in: IntroUpdate,
    current_user: User = Depends(require_admin),
) -> Any:
    current = get_static_data()
    
    new_main_line = intro_in.main_line if intro_in.main_line is not None else current["main_line"]
    new_typed = intro_in.typed if intro_in.typed is not None else current["typed"]

    # Write formatted JSON to vscode-portfolio/src/data/json/static.json
    try:
        STATIC_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
        output_payload = {
            "mainLine": new_main_line,
            "typed": new_typed,
        }
        with open(STATIC_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2, ensure_ascii=False)
            f.write("\n")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write to static.json: {e}")

    return {
        "main_line": new_main_line,
        "typed": new_typed,
    }

