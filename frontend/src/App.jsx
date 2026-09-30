import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Assets from "./pages/Assets.jsx";
import AssetForm from "./pages/AssetForm.jsx";
import AssetDetails from "./pages/AssetDetails.jsx";
import Repairs from "./pages/Repairs.jsx";
import Analytics from "./pages/Analytics.jsx";

const links = [
  ["/", "Dashboard"],
  ["/assets", "My assets"],
  ["/assets/new", "Add asset"],
  ["/repairs", "Repair history"],
  ["/analytics", "Analytics"],
];

export default function App() {
  return (
    <div className="shell">
      <aside className="side">
        <h1>LifeLedger</h1>
        <p className="tag">Everything you own, on the record.</p>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end>{label}</NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/new" element={<AssetForm />} />
          <Route path="/assets/:id" element={<AssetDetails />} />
          <Route path="/assets/:id/edit" element={<AssetForm />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
}
