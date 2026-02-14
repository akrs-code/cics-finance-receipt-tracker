export default function Modal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-10 shadow-xl animate-in fade-in zoom-in duration-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
        
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-2">
            Delete Confirmation
          </label>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Confirm Action
          </h2>
        </div>

        <div className="mb-10 space-y-4">
          <p className="text-neutral-400 text-sm leading-relaxed">
            Are you sure you want to permanently delete this item? This action cannot be undone.
          </p>
          
          <div className="bg-neutral-950 px-4 py-3 rounded-xl border border-neutral-800">
            <span className="text-white font-medium text-sm">{title || "Selected Item"}</span>
          </div>
          
          <p className="text-[11px] text-neutral-500 font-medium italic">
            Note: All associated data will be removed from the records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl text-neutral-400 font-bold bg-neutral-800/50 hover:bg-neutral-800 hover:text-white transition-all text-[11px] uppercase tracking-wider border border-neutral-800 active:scale-95"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all text-[11px] uppercase tracking-wider active:scale-95 shadow-lg shadow-red-900/20"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}