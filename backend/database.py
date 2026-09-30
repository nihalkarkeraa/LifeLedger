from datetime import datetime, date, timedelta
from bson import ObjectId
from pymongo import MongoClient, ASCENDING

client = MongoClient("mongodb://localhost:27017")
db = client["LifeLedger"]
items = db["items"]
users = db["users"]


def ensure_indexes():
    items.create_index([("category", ASCENDING)])
    items.create_index([("warranty.endDate", ASCENDING)])
    items.create_index([("category", ASCENDING), ("warranty.endDate", ASCENDING)])
    items.create_index([("maintenance.nextDue", ASCENDING)])


def to_dt(obj):
    """Recursively turn python dates into datetimes (BSON cannot store plain date)."""
    if isinstance(obj, dict):
        return {k: to_dt(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_dt(v) for v in obj]
    if isinstance(obj, date) and not isinstance(obj, datetime):
        return datetime(obj.year, obj.month, obj.day)
    return obj


def ser(obj):
    """Recursively make Mongo documents JSON friendly."""
    if isinstance(obj, dict):
        return {("id" if k == "_id" else k): ser(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [ser(v) for v in obj]
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.date().isoformat()
    return obj


def warranty_status(item):
    end = (item.get("warranty") or {}).get("endDate")
    if not end:
        return "None"
    now = datetime.utcnow()
    if end < now:
        return "Expired"
    if end <= now + timedelta(days=30):
        return "Expiring"
    return "Active"
