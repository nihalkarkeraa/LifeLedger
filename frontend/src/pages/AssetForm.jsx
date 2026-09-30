import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

const CATS = ["Electronics", "Appliances", "Vehicles", "Furniture", "Other"];
const blank = {
  name: "", category: "Electronics", brand: "", model: "", serialNumber: "", location: "",
  pDate: "", price: "", store: "", provider: "", wStart: "", wEnd: "", nextDue: "", interval: "",
};

export default function AssetForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (!id) { setF(blank); return; }
    api.get(`/items/${id}`).then(({ data: a }) =>
      setF({
        name: a.name, category: a.category, brand: a.brand || "", model: a.model || "",
        serialNumber: a.serialNumber || "", location: a.location || "",
        pDate: a.purchase?.date || "", price: a.purchase?.price ?? "", store: a.purchase?.store || "",
        provider: a.warranty?.provider || "", wStart: a.warranty?.startDate || "", wEnd: a.warranty?.endDate || "",
        nextDue: a.maintenance?.nextDue || "", interval: a.maintenance?.intervalMonths ?? "",
      }));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      name: f.name, category: f.category, brand: f.brand, model: f.model,
      serialNumber: f.serialNumber, location: f.location,
      purchase: { date: f.pDate || null, price: Number(f.price || 0), store: f.store },
      warranty: { provider: f.provider, startDate: f.wStart || null, endDate: f.wEnd || null },
      maintenance: { nextDue: f.nextDue || null, intervalMonths: f.interval ? Number(f.interval) : null },
    };
    try {
      if (id) { await api.put(`/items/${id}`, body); nav(`/assets/${id}`); }
      else { const r = await api.post("/items", body); nav(`/assets/${r.data.id}`); }
    } catch {
      setErr("Could not save the asset. Check the required fields.");
    }
  };

  const T = (label, k, type = "text", extra = {}) => (
    <label>{label}<input type={type} value={f[k]} onChange={set(k)} {...extra} /></label>
  );

  return (
    <form onSubmit={submit}>
      <h2>{id ? "Edit asset" : "Add asset"}</h2>
      <fieldset className="card grid"><legend>Basic details</legend>
        {T("Item name", "name", "text", { required: true })}
        <label>Category
          <select value={f.category} onChange={set("category")}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        {T("Brand", "brand")}{T("Model", "model")}{T("Serial number", "serialNumber")}{T("Location", "location")}
      </fieldset>
      <fieldset className="card grid"><legend>Purchase</legend>
        {T("Purchase date", "pDate", "date")}{T("Purchase price (₹)", "price", "number", { min: 0 })}{T("Store", "store")}
      </fieldset>
      <fieldset className="card grid"><legend>Warranty</legend>
        {T("Warranty provider", "provider")}{T("Warranty start", "wStart", "date")}{T("Warranty end", "wEnd", "date")}
      </fieldset>
      <fieldset className="card grid"><legend>Maintenance</legend>
        {T("Next maintenance date", "nextDue", "date")}{T("Interval (months)", "interval", "number", { min: 1 })}
      </fieldset>
      {err && <p className="err">{err}</p>}
      <button className="btn">{id ? "Save changes" : "Add asset"}</button>
    </form>
  );
}
