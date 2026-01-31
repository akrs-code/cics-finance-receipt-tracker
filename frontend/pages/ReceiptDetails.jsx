import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useReceipt } from "../hooks/useReceipts";
import ReceiptPreview from "../components/ReceiptPreview";

export default function ReceiptDetails() {
  const { id } = useParams();
  const { fetchReceiptById, currentReceipt, loading, error } = useReceipt();

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
    <div className="bg-neutral-900 min-h-screen p-6">
      <ReceiptPreview data={currentReceipt} />
    </div>
  );
}
