# LifeLedger

### Personal Asset, Warranty & Repair Management System

LifeLedger is a full-stack **MongoDB-based personal asset management system** designed to help users organize their belongings, track purchase and warranty information, maintain repair history, and analyze asset-related expenses.

The project demonstrates practical **Advanced Database Management System (ADBMS)** concepts using MongoDB, including document modeling, embedded documents, arrays, CRUD operations, indexing, compound indexing, date-based queries, and aggregation pipelines.

---

## 🚀 Features

* 📊 **Interactive Dashboard**
  View total assets, asset value, repair expenses, and important alerts.

* 📦 **Asset Management**
  Add, view, update, and delete personal assets.

* 🧾 **Purchase Information**
  Store purchase date, price, store, brand, model, and serial number.

* 🛡️ **Warranty Tracking**
  Maintain warranty provider, start date, and expiry date.

* 🔧 **Repair History**
  Store multiple repair records inside an asset document, including repair date, type, cost, service center, and description.

* ⏰ **Warranty & Maintenance Alerts**
  Identify assets whose warranty or maintenance dates are approaching.

* 📈 **Analytics**
  Analyze asset distribution, total asset value, and repair expenditure using MongoDB aggregation.

* 🔍 **MongoDB Indexing**
  Uses single-field and compound indexes for efficient queries.

* 💻 **Local MongoDB**
  Designed to run with MongoDB Community Server on the local machine.

* 📱 **Responsive Web Interface**
  Built with React for a clean and user-friendly experience.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React Frontend        │
│       Vite + Recharts       │
└──────────────┬──────────────┘
               │ REST API
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
│       Python + PyMongo      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      MongoDB Database       │
│       Local Instance        │
│        LifeLedger           │
└─────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Recharts
* CSS

### Backend

* Python
* FastAPI
* PyMongo
* Pydantic
* Uvicorn

### Database

* MongoDB Community Server
* MongoDB Compass *(optional)*

---

## 🗄️ Database Design

The primary database is:

```text
LifeLedger
```

The main asset collection is:

```text
items
```

An asset document can contain embedded purchase, warranty, maintenance, and repair information.

### Example Document

```javascript
{
  name: "ASUS Vivobook",
  category: "Electronics",
  brand: "ASUS",
  model: "K513EA",
  serialNumber: "ASUS12345",
  location: "Study Room",

  purchase: {
    date: ISODate("2025-08-15"),
    price: 65000,
    store: "Amazon"
  },

  warranty: {
    provider: "ASUS",
    startDate: ISODate("2025-08-15"),
    endDate: ISODate("2027-08-15")
  },

  maintenance: {
    nextDue: ISODate("2026-11-15"),
    intervalMonths: 6
  },

  repairs: [
    {
      date: ISODate("2026-01-12"),
      type: "Keyboard Replacement",
      cost: 2500,
      serviceCenter: "ASUS Service Center",
      description: "Keyboard stopped working"
    }
  ]
}
```

This structure demonstrates MongoDB's ability to store related information using **embedded documents and arrays**.

---

## 📚 ADBMS Concepts Demonstrated

LifeLedger is specifically designed around practical MongoDB and ADBMS concepts.

| Concept            | Implementation                      |
| ------------------ | ----------------------------------- |
| NoSQL Database     | MongoDB                             |
| Document Database  | Asset documents stored as BSON      |
| CRUD Operations    | Create, Read, Update, Delete assets |
| Embedded Documents | Purchase, warranty, maintenance     |
| Arrays             | Embedded repair history             |
| `$push`            | Add repair records                  |
| `$pull`            | Remove repair records               |
| Indexing           | Category and warranty indexes       |
| Compound Indexing  | Category + warranty expiry          |
| Aggregation        | Asset and repair analytics          |
| `$group`           | Group assets and calculate totals   |
| `$unwind`          | Analyze embedded repair records     |
| `$cond`            | Conditional analytics               |
| Date Queries       | Warranty and maintenance alerts     |

---

## 🔎 MongoDB Indexing

LifeLedger creates indexes to improve query performance.

Example:

```javascript
db.items.createIndex({ category: 1 })

db.items.createIndex({
  "warranty.endDate": 1
})

db.items.createIndex({
  category: 1,
  "warranty.endDate": 1
})
```

The project also allows the indexes to be inspected using:

```javascript
db.items.getIndexes()
```

---

## 📊 MongoDB Aggregation

LifeLedger uses MongoDB aggregation pipelines for analytics.

### Total Asset Value

```javascript
db.items.aggregate([
  {
    $group: {
      _id: null,
      totalValue: {
        $sum: "$purchase.price"
      }
    }
  }
])
```

### Assets by Category

```javascript
db.items.aggregate([
  {
    $group: {
      _id: "$category",
      count: {
        $sum: 1
      }
    }
  }
])
```

### Total Repair Cost

```javascript
db.items.aggregate([
  {
    $unwind: "$repairs"
  },
  {
    $group: {
      _id: null,
      totalRepairCost: {
        $sum: "$repairs.cost"
      }
    }
  }
])
```

These aggregation pipelines power the analytics section of the application.

---

## 📁 Project Structure

```text
LifeLedger/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── seed.py
│   ├── requirements.txt
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── item.py
│   │
│   └── routes/
│       ├── __init__.py
│       ├── items.py
│       ├── repairs.py
│       └── analytics.py
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       │
│       ├── components/
│       │   └── RepairForm.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Assets.jsx
│       │   ├── AssetForm.jsx
│       │   ├── AssetDetails.jsx
│       │   ├── Repairs.jsx
│       │   └── Analytics.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       └── styles.css
│
├── report/
├── mongo_queries.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nihalkarkeraa/LifeLedger.git
cd LifeLedger
```

### 2. Start MongoDB

Install **MongoDB Community Server** and make sure the MongoDB service is running.

The application uses:

```text
mongodb://localhost:27017
```

The database will be:

```text
LifeLedger
```

MongoDB Compass can optionally be used to inspect the database.

---

## 🔙 Backend Setup

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

For macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Insert sample data:

```bash
python seed.py
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

Backend API:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  │ Axios / REST API
  ▼
FastAPI
  │
  │ PyMongo
  ▼
MongoDB
  │
  ▼
LifeLedger Database
```

---

## 🧪 Demonstration Workflow

A typical project demonstration can follow this sequence:

1. Open the LifeLedger dashboard.
2. Add a new asset.
3. View the corresponding document in MongoDB Compass.
4. Add a repair record.
5. Show the embedded `repairs` array.
6. Open Analytics.
7. Demonstrate `$unwind` and `$group`.
8. Display MongoDB indexes using `db.items.getIndexes()`.
9. Execute queries from `mongo_queries.js`.

---

## 🎯 Project Objectives

The main objectives of LifeLedger are to:

* Demonstrate practical MongoDB database design.
* Implement a complete CRUD-based application.
* Demonstrate embedded document modeling.
* Work with arrays and nested documents.
* Implement MongoDB indexing and compound indexing.
* Use aggregation pipelines for meaningful analytics.
* Connect a modern frontend with a Python REST backend.
* Build a practical application around a real-world asset-management problem.

---

## 🔮 Future Enhancements

Potential future improvements include:

* QR-based asset identification
* User authentication
* Cloud database support
* Mobile application
* Automated notifications
* Advanced reporting
* Exporting asset records

These features are outside the current core implementation and can be added independently.

---

## 🎓 Academic Context

**Project:** LifeLedger
**Subject:** Advanced Database Management Systems (ADBMS)
**Database:** MongoDB
**Architecture:** React → FastAPI → PyMongo → MongoDB
**Project Type:** Full-Stack NoSQL Database Application

---

## 👨‍💻 Author

**Nihal Karkera**

B.Tech – Artificial Intelligence & Machine Learning
Srinivas University Institute of Engineering & Technology
Mangalore, Karnataka, India

---

## 📄 License

This project is developed for **academic and educational purposes**.

---

⭐ If you find this project useful, consider giving the repository a star.
