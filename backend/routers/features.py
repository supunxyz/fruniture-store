from fastapi import APIRouter
from services import feature_service

router = APIRouter(
    prefix="/api/features",
    tags=["features"]
)

@router.get("/")
def get_features():
    return feature_service.get_features()
