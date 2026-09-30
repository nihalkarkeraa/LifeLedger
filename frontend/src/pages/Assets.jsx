import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { inr } from "../services/api.js";

const CATS = ["Electronics", "Appliances", "Vehicles", "Furniture", "Other"];

export default function Assets() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const load = () =>
    api.get("/items", { params: { q, category } }).then((r) => setRows(r.data));
  useEffect(() => { load(); }, [q, category]);

  const remove = async (a) => {
    if (!confirm(`Delete "${a.name}" and its repair history?`)) return;
    await api.delete(`/items/${a.id}`);
    load();
  };

  return (
    <>
      <div className="head">
        <h2>My assets</h2>
        <Link className="btn" to="/assets/new">Add asset</Link>
      </div>
      <div className="filters">
        <input placeholder="Search by name, brand or model" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="card tablewrap">
        <table>
          <thead><tr><th>Item</th><th>Category</th><th>Purchase price</th><th>Warranty ends</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.category}</td>
                <td>{inr(a.purchase?.price)}</td>
                <td>{a.warranty?.endDate || "—"}</td>
                <td><span className={`badge ${a.warrantyStatus}`}>{a.warrantyStatus}</span></td>
                <td className="actions">
                  <Link to={`/assets/${a.id}`}>View</Link>
                  <Link to={`/assets/${a.id}/edit`}>Edit</Link>
                  <button className="link danger" onClick={() => remove(a)}>Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="6" className="muted">No assets match. Add your first one.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
