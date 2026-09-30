from bson import ObjectId
from fastapi import APIRouter, HTTPException
from database import items, ser, to_dt
from models.item import RepairIn
from routes.items import oid

router = APIRouter(tags=["repairs"])


@router.get("/repairs")
def all_repairs():
    """Every repair across all assets, flattened with $unwind."""
    pipeline = [
        {"$unwind": "$repairs"},
        {"$sort": {"repairs.date": -1}},
        {"$project": {"itemId": "$_id", "itemName": "$name", "repair": "$repairs", "_id": 0}},
    ]
    return [ser(r) for r in items.aggregate(pipeline)]


@router.post("/items/{item_id}/repairs", status_code=201)
def add_repair(item_id: str, body: RepairIn):
    repair = to_dt(body.model_dump())
    repair["_id"] = ObjectId()
    res = items.update_one({"_id": oid(item_id)}, {"$push": {"repairs": repair}})
    if res.matched_count == 0:
        raise HTTPException(404, "Item not found")
    return {"id": str(repair["_id"])}


@router.delete("/items/{item_id}/repairs/{repair_id}")
def delete_repair(item_id: str, repair_id: str):
    res = items.update_one(
        {"_id": oid(item_id)}, {"$pull": {"repairs": {"_id": oid(repair_id)}}}
    )
    if res.matched_count == 0:
        raise HTTPException(404, "Item not found")
    return {"deleted": True}
