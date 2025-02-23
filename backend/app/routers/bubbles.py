import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

import app.crud as crud
from app.database import get_db
from app.schemas import BubbleCreate, BubbleResponse

router = APIRouter(prefix="/bubbles", tags=["bubbles"])


@router.post("/", response_model=BubbleResponse)
async def add_bubble(bubble: BubbleCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_bubble(db, bubble)


@router.get("/", response_model=list[BubbleResponse])
async def get_all_bubbles(db: AsyncSession = Depends(get_db)):
    return await crud.get_bubbles(db)


@router.get("/{bubble_id}", response_model=BubbleResponse)
async def get_one_bubble(bubble_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await crud.get_bubble(db, bubble_id)


@router.put("/{bubble_id}", response_model=BubbleResponse)
async def update_one_bubble(
    bubble_id: uuid.UUID, bubble: BubbleCreate, db: AsyncSession = Depends(get_db)
):
    return await crud.update_bubble(db, bubble_id, bubble)


@router.delete("/{bubble_id}")
async def delete_one_bubble(bubble_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    await crud.delete_bubble(db, bubble_id)
    return {"message": "Bubble deleted successfully"}
