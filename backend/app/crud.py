import uuid
import random

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Bubble, Relation
from app.schemas import BubbleCreate, RelationCreate


async def create_bubble(db: AsyncSession, bubble_data: BubbleCreate):
    new_bubble =  Bubble(
        text=bubble_data.text,
        color=bubble_data.color,
        x=random.uniform(0, 100),
        y=random.uniform(0, 100),
    )
    db.add(new_bubble)
    await db.commit()
    await db.refresh(new_bubble)
    return new_bubble


async def get_bubbles(db: AsyncSession):
    result = await db.execute(select(Bubble))
    return result.scalars().all()


async def get_bubble(db: AsyncSession, bubble_id: uuid.UUID):
    return await db.get(Bubble, bubble_id)


async def update_bubble(
    db: AsyncSession, bubble_id: uuid.UUID, bubble_data: BubbleCreate
):
    bubble = await get_bubble(db, bubble_id)
    if bubble:
        data = bubble_data.dict(exclude_unset=True)
        if "x" not in data or data["x"] is None:
            data["x"] = bubble.x
        if "y" not in data or data["y"] is None:
            data["y"] = bubble.y
        for key, value in data.items():
            setattr(bubble, key, value)
        await db.commit()
        await db.refresh(bubble)
    return bubble



async def delete_bubble(db: AsyncSession, bubble_id: uuid.UUID):
    bubble = await get_bubble(db, bubble_id)
    if bubble:
        await db.delete(bubble)
        await db.commit()
    return bubble


async def create_relation(db: AsyncSession, relation_data: RelationCreate):
    new_relation = Relation(**relation_data.dict())
    db.add(new_relation)
    await db.commit()
    await db.refresh(new_relation)
    return new_relation


async def get_relations(db: AsyncSession):
    result = await db.execute(select(Relation))
    return result.scalars().all()


async def delete_relation(db: AsyncSession, relation_id: uuid.UUID):
    relation = await db.get(Relation, relation_id)
    if relation:
        await db.delete(relation)
        await db.commit()
    return relation
