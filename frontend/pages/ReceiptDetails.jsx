import { useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useReceipt } from "../hooks/useReceipts";
import ReceiptPreview from "../components/ReceiptPreview";
import { ArrowLeft } from "lucide-react";

export default function ReceiptDetails() {
  const { id } = useParams();
  const { fetchReceiptById, currentReceipt, loading, error } = useReceipt();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchReceiptById(id);
  }, [id]);

  if (!id) return <Navigate to="/dashboard" replace />;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        Loading receipt...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-red-400">
        {error}
      </div>
    );

  if (!currentReceipt)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-400">
        Receipt not found
      </div>
    );

  return (
    <div className="bg-neutral-900 min-h-screen relative flex items-center justify-center p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 group px-4 py-2.5 rounded-lg bg-transparent border border-neutral-800 text-neutral-400 text-[10px] font-bold uppercase tracking-wider hover:border-neutral-600 hover:text-white transition-all flex items-center gap-2"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit
      </button>
    
      <ReceiptPreview data={currentReceipt} />
    </div>
  );
}