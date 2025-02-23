import uuid
from datetime import datetime

from pydantic import BaseModel


class BubbleBase(BaseModel):
    text: str
    color: str


class BubbleCreate(BubbleBase):
    pass


class BubbleResponse(BubbleBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class RelationBase(BaseModel):
    bubble1_id: uuid.UUID
    bubble2_id: uuid.UUID


class RelationCreate(RelationBase):
    pass


class RelationResponse(RelationBase):
    id: uuid.UUID

    class Config:
        from_attributes = True
