import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { inr } from "../services/api.js";
import RepairForm from "../components/RepairForm.jsx";

export default function AssetDetails() {
  const { id } = useParams();
  const [a, setA] = useState(null);
  const load = () => api.get(`/items/${id}`).then((r) => setA(r.data));
  useEffect(() => { load(); }, [id]);

  if (!a) return <p>Loading…</p>;

  const delRepair = async (rid) => {
    if (!confirm("Delete this repair record?")) return;
    await api.delete(`/items/${id}/repairs/${rid}`);
    load();
  };
  const row = (k, v) => <div className="kv"><span>{k}</span><b>{v || "—"}</b></div>;

  return (
    <>
      <div className="head">
        <h2>{a.name} <span className={`badge ${a.warrantyStatus}`}>{a.warrantyStatus}</span></h2>
        <Link className="btn ghost" to={`/assets/${id}/edit`}>Edit</Link>
      </div>
      <div className="three">
        <div className="card"><h3>Item</h3>
          {row("Category", a.category)}{row("Brand", a.brand)}{row("Model", a.model)}
          {row("Serial number", a.serialNumber)}{row("Location", a.location)}
        </div>
        <div className="card"><h3>Purchase</h3>
          {row("Date", a.purchase?.date)}{row("Price", inr(a.purchase?.price))}{row("Store", a.purchase?.store)}
          <h3>Warranty</h3>
          {row("Provider", a.warranty?.provider)}{row("Starts", a.warranty?.startDate)}{row("Ends", a.warranty?.endDate)}
        </div>
        <div className="card"><h3>Maintenance</h3>
          {row("Next due", a.maintenance?.nextDue)}
          {row("Interval", a.maintenance?.intervalMonths && `${a.maintenance.intervalMonths} months`)}
          <h3>Total repair cost</h3>
          <p className="big">{inr(a.totalRepairCost)}</p>
        </div>
      </div>

      <h3>Repair history</h3>
      <div className="card tablewrap">
        <table>
          <thead><tr><th>Date</th><th>Repair</th><th>Cost</th><th>Service center</th><th>Notes</th><th></th></tr></thead>
          <tbody>
            {a.repairs.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td><td>{r.type}</td><td>{inr(r.cost)}</td><td>{r.serviceCenter}</td><td>{r.description}</td>
                <td><button className="link danger" onClick={() => delRepair(r.id)}>Delete</button></td>
              </tr>
            ))}
            {a.repairs.length === 0 && <tr><td colSpan="6" className="muted">No repairs recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <h3>Add a repair</h3>
      <RepairForm itemId={id} onAdded={load} />
    </>
  );
}
