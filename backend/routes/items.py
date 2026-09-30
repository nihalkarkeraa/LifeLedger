import re
from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from database import items, ser, to_dt, warranty_status
from models.item import ItemIn

router = APIRouter(prefix="/items", tags=["items"])


def oid(item_id: str):
    try:
        return ObjectId(item_id)
    except Exception:
        raise HTTPException(400, "Invalid item id")


def decorate(doc):
    d = ser(doc)
    d["warrantyStatus"] = warranty_status(doc)
    d["totalRepairCost"] = sum(r.get("cost", 0) for r in doc.get("repairs", []))
    return d


@router.get("")
def list_items(q: str = "", category: str = ""):
    flt = {}
    if category:
        flt["category"] = category
    if q:
        rx = {"$regex": re.escape(q), "$options": "i"}
        flt["$or"] = [{"name": rx}, {"brand": rx}, {"model": rx}]
    return [decorate(d) for d in items.find(flt).sort("createdAt", -1)]


@router.get("/{item_id}")
def get_item(item_id: str):
    doc = items.find_one({"_id": oid(item_id)})
    if not doc:
        raise HTTPException(404, "Item not found")
    return decorate(doc)


@router.post("", status_code=201)
def create_item(body: ItemIn):
    doc = to_dt(body.model_dump())
    doc["repairs"] = []
    doc["createdAt"] = datetime.utcnow()
    res = items.insert_one(doc)
    return {"id": str(res.inserted_id)}


@router.put("/{item_id}")
def update_item(item_id: str, body: ItemIn):
    res = items.update_one({"_id": oid(item_id)}, {"$set": to_dt(body.model_dump())})
    if res.matched_count == 0:
        raise HTTPException(404, "Item not found")
    return {"updated": True}


@router.delete("/{item_id}")
def delete_item(item_id: str):
    res = items.delete_one({"_id": oid(item_id)})
    if res.deleted_count == 0:
        raise HTTPException(404, "Item not found")
    return {"deleted": True}
