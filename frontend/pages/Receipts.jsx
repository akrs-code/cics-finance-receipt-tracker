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
    category: "",
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
      if (!receiptData.name || !receiptData.position || !receiptData.date || !receiptData.receipt_no || !receiptData.items.length || !receiptData.purpose) {
        setError("Missing required fields.");
        setLoading(false);
        return;
      }

      const finalData = {
        ...receiptData,
        category: receiptData.category.trim() || "Uncategorized"
      };

      await addReceipt(finalData);
      alert("Receipt saved!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-neutral-900 p-4 lg:p-6 font-inter overflow-hidden">
      <div className="max-w-400 h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 h-full flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-1.5 rounded-lg bg-button text-white text-[11px] font-bold shadow-card hover:bg-neutral-800 transition-all uppercase tracking-wider"
            >
              &larr; Dashboard
            </button>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Editor</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            <ReceiptForm data={receiptData} onChange={handleChangeReceiptData} />
          </div>

          <div className="pt-4 shrink-0">
            {error && (
              <div className="mb-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 py-2 text-[10px] text-center font-bold uppercase">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-card text-button py-3 rounded-xl font-bold shadow-card hover:bg-card/80 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 h-full min-h-0">
          <div className="bg-button/10 rounded-3xl shadow-card border border-neutral-800 h-full flex flex-col overflow-hidden">
            <div className="p-3 border-b border-neutral-800 bg-button/30 flex justify-between items-center shrink-0">
              <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-2">Live Receipt Preview</h2>
              <div className="flex gap-1.5 pr-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </div>
    
            <div className="flex-1 overflow-y-auto bg-neutral-800/50 custom-scrollbar p-4">
              <div className="max-w-150 mx-auto origin-top transform scale-[0.95] lg:scale-100">
                <ReceiptPreview data={receiptData} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}