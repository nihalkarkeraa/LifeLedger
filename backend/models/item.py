from datetime import date as Date
from typing import Optional
from pydantic import BaseModel


class Purchase(BaseModel):
    date: Optional[Date] = None
    price: float = 0
    store: str = ""


class Warranty(BaseModel):
    provider: str = ""
    startDate: Optional[Date] = None
    endDate: Optional[Date] = None


class Maintenance(BaseModel):
    nextDue: Optional[Date] = None
    intervalMonths: Optional[int] = None


class ItemIn(BaseModel):
    name: str
    category: str
    brand: str = ""
    model: str = ""
    serialNumber: str = ""
    location: str = ""
    purchase: Purchase = Purchase()
    warranty: Warranty = Warranty()
    maintenance: Maintenance = Maintenance()


class RepairIn(BaseModel):
    date: Date
    type: str
    cost: float
    serviceCenter: str = ""
    description: str = ""
