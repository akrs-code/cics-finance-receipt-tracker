import { createContext, useState } from "react";
import {
  createReceipt,
  getReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
} from "../api/api";

export const ReceiptContext = createContext(null);

export const ReceiptProvider = ({ children }) => {
  const token = localStorage.getItem("token");

  const [receipts, setReceipts] = useState([]);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const fetchReceipts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReceipts(filters, token);
      setReceipts(res.data.receipts);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiptById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReceiptById(id, token);
      setCurrentReceipt(res.data.receipt);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch receipt");
    } finally {
      setLoading(false);
    }
  };

  const addReceipt = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createReceipt(data, token);
      setReceipts((prev) => [res.data.receipt, ...prev]);
      return res.data.receipt;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create receipt");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editReceipt = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateReceipt(id, data, token);
      setReceipts((prev) =>
        prev.map((r) => (r._id === id ? res.data.receipt : r))
      );
      return res.data.receipt;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update receipt");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeReceipt = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteReceipt(id, token);
      setReceipts((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete receipt");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceiptContext.Provider
      value={{
        receipts,
        currentReceipt,
        loading,
        error,
        fetchReceipts,
        fetchReceiptById,
        addReceipt,
        editReceipt,
        removeReceipt,
      }}
    >
      {children}
    </ReceiptContext.Provider>
  );
};
