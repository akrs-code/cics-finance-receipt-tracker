import { useEffect, useState } from "react";
import { useReceipt } from "../hooks/useReceipts";
import { Link, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BulkDownloadPDF from "../components/BulkDownloadPDF.jsx";

export default function Dashboard() {
  const { fetchReceipts, receipts } = useReceipt();
  const [filters, setFilters] = useState({ date: "", receipt_no: "", name: "" });
  const [selected, setSelected] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleRowClick = (id) => navigate(`/receipt/${id}`);

  const filteredReceipts = receipts.filter((r) => {
    const matchName = filters.name
      ? r.name?.toLowerCase().includes(filters.name.toLowerCase())
      : true;

    const matchReceiptNo = filters.receipt_no
      ? r.receipt_no?.toString().includes(filters.receipt_no)
      : true;

    const matchDate = filters.date
      ? r.date === filters.date
      : true;

    return matchName && matchReceiptNo && matchDate;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-neutral-900 p-6 flex flex-col items-center text-white gap-6">
      <div className="w-full max-w-5xl flex flex-wrap gap-4 items-center justify-start mx-auto">
        <input
          placeholder="Name"
          className="flex-1 min-w-37.5 px-4 py-2 rounded-xl font-inter shadow-card text-sm bg-button text-white placeholder:text-neutral-400"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <input
          placeholder="Receipt No"
          className="flex-1 min-w-37.5 px-4 py-2 rounded-xl font-inter shadow-card text-sm bg-button text-white placeholder:text-neutral-400"
          value={filters.receipt_no}
          onChange={(e) =>
            setFilters({ ...filters, receipt_no: e.target.value })
          }
        />

        <input
          type="date"
          className="flex-1 min-w-37.5 px-4 py-2 rounded-xl font-inter shadow-card text-sm bg-button text-white placeholder:text-neutral-400"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />

        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-4 py-2 rounded-xl font-inter text-white shadow-card font-bold bg-button hover:opacity-90 text-sm"
        >
          Sort by Date: {sortOrder === "asc" ? "Oldest" : "Newest"}
        </button>

        <Link
          to="/receipt"
          className="px-4 py-2 rounded-xl font-inter text-white shadow-card font-bold bg-button hover:opacity-90 text-sm"
        >
          + Create Receipt
        </Link>

        {selected.length > 0 && (
          <PDFDownloadLink
            document={
              <BulkDownloadPDF
                receipts={sortedReceipts.filter((r) =>
                  selected.includes(r._id)
                )}
              />
            }
            fileName="selected-receipts.pdf"
            className="px-4 py-2 rounded-xl font-inter text-white shadow-card font-bold bg-button hover:opacity-90 text-sm"
          >
            {({ loading }) =>
              loading ? "Preparing PDF..." : "Download PDF"
            }
          </PDFDownloadLink>
        )}
      </div>

      <div className="w-full max-w-5xl overflow-x-auto mx-auto">
        <div className="min-w-150 bg-button/30 space-y-2 rounded-2xl p-2 mx-auto">
          <div className="grid grid-cols-12 gap-2 bg-button text-white p-3 font-bold font-inter text-sm rounded-t-xl">
            <div className="col-span-1 text-center">Select</div>
            <div className="col-span-2 text-left">Receipt No</div>
            <div className="col-span-2 text-left">Name</div>
            <div className="col-span-2 text-left">Date</div>
            <div className="col-span-2 text-left">Amount</div>
            <div className="col-span-2 text-left">Certified By</div>
            <div className="col-span-1 text-left">Purpose</div>
          </div>

          {sortedReceipts.length > 0 ? (
            sortedReceipts.map((r) => (
              <div
                key={r._id}
                className="grid grid-cols-12 gap-2 p-3 text-sm items-left font-inter bg-button/40 hover:bg-card/80 cursor-pointer rounded-lg"
                onClick={() => handleRowClick(r._id)}
              >
                <div
                  className="col-span-1 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(r._id)}
                    onChange={() => toggleSelect(r._id)}
                    className="accent-button"
                  />
                </div>

                <div className="col-span-2 text-white">{r.receipt_no}</div>
                <div className="col-span-2 text-white font-semibold">{r.name}</div>
                <div className="col-span-2 text-left text-neutral-400">{r.date}</div>
                <div className="col-span-2 text-left font-bold text-white">
                  ₱{(r.totalAmount || 0).toFixed(2)}
                </div>
                <div className="col-span-2 text-left font-bold text-white">
                  {r.certifiedBy?.name || ""}
                </div>
                <div className="col-span-1 text-left text-white">
                  {r.purpose || "-"}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-left text-neutral-400 font-inter col-span-12">
              No receipts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
