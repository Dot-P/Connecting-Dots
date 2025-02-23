import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

import app.crud as crud
from app.database import get_db
from app.schemas import RelationCreate, RelationResponse

router = APIRouter(prefix="/relations", tags=["relations"])


@router.post("/", response_model=RelationResponse)
async def add_relation(relation: RelationCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_relation(db, relation)


@router.get("/", response_model=list[RelationResponse])
async def get_all_relations(db: AsyncSession = Depends(get_db)):
    return await crud.get_relations(db)


@router.delete("/{relation_id}")
async def delete_one_relation(
    relation_id: uuid.UUID, db: AsyncSession = Depends(get_db)
):
    await crud.delete_relation(db, relation_id)
    return {"message": "Relation deleted successfully"}
