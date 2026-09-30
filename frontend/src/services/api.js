import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
export default api;
