import { useState } from "react";
import { Trash2, UserPlus, PackagePlus, ArrowLeft, ShieldCheck, Plus, Settings2 } from "lucide-react";
import { useSettings } from "../hooks/useSettings.js";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.jsx";

export default function Settings() {
  const {
    councilMembers, units, audits,
    handleAddMember, handleDeleteMember,
    handleAddAudit, handleDeleteAudit,
    handleAddUnit, handleDeleteUnit
  } = useSettings();

  const [newMember, setNewMember] = useState({ name: "", position: "" });
  const [newAudit, setNewAudit] = useState({ name: "", position: "" });
  const [newUnit, setNewUnit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ type: null, index: null, identifier: "" });
  const navigate = useNavigate();

  const triggerDelete = (type, index, identifier) => {
    setDeleteConfig({ type, index, identifier });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfig.type === "member") await handleDeleteMember(deleteConfig.index);
      if (deleteConfig.type === "audit") await handleDeleteAudit(deleteConfig.index);
      if (deleteConfig.type === "unit") await handleDeleteUnit(deleteConfig.identifier);
      setIsModalOpen(false);
    } catch (err) { console.error("Deletion failed:", err); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-8 flex flex-col items-center text-white font-inter antialiased">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteConfig.identifier ? `Confirm Purge: ${deleteConfig.identifier.toUpperCase()}` : ""}
      />

      <header className="w-full max-w-7xl flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="group px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-transparent border border-neutral-800 hover:border-neutral-600 hover:text-white transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Dashboard
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 justify-end">
            <Settings2 size={24} className="text-neutral-400" /> System Configs
          </h1>
          <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">Institutional Parameters</p>
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-6 pb-20">
        <section className="bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-6 bg-[#141414] border-b border-neutral-800">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 flex items-center gap-2">
              <UserPlus size={14} className="text-neutral-400" /> Council Member
            </label>
            <div className="space-y-3">
              <input
                placeholder="FULL NAME"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] text-[11px] font-bold tracking-wider text-white border border-neutral-800 focus:border-neutral-600 transition-all uppercase outline-none"
              />
              <input
                placeholder="POSITION"
                value={newMember.position}
                onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] text-[11px] font-bold tracking-wider text-white border border-neutral-800 focus:border-neutral-600 transition-all uppercase outline-none"
              />
              <button
                onClick={() => { if (newMember.name) handleAddMember(newMember); setNewMember({ name: "", position: "" }) }}
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-lg bg-white text-black font-bold text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-all"
              >
                <Plus size={12}/> Add Member
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-100 custom-scrollbar">
            <div className="space-y-2">
              {councilMembers.map((member, index) => (
                <div key={index} className="flex justify-between items-center bg-[#0a0a0a] px-4 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all group">
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-[11px] uppercase tracking-tight">{member.name}</p>
                    <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">{member.position}</p>
                  </div>
                  <button 
                    onClick={() => triggerDelete("member", index, member.name)} 
                    className="p-2 text-neutral-600 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-6 bg-[#141414] border-b border-neutral-800">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-neutral-400" /> Audit Members
            </label>
            <div className="space-y-3">
              <input
                placeholder="FULL NAME"
                value={newAudit.name}
                onChange={(e) => setNewAudit({ ...newAudit, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] text-[11px] font-bold tracking-wider text-white border border-neutral-800 focus:border-neutral-600 transition-all uppercase outline-none"
              />
              <input
                placeholder="POSITION"
                value={newAudit.position}
                onChange={(e) => setNewAudit({ ...newAudit, position: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] text-[11px] font-bold tracking-wider text-white border border-neutral-800 focus:border-neutral-600 transition-all uppercase outline-none"
              />
              <button
                onClick={() => { if (newAudit.name) handleAddAudit(newAudit); setNewAudit({ name: "", position: "" }) }}
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-lg bg-white text-black font-bold text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-all"
              >
                <Plus size={12}/> Add Audit
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-100 custom-scrollbar">
            <div className="space-y-2">
              {audits.map((audit, index) => (
                <div key={index} className="flex justify-between items-center bg-[#0a0a0a] px-4 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all group">
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-[11px] uppercase tracking-tight">{audit.name}</p>
                    <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">{audit.position}</p>
                  </div>
                  <button 
                    onClick={() => triggerDelete("audit", index, audit.name)} 
                    className="p-2 text-neutral-600 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-6 bg-[#141414] border-b border-neutral-800">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 flex items-center gap-2">
              <PackagePlus size={14} className="text-neutral-400" /> Unit Metrics
            </label>
            <div className="space-y-3">
              <input
                placeholder="ENTER UNITS"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] text-[11px] font-bold tracking-wider text-white border border-neutral-800 focus:border-neutral-600 transition-all outline-none"
              />
              <div className="h-10.5 invisible hidden md:block" /> 
              <button
                onClick={() => { if (newUnit) handleAddUnit(newUnit); setNewUnit("") }}
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-lg bg-white text-black font-bold text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-all"
              >
                <Plus size={12}/> Add Unit
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-100 custom-scrollbar">
            <div className="flex flex-wrap gap-2">
              {units.map((unit, index) => (
                <div key={index} className="flex items-center gap-3 bg-[#0a0a0a] px-3 py-2 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all group">
                  <span className="text-[10px] font-bold text-neutral-200 tracking-widest uppercase">{unit}</span>
                  <button 
                    onClick={() => triggerDelete("unit", index, unit)}
                    className="text-neutral-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}