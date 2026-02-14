import { useState } from "react";
import { CalendarDays, ChevronRight, LogOut, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/Modal.jsx";

export default function SemesterSelection({ onSelect }) {
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const periods = [
        { id: "1st Semester", label: "1st Semester", range: "July — December" },
        { id: "2nd Semester", label: "2nd Semester", range: "Jan — June" }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-inter antialiased relative">
            <button
                onClick={() => setShowLogoutModal(true)}
                className="absolute top-8 right-8 flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 hover:bg-red-600 hover:text-white transition-all group active:scale-95"
            >
                <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
                <LogOut size={16} />
            </button>

            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center mb-12">
                    <div className="mb-6 p-3 w-fit rounded-xl bg-[#0a0a0a] border border-neutral-800 text-neutral-400 group-hover:text-white transition-colors relative z-10">
                        <CalendarDays size={36} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Welcome {user?.name || "Authorized Personnel"}</h1>
                    <p className="text-sm text-neutral-500 mt-2">Select a semester period to continue</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {periods.map((term) => (
                        <button
                            key={term.id}
                            onClick={() => onSelect(term.id)}
                            className="group bg-[#111111] border border-neutral-800 p-8 rounded-2xl hover:border-neutral-600 transition-all text-left shadow-2xl relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1 relative z-10">{term.label}</h3>
                            <p className="text-xs text-neutral-500 mb-8 relative z-10">{term.range}</p>
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 group-hover:text-white transition-all relative z-10">
                                Go to Dashboard <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={logout}
                title="CURRENT_USER_SESSION"
            />
        </div>
    );
}