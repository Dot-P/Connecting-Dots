from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import bubbles, relations

app = FastAPI(
    title="バブル可視化 API",
    description="バブルの管理と関係性を操作する API",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bubbles.router)
app.include_router(relations.router)
