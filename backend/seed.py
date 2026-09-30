"""Run once:  python seed.py   (wipes and reloads sample data)"""
from datetime import datetime, timedelta
from bson import ObjectId
from database import items, users, ensure_indexes

now = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
d = lambda days: now + timedelta(days=days)


def make(name, cat, brand, model, serial, loc, pdate, price, store, prov, wstart, wend, nxt, months, repairs=()):
    return {"name": name, "category": cat, "brand": brand, "model": model, "serialNumber": serial,
            "location": loc, "purchase": {"date": pdate, "price": price, "store": store},
            "warranty": {"provider": prov, "startDate": wstart, "endDate": wend},
            "maintenance": {"nextDue": nxt, "intervalMonths": months},
            "repairs": [dict(r, _id=ObjectId()) for r in repairs], "createdAt": now}


data = [
    make("ASUS Vivobook", "Electronics", "ASUS", "K513EA", "ASUS12345", "Study Room", d(-400), 65000,
         "Amazon", "ASUS", d(-400), d(330), d(45), 6,
         [{"date": d(-260), "type": "Keyboard Replacement", "cost": 2500,
           "serviceCenter": "ASUS Service Center", "description": "Keyboard stopped working"}]),
    make("iPhone 14", "Electronics", "Apple", "A2882", "IP14-778", "Bedroom", d(-300), 55000,
         "Apple Store", "Apple", d(-300), d(430), d(90), 12,
         [{"date": d(-120), "type": "Screen Replacement", "cost": 4000,
           "serviceCenter": "Apple Care", "description": "Cracked display"}]),
    make("Samsung Refrigerator", "Appliances", "Samsung", "RT34", "SAM-RF-01", "Kitchen", d(-500), 42000,
         "Croma", "Samsung", d(-500), d(600), d(-5), 12,
         [{"date": d(-90), "type": "Compressor Service", "cost": 1500,
           "serviceCenter": "Samsung Care", "description": "Cooling issue"}]),
    make("Sony Headphones", "Electronics", "Sony", "WH-1000XM4", "SONY-4421", "Study Room", d(-335), 4000,
         "Flipkart", "Sony", d(-335), d(18), d(120), 12),
    make("Honda Activa", "Vehicles", "Honda", "Activa 6G", "KA19-2211", "Garage", d(-700), 15000,
         "Honda Showroom", "Honda", d(-700), d(-10), d(20), 3),
    make("Titan Watch", "Other", "Titan", "Edge", "TT-9081", "Bedroom", d(-900), 9000,
         "Titan World", "Titan", d(-900), d(-100), None, None),
]
items.delete_many({})
users.delete_many({})
items.insert_many(data)
users.insert_one({"name": "Demo User", "email": "demo@lifeledger.local", "createdAt": now})
ensure_indexes()
print(f"Seeded {len(data)} items.")
