import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceiptForm from "../components/ReceiptForm";
import ReceiptPreview from "../components/ReceiptPreview";
import { useReceipt } from "../hooks/useReceipts";

export default function Receipts() {
  const navigate = useNavigate(); 
  const { addReceipt } = useReceipt();

  const [receiptData, setReceiptData] = useState({
    name: "",
    position: "",
    date: "",
    receipt_no: "",
    purpose: "",
    items: [],
    certifiedBy: { name: "" },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeReceiptData = (newData) => {
    setReceiptData(newData);
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      if (
        !receiptData.name ||
        !receiptData.position ||
        !receiptData.date ||
        !receiptData.receipt_no ||
        !receiptData.items.length ||
        !receiptData.purpose
      ) {
        setError(
          "Please fill out all required fields and add at least one item."
        );
        setLoading(false);
        return;
      }

      await addReceipt(receiptData);

      setReceiptData({
        name: "",
        position: "",
        date: "",
        receipt_no: "",
        purpose: "",
        items: [],
        certifiedBy: { name: "" },
      });

      alert("Receipt saved successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 w-full space-y-4 sticky top-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-4 px-4 py-2 rounded-xl bg-card text-button font-inter font-semibold hover:opacity-90 text-sm"
          >
            &larr; Go Back
          </button>

          <ReceiptForm data={receiptData} onChange={handleChangeReceiptData} />

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-4 bg-card text-button font-inter py-3 rounded-xl font-semibold hover:opacity-90 text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Receipt"}
          </button>

          {error && (
            <div className="mt-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 font-inter text-sm text-center">
              {error}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 w-full">
          <div className="bg-neutral-800 rounded-3xl shadow-xl border border-neutral-700 lg:h-[77vh] flex flex-col">
            <div className="flex-1 rounded-2xl overflow-hidden">
              <ReceiptPreview data={receiptData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
