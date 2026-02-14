export default function Modal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="font-bold text-white mb-2 uppercase tracking-widest text-sm">
          Confirm Action
        </h2>

        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          Are you sure you want to delete <span className="text-white font-bold">{title}</span>?
          This process is permanent and cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-neutral-400 font-bold bg-button hover:bg-neutral-800 hover:text-white transition-all text-xs uppercase tracking-wider shadow-card"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-card text-xs uppercase tracking-wider"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}