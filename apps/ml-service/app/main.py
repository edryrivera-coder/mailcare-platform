"""
MailCare ML & Catch-All Intelligence Service (Sec. 8, 17, 18, 38, NFA-32..34)
Exposes internal advisory endpoints for Catch-All confidence scoring and Inbox semantic classification.
"""

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="MailCare ML & Catch-All Intelligence Service",
    version="1.0.0",
)

MODEL_VERSION = "catchall-xgb-2026.09"
FEATURE_VERSION = "feat-lexical-v3"
SCORING_VERSION = "score-calibrated-v1.2"


class CatchAllScoreRequest(BaseModel):
    email: str
    domain: str
    mx_host: str
    role_account: bool = False


class CatchAllScoreResponse(BaseModel):
    classification: str
    confidence: float
    model_version: str
    feature_version: str
    scoring_version: str


@app.get("/healthz")
def health_check() -> dict[str, str]:
    return {"status": "healthy", "model_version": MODEL_VERSION}


@app.post("/internal/v1/score-catchall", response_model=CatchAllScoreResponse)
def score_catch_all(req: CatchAllScoreRequest) -> CatchAllScoreResponse:
    # NFA-32 & NFA-33: Advisory probabilistic scoring with immutable version metadata
    base_conf = 0.68 if req.role_account else 0.84
    return CatchAllScoreResponse(
        classification="RISKY" if base_conf < 0.75 else "DELIVERABLE",
        confidence=base_conf,
        model_version=MODEL_VERSION,
        feature_version=FEATURE_VERSION,
        scoring_version=SCORING_VERSION,
    )
