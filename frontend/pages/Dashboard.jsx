import { useEffect, useState, useMemo } from "react";
import { useReceipt } from "../hooks/useReceipts";
import { Link, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BulkDownloadPDF from "../components/BulkDownloadPDF.jsx";

export default function Dashboard() {
  const { fetchReceipts, receipts } = useReceipt();
  const [filters, setFilters] = useState({ date: "", receipt_no: "", name: "", category: "" });
  const [selected, setSelected] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const categoryStats = useMemo(() => {
    const stats = receipts.reduce((acc, curr) => {
      const cat = curr.category || "Uncategorized";
      if (!acc[cat]) {
        acc[cat] = { name: cat, count: 0, total: 0 };
      }
      acc[cat].count += 1;
      acc[cat].total += curr.totalAmount || 0;
      return acc;
    }, {});
    return Object.values(stats);
  }, [receipts]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRowClick = (id) => navigate(`/receipt/${id}`);

  const filteredReceipts = receipts.filter((r) => {
    const matchName = filters.name ? r.name?.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const matchReceiptNo = filters.receipt_no ? r.receipt_no?.toString().includes(filters.receipt_no) : true;
    const matchDate = filters.date ? r.date === filters.date : true;
    const matchCategory = filters.category ? r.category === filters.category : true;

    return matchName && matchReceiptNo && matchDate && matchCategory;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-neutral-900 p-6 flex flex-col items-center text-white gap-8 font-inter">
      {/* --- STATS SECTION --- */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categoryStats.map((cat) => (
          <div
            key={cat.name}
            onClick={() => setFilters({ ...filters, category: cat.name })}
            className={`p-5 rounded-2xl cursor-pointer transition-all border-2 shadow-card flex flex-col gap-1 ${
              filters.category === cat.name ? "border-card bg-button" : "border-transparent bg-button/40 hover:bg-button/60"
            }`}
          >
            <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{cat.name}</span>
            <span className="text-2xl font-bold">{cat.count} <small className="text-sm font-normal">Receipts</small></span>
            <span className="text-green-600 font-semibold text-sm">₱{cat.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <hr className="w-full max-w-5xl border-neutral-800" />

      {/* --- ACTIONS & FILTERS --- */}
      <div className="w-full max-w-5xl flex flex-wrap gap-4 items-center justify-start mx-auto">
        <input
          placeholder="Search Name..."
          className="flex-1 min-w-[150px] px-4 py-2 rounded-xl shadow-card text-sm bg-button text-white placeholder:text-neutral-400 focus:ring-2 ring-card outline-none"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        {/* Added Receipt No filter back */}
        <input
          placeholder="Receipt No"
          className="flex-1 min-w-[120px] px-4 py-2 rounded-xl shadow-card text-sm bg-button text-white placeholder:text-neutral-400 focus:ring-2 ring-card outline-none"
          value={filters.receipt_no}
          onChange={(e) => setFilters({ ...filters, receipt_no: e.target.value })}
        />

        <input
          type="date"
          className="px-4 py-2 rounded-xl shadow-card text-sm bg-button text-white focus:ring-2 ring-card outline-none"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />

        <button
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="px-4 py-2 rounded-xl text-white shadow-card font-bold bg-button hover:bg-neutral-800 text-sm transition-colors"
        >
          {sortOrder === "asc" ? "↑ Oldest" : "↓ Newest"}
        </button>

        <Link
          to="/receipt"
          className="px-4 py-2 rounded-xl text-button shadow-card font-bold bg-card hover:bg-card/80 text-sm transition-colors"
        >
          + Create
        </Link>

        {selected.length > 0 && (
          <PDFDownloadLink
            document={<BulkDownloadPDF receipts={receipts.filter((r) => selected.includes(r._id))} />}
            fileName="selected-receipts.pdf"
            className="px-4 py-2 rounded-xl text-white shadow-card font-bold bg-green-600 hover:bg-green-500 text-sm transition-all"
          >
            {({ loading }) => (loading ? "..." : `PDF (${selected.length})`)}
          </PDFDownloadLink>
        )}

        {/* Clear Filter - Right side end */}
        {filters.category && (
          <button 
            onClick={() => setFilters({ ...filters, category: "" })}
            className="px-4 py-2 rounded-xl text-white shadow-card font-bold bg-red-600/20 border border-red-600/50 hover:bg-red-600 hover:text-white transition-all text-sm flex items-center gap-2 ml-auto"
          >
            <span>✕ Clear {filters.category}</span>
          </button>
        )}
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="w-full max-w-7xl overflow-x-auto mx-auto pb-10">
        <div className="min-w-[1000px] bg-button/20 space-y-2 rounded-2xl p-2">
          <div className="grid grid-cols-12 gap-2 bg-button text-white p-4 font-bold text-xs uppercase tracking-widest rounded-t-xl border-b border-neutral-700">
            <div className="col-span-1 text-center">Select</div>
            <div className="col-span-1 text-left">No.</div>
            <div className="col-span-2 text-left">Council Member</div>
            <div className="col-span-2 text-left">Date</div>
            <div className="col-span-1 text-left">Amount</div>
            <div className="col-span-2 text-left">Certified By</div>
            <div className="col-span-2 text-left">Purpose</div>
            <div className="col-span-1 text-left">Category</div>
          </div>

          {sortedReceipts.length > 0 ? (
            sortedReceipts.map((r) => (
              <div
                key={r._id}
                className="grid grid-cols-12 gap-2 p-4 text-sm items-center bg-button/40 hover:bg-neutral-800 cursor-pointer rounded-lg transition-colors"
                onClick={() => handleRowClick(r._id)}
              >
                <div className="col-span-1 text-center" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(r._id)}
                    onChange={() => toggleSelect(r._id)}
                    className="w-4 h-4 rounded accent-card"
                  />
                </div>
                <div className="col-span-1 text-neutral-400">#{r.receipt_no}</div>
                <div className="col-span-2 text-white font-medium">{r.name}</div>
                <div className="col-span-2 text-neutral-400">{r.date}</div>
                <div className="col-span-1 font-bold text-white">₱{(r.totalAmount || 0).toLocaleString()}</div>
                <div className="col-span-2 text-neutral-300 italic">{r.certifiedBy?.name || "-"}</div>
                <div className="col-span-2 text-neutral-400 truncate">{r.purpose || "-"}</div>
                <div className="col-span-1">
                  <span className="px-2 py-1 bg-neutral-700 rounded-md text-[10px] uppercase font-bold text-neutral-300">
                    {r.category || "Misc"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-neutral-500">
              No receipts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}