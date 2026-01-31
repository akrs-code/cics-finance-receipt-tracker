import { useContext } from "react";
import { ReceiptContext } from "../context/ReceiptContext.jsx";

export const useReceipt = () => {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error("useReceipt must be used inside a ReceiptProvider");
  }
  return context;
};
