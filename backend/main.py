from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import ensure_indexes
from routes import items, repairs, analytics

app = FastAPI(title="LifeLedger API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
def startup():
    ensure_indexes()


app.include_router(items.router)
app.include_router(repairs.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {"app": "LifeLedger", "docs": "/docs"}
