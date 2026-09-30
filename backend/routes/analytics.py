from datetime import datetime, timedelta
from fastapi import APIRouter
from database import items, ser

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _window():
    now = datetime.utcnow()
    return now, now + timedelta(days=30)


@router.get("/summary")
def summary():
    now, soon = _window()
    total = list(items.aggregate([
        {"$group": {"_id": None, "count": {"$sum": 1},
                    "totalValue": {"$sum": "$purchase.price"}}}]))
    repair = list(items.aggregate([
        {"$unwind": "$repairs"},
        {"$group": {"_id": None, "totalRepairCost": {"$sum": "$repairs.cost"}}}]))
    w = list(items.aggregate([
        {"$match": {"warranty.endDate": {"$type": "date"}}},
        {"$group": {"_id": None,
            "active": {"$sum": {"$cond": [{"$gt": ["$warranty.endDate", soon]}, 1, 0]}},
            "expiring": {"$sum": {"$cond": [{"$and": [
                {"$gte": ["$warranty.endDate", now]},
                {"$lte": ["$warranty.endDate", soon]}]}, 1, 0]}},
            "expired": {"$sum": {"$cond": [{"$lt": ["$warranty.endDate", now]}, 1, 0]}}}}]))
    t = total[0] if total else {}
    w = w[0] if w else {}
    return {
        "totalItems": t.get("count", 0),
        "totalValue": t.get("totalValue", 0),
        "totalRepairCost": repair[0]["totalRepairCost"] if repair else 0,
        "underWarranty": w.get("active", 0) + w.get("expiring", 0),
        "expiringSoon": w.get("expiring", 0),
        "expired": w.get("expired", 0),
        "active": w.get("active", 0),
        "maintenanceDue": items.count_documents({"maintenance.nextDue": {"$lte": soon}}),
    }


@router.get("/category")
def by_category():
    return [{"category": r["_id"], "count": r["count"], "purchaseValue": r["purchaseValue"]}
            for r in items.aggregate([
                {"$group": {"_id": "$category", "count": {"$sum": 1},
                            "purchaseValue": {"$sum": "$purchase.price"}}},
                {"$sort": {"count": -1}}])]


@router.get("/repairs")
def repairs_by_item():
    return [{"name": r["_id"], "total": r["total"], "count": r["count"]}
            for r in items.aggregate([
                {"$unwind": "$repairs"},
                {"$group": {"_id": "$name", "total": {"$sum": "$repairs.cost"},
                            "count": {"$sum": 1}}},
                {"$sort": {"total": -1}}])]


@router.get("/alerts")
def alerts():
    now, soon = _window()
    warranty = items.find(
        {"warranty.endDate": {"$gte": now, "$lte": soon}}).sort("warranty.endDate", 1)
    maint = items.find({"maintenance.nextDue": {"$lte": soon}}).sort("maintenance.nextDue", 1)

    def row(d, field):
        when = d[field.split(".")[0]][field.split(".")[1]]
        return {"id": str(d["_id"]), "name": d["name"], "date": when.date().isoformat(),
                "daysLeft": (when - now).days}
    return {"warranty": [row(d, "warranty.endDate") for d in warranty],
            "maintenance": [row(d, "maintenance.nextDue") for d in maint]}
