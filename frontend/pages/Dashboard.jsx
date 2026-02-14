import { useEffect, useState, useMemo } from "react";
import { useReceipt } from "../hooks/useReceipts";
import { Link, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BulkDownloadPDF from "../components/BulkDownloadPDF.jsx";
import Modal from "../components/Modal";
import SemesterSelection from "./SemesterSelection"; 
import { Settings as SettingsIcon, Trash2, Search, Download, Plus, Filter, ArrowUpDown, Hash } from "lucide-react";

export default function Dashboard() {
  const { fetchReceipts, receipts, removeReceipt } = useReceipt();
  const [filters, setFilters] = useState({ date: "", receipt_no: "", name: "", category: "", semester: "" });
  const [selected, setSelected] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [paperSize, setPaperSize] = useState("LONG");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchReceipts(); }, []);

  const getSemester = (dateString) => {
    const month = new Date(dateString).getMonth() + 1;
    return (month >= 1 && month <= 6) ? "1st Semester" : "2nd Semester";
  };

  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const matchName = filters.name ? receipt.name?.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const matchReceiptNo = filters.receipt_no ? receipt.receipt_no?.toString().includes(filters.receipt_no) : true;
      const matchCategory = filters.category ? receipt.category === filters.category : true;
      const matchSemester = filters.semester ? getSemester(receipt.date) === filters.semester : true;
      return matchName && matchReceiptNo && matchCategory && matchSemester;
    });
  }, [receipts, filters]);

  const sortedReceipts = useMemo(() => {
    return [...filteredReceipts].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredReceipts, sortOrder]);

  const categoryStats = useMemo(() => {
    const stats = filteredReceipts.reduce((acc, curr) => {
      const category = curr.category || "Uncategorized";
      if (!acc[category]) acc[category] = { name: category, count: 0, total: 0 };
      acc[category].count += 1;
      acc[category].total += curr.totalAmount || 0;
      return acc;
    }, {});
    return Object.values(stats);
  }, [filteredReceipts]);

  const handleSelectAll = (e) => setSelected(e.target.checked ? sortedReceipts.map(r => r._id) : []);
  const toggleSelect = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const openDeleteModal = (e, receipt) => { e.stopPropagation(); setReceiptToDelete(receipt); setIsModalOpen(true); };

  if (!filters.semester) {
    return <SemesterSelection onSelect={(id) => setFilters({ ...filters, semester: id })} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter antialiased p-6 md:p-10 animate-in fade-in duration-500">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          await removeReceipt(receiptToDelete._id);
          setIsModalOpen(false);
        }}
        title={receiptToDelete ? `RECORD #${receiptToDelete.receipt_no}` : ""}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-neutral-700">
                {filters.semester}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Management Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setFilters({ ...filters, semester: "" }); setSelected([]); }}
              className="px-5 py-2.5 rounded-lg text-[11px] font-bold bg-transparent text-neutral-400 hover:text-white transition-all border border-neutral-800 uppercase tracking-wider"
            >
              Switch Period
            </button>
            <Link to="/receipt" className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-bold text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg shadow-white/5">
              <Plus size={16} strokeWidth={3} /> Create Entry
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((category) => (
            <div
              key={category.name}
              onClick={() => setFilters({ ...filters, category: filters.category === category.name ? "" : category.name })}
              className={`p-6 rounded-2xl cursor-pointer transition-all border shadow-2xl group ${filters.category === category.name ? "border-neutral-400 bg-[#1a1a1a]" : "border-neutral-800 bg-[#111111] hover:border-neutral-700"}`}
            >
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-4 group-hover:text-neutral-300">
                {category.name}
              </p>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold tracking-tight text-white">{category.count}</span>
                <span className="text-neutral-400 font-medium text-sm">₱{category.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </section>

        {/* FILTERS SECTION */}
        <section className="bg-[#111111] border border-neutral-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center shadow-2xl">
          <div className="relative flex-1 min-w-62.5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
            <input
              placeholder="SEARCH BY NAME..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-neutral-800 text-[11px] font-bold tracking-wider text-white placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all uppercase"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          <div className="relative w-48">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
            <input
              placeholder="RECORD NO."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-neutral-800 text-[11px] font-bold tracking-wider text-white placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all uppercase"
              value={filters.receipt_no}
              onChange={(e) => setFilters({ ...filters, receipt_no: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              className="h-10 px-4 rounded-lg bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest text-neutral-400 border border-neutral-800 outline-none cursor-pointer hover:border-neutral-700"
            >
              <option value="A4">A4 Format</option>
              <option value="LONG">Long Format</option>
            </select>

            <button
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="h-10 px-4 rounded-lg bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest text-neutral-400 border border-neutral-800 transition-all hover:border-neutral-700 flex items-center gap-2"
            >
              <ArrowUpDown size={14} />
              {sortOrder === "asc" ? "Oldest First" : "Latest First"}
            </button>

            <div className="w-px h-6 bg-neutral-800 mx-2" />

            <Link to="/settings" className="p-2.5 rounded-lg bg-[#0a0a0a] text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-all">
              <SettingsIcon size={18} />
            </Link>

            {selected.length > 0 && (
              <PDFDownloadLink
                document={<BulkDownloadPDF receipts={receipts.filter((r) => selected.includes(r._id))} paperType={paperSize} />}
                fileName={`export_${new Date().getTime()}.pdf`}
                className="flex items-center gap-2 px-5 h-10 rounded-lg bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-lg shadow-white/5"
              >
                <Download size={14} /> Export ({selected.length})
              </PDFDownloadLink>
            )}
          </div>
        </section>

        {/* TABLE SECTION */}
        <section className="bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-neutral-800 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                  <th className="p-5 text-center w-16">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selected.length === sortedReceipts.length && sortedReceipts.length > 0}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 accent-white cursor-pointer"
                    />
                  </th>
                  <th className="p-5">Record No.</th>
                  <th className="p-5">Officer Name</th>
                  <th className="p-5">Process Date</th>
                  <th className="p-5">Total Value</th>
                  <th className="p-5">Classification</th>
                  <th className="p-5 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {sortedReceipts.map((receipt) => (
                  <tr
                    key={receipt._id}
                    onClick={() => navigate(`/receipt/${receipt._id}`)}
                    className="group hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >
                    <td className="p-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(receipt._id)}
                        onChange={() => toggleSelect(receipt._id)}
                        className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 accent-white cursor-pointer"
                      />
                    </td>
                    <td className="p-5 font-mono text-[11px] text-neutral-500">#{receipt.receipt_no}</td>
                    <td className="p-5 font-bold text-[13px] text-neutral-200 uppercase">{receipt.name}</td>
                    <td className="p-5 font-mono text-[11px] text-neutral-500">{receipt.date}</td>
                    <td className="p-5 font-bold text-white tabular-nums">₱{(receipt.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-[#0a0a0a] border border-neutral-800 rounded-md text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                        {receipt.category || "Unclassified"}
                      </span>
                    </td>
                    <td className="p-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => openDeleteModal(e, receipt)} className="flex items-center gap-2 mx-auto px-3 py-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest">
                        <Trash2 size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedReceipts.length === 0 && (
              <div className="py-24 text-center">
                <div className="inline-flex p-4 rounded-full bg-[#0a0a0a] mb-4 text-neutral-700">
                  <Filter size={24} />
                </div>
                <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-[0.3em]">No Records Found in Database</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}