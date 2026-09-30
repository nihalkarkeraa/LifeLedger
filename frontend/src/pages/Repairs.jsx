import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { inr } from "../services/api.js";
import RepairForm from "../components/RepairForm.jsx";

export default function Repairs() {
  const [assets, setAssets] = useState([]);
  const [rows, setRows] = useState([]);
  const load = () => {
    api.get("/items").then((r) => setAssets(r.data));
    api.get("/repairs").then((r) => setRows(r.data));
  };
  useEffect(() => { load(); }, []);

  return (
    <>
      <h2>Repair history</h2>
      <RepairForm assets={assets} onAdded={load} />
      <div className="card tablewrap" style={{ marginTop: 20 }}>
        <table>
          <thead><tr><th>Date</th><th>Asset</th><th>Repair</th><th>Cost</th><th>Service center</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.repair.id}>
                <td>{r.repair.date}</td>
                <td><Link to={`/assets/${r.itemId}`}>{r.itemName}</Link></td>
                <td>{r.repair.type}</td><td>{inr(r.repair.cost)}</td><td>{r.repair.serviceCenter}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="5" className="muted">No repairs yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
