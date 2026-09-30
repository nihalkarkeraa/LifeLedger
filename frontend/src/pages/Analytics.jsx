import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api, { inr } from "../services/api.js";
import { COLORS } from "./Dashboard.jsx";

export default function Analytics() {
  const [cat, setCat] = useState([]);
  const [rep, setRep] = useState([]);
  const [s, setS] = useState(null);
  useEffect(() => {
    api.get("/analytics/category").then((r) => setCat(r.data));
    api.get("/analytics/repairs").then((r) => setRep(r.data));
    api.get("/analytics/summary").then((r) => setS(r.data));
  }, []);

  const warranty = s
    ? [{ name: "Active", value: s.active }, { name: "Expiring soon", value: s.expiringSoon }, { name: "Expired", value: s.expired }]
    : [];
  const wColors = ["#1f6f5c", "#b8892b", "#a3473d"];

  return (
    <>
      <h2>Analytics</h2>
      <p className="muted">Every figure below comes from a MongoDB aggregation pipeline.</p>
      <div className="two">
        <div className="card"><h3>Category distribution ($group)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={cat} dataKey="count" nameKey="category" outerRadius={90} label>
              {cat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Legend /><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card"><h3>Purchase expenditure by category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cat}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" /><YAxis />
              <Tooltip formatter={(v) => inr(v)} /><Bar dataKey="purchaseValue" name="Purchases" fill="#3b5b8c" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card"><h3>Repair expenditure by item ($unwind + $group)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rep}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis />
              <Tooltip formatter={(v) => inr(v)} /><Bar dataKey="total" name="Repairs" fill="#b8892b" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card"><h3>Warranty status (date query)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={warranty} dataKey="value" nameKey="name" outerRadius={90} label>
              {warranty.map((_, i) => <Cell key={i} fill={wColors[i]} />)}</Pie><Legend /><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
