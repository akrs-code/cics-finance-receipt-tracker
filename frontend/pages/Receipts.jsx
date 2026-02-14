import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceiptForm from "../components/ReceiptForm";
import ReceiptPreview from "../components/ReceiptPreview";
import { useReceipt } from "../hooks/useReceipts";
import { ArrowLeft, AlertCircle } from "lucide-react";

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
    certifiedBy: "",
    semester: "",
    auditBy: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeReceiptData = (newData) => {
    setReceiptData(newData);
    if (error) setError("");
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      if (!receiptData.name || !receiptData.date || !receiptData.receipt_no || !receiptData.items.length || !receiptData.auditBy?.name) {
        throw new Error("VALIDATION FAILED: INCOMPLETE SYSTEM PROTOCOLS");
      }

      const finalData = {
        ...receiptData,
        category: receiptData.category.trim() || "UNCATEGORIZED"
      };

      await addReceipt(finalData);
      navigate("/");
    } catch (err) {
      setError(err.message || "PROTOCOL ERROR: DATA COMMIT FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] p-4 md:p-6 font-inter overflow-hidden text-white antialiased">
      <div className="max-w-400 h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 flex flex-col min-h-0">

          <header className="flex justify-between items-center mb-6 shrink-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-4 py-2.5 rounded-lg bg-transparent border border-neutral-800 text-neutral-400 text-[10px] font-bold uppercase tracking-wider hover:border-neutral-600 hover:text-white transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit to Dashboard
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
            <ReceiptForm data={receiptData} onChange={handleChangeReceiptData} />
          </div>

          <footer className="mt-6 p-6 bg-[#111111] border border-neutral-800 rounded-2xl shrink-0 shadow-2xl">
            {error && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-red-950/20 border border-red-900/50 text-red-500 py-3 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold shadow-xl hover:bg-neutral-200 transition-all text-[11px] uppercase tracking-[0.3em] disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <span className="animate-pulse">Initializing Write...</span>
                ) : (
                  <>
                    Submit Receipt
                  </>
                )}
              </div>
            </button>
          </footer>
        </div>

        <div className="hidden lg:flex lg:col-span-6 h-full min-h-0 flex-col">
          <div className="bg-[#111111] rounded-2xl border border-neutral-800 h-full flex flex-col overflow-hidden shadow-2xl relative">

            <div className="px-6 py-4 border-b border-neutral-800 bg-[#0d0d0d] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center overflow-hidden p-12">
              <div
                className="transition-all duration-500 ease-in-out"
              >
                <ReceiptPreview data={receiptData} />
              </div>
            </div>

            <div className="p-3 border-t border-neutral-800 bg-[#0d0d0d] flex justify-between px-6">
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}