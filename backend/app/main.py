from fastapi import FastAPI

from app.routers import bubbles, relations

app = FastAPI(
    title="バブル可視化 API",
    description="バブルの管理と関係性を操作する API",
    version="1.0.0",
)

app.include_router(bubbles.router)
app.include_router(relations.router)
