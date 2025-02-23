import uuid

from sqlalchemy import TIMESTAMP, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database import Base


class Bubble(Base):
    __tablename__ = "bubbles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(String, nullable=False)
    color = Column(String, default="#999999")
    created_at = Column(TIMESTAMP, server_default=func.now())


class Relation(Base):
    __tablename__ = "relations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bubble1_id = Column(
        UUID(as_uuid=True), ForeignKey("bubbles.id", ondelete="CASCADE"), nullable=False
    )
    bubble2_id = Column(
        UUID(as_uuid=True), ForeignKey("bubbles.id", ondelete="CASCADE"), nullable=False
    )
