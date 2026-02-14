import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const attachToken = (token) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};

export const createUser = (data) => api.post("/api/users/create-user", data);
export const loginUser = (data) => api.post("/api/users/login", data);

export const createReceipt = (data, token) =>
  api.post("/api/receipt/submit", data, attachToken(token));

export const getReceipts = (params = {}, token) =>
  api.get("/api/receipt/all", {
    params,
    ...attachToken(token),
  });

export const getReceiptById = (id, token) =>
  api.get(`/api/receipt/${id}`, attachToken(token));

export const updateReceipt = (id, data, token) =>
  api.patch(`/api/receipt/${id}`, data, attachToken(token));

export const deleteReceipt = (id, token) =>
  api.delete(`/api/receipt/${id}`, attachToken(token));

export const getSettings = (token) => api.get("/api/settings", attachToken(token));
export const addCouncilMember = (data, token) => api.post("/api/settings/council-member", data, attachToken(token));
export const deleteCouncilMember = (idx, token) => api.delete(`/api/settings/council-member/${idx}`, attachToken(token));
export const addAudit = (data, token) => api.post("/api/settings/audit", data, attachToken(token));
export const deleteAudit = (idx, token) => api.delete(`/api/settings/audit/${idx}`, attachToken(token));
export const addUnit = (data, token) => api.post("/api/settings/unit", data, attachToken(token));
export const deleteUnit = (unitName, token) => api.delete(`/api/settings/unit/${unitName}`, attachToken(token));

export default api;