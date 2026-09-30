import { useState } from "react";
import api from "../services/api.js";

const empty = { date: "", type: "", cost: "", serviceCenter: "", description: "" };

export default function RepairForm({ itemId, assets, onAdded }) {
  const [f, setF] = useState(empty);
  const [target, setTarget] = useState(itemId || "");
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!target) return setErr("Choose the asset this repair belongs to.");
    try {
      await api.post(`/items/${target}/repairs`, { ...f, cost: Number(f.cost) });
      setF(empty);
      onAdded();
    } catch {
      setErr("Could not save the repair. Check the date and cost.");
    }
  };

  return (
    <form className="card grid" onSubmit={submit}>
      {assets && (
        <label className="wide">Asset
          <select value={target} onChange={(e) => setTarget(e.target.value)} required>
            <option value="">Select an asset</option>
            {assets.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
      )}
      <label>Date<input type="date" value={f.date} onChange={set("date")} required /></label>
      <label>Repair type<input value={f.type} onChange={set("type")} required placeholder="Keyboard replacement" /></label>
      <label>Cost (₹)<input type="number" min="0" value={f.cost} onChange={set("cost")} required /></label>
      <label>Service center<input value={f.serviceCenter} onChange={set("serviceCenter")} /></label>
      <label className="wide">Description<input value={f.description} onChange={set("description")} /></label>
      {err && <p className="err wide">{err}</p>}
      <button className="btn wide">Add repair</button>
    </form>
  );
}
