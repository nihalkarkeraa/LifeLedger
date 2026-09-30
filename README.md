# LifeLedger — Personal Asset, Warranty & Repair Management (MongoDB)

Stack: React (Vite) -> FastAPI -> PyMongo -> MongoDB Community (localhost:27017), database `LifeLedger`.

## Run it
1. Install and start MongoDB Community Server (Compass optional).
2. Backend (Terminal 1):
       cd backend
       python -m venv venv
       venv\Scripts\activate          (Mac/Linux: source venv/bin/activate)
       pip install -r requirements.txt
       python seed.py                 (sample data + indexes)
       uvicorn main:app --reload --port 8000
   API docs: http://localhost:8000/docs
3. Frontend (Terminal 2):
       cd frontend
       npm install
       npm run dev
   Open http://localhost:5173

## Faculty demo order
Dashboard -> Add asset (ASUS Vivobook) -> show document in Compass -> add Rs 2,500 keyboard repair ->
Asset details (embedded repairs[]) -> Analytics ($unwind + $group) -> db.items.getIndexes() ->
run a query from mongo_queries.js.

## Where each ADBMS concept lives
- Embedded documents / arrays: models/item.py, routes/items.py, routes/repairs.py ($push, $pull)
- Indexes + compound index: database.py -> ensure_indexes()
- Aggregation ($group, $unwind, $cond): routes/analytics.py
- Date queries: /analytics/alerts (warranty and maintenance within 30 days)
