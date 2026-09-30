import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api, { inr } from "../services/api.js";

export const COLORS = ["#1f6f5c", "#b8892b", "#3b5b8c", "#a3473d", "#6b7a72"];

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [cat, setCat] = useState([]);
  const [al, setAl] = useState({ warranty: [], maintenance: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/analytics/summary"), api.get("/analytics/category"), api.get("/analytics/alerts")])
      .then(([a, b, c]) => { setS(a.data); setCat(b.data); setAl(c.data); })
      .catch(() => setError("Cannot reach the API. Start the backend on port 8000."));
  }, []);

  if (error) return <p className="err">{error}</p>;
  if (!s) return <p>Loading…</p>;

  const stats = [
    ["Total items", s.totalItems],
    ["Purchase value", inr(s.totalValue)],
    ["Repair spend", inr(s.totalRepairCost)],
    ["Under warranty", s.underWarranty],
    ["Expired warranties", s.expired],
    ["Maintenance due", s.maintenanceDue],
  ];
  const expense = cat.map((c) => ({ name: c.category, Purchases: c.purchaseValue }));

  return (
    <>
      <h2>Dashboard</h2>
      <div className="stats">
        {stats.map(([l, v]) => (
          <div className="stat card" key={l}><span>{l}</span><b>{v}</b></div>
        ))}
      </div>
      <div className="two">
        <div className="card">
          <h3>Items by category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={cat} dataKey="count" nameKey="category" outerRadius={90} label>
                {cat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend /><Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Purchase spend by category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={expense}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis />
              <Tooltip formatter={(v) => inr(v)} />
              <Bar dataKey="Purchases" fill="#1f6f5c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="two">
        <AlertList title="Warranty alerts" rows={al.warranty} verb="expires" />
        <AlertList title="Maintenance alerts" rows={al.maintenance} verb="due" />
      </div>
    </>
  );
}

function AlertList({ title, rows, verb }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {rows.length === 0 && <p className="muted">Nothing needs attention in the next 30 days.</p>}
      {rows.map((r) => (
        <Link className="alert" key={r.id + verb} to={`/assets/${r.id}`}>
          <span>{r.name} {verb} {r.date}</span>
          <b className={r.daysLeft < 0 ? "bad" : "warn"}>
            {r.daysLeft < 0 ? `${-r.daysLeft} days overdue` : `${r.daysLeft} days left`}
          </b>
        </Link>
      ))}
    </div>
  );
}
