import { useState } from "react";
import { Trash2, UserPlus, PackagePlus, ArrowLeft } from "lucide-react";
import { useSettings } from "../hooks/useSettings.js";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { councilMembers, units, updateMembers, updateUnits } = useSettings();
  const [newMember, setNewMember] = useState({ name: "", position: "" });
  const [newUnit, setNewUnit] = useState("");
  const navigate = useNavigate();

  const addMember = () => {
    if (!newMember.name || !newMember.position) return;
    updateMembers([...councilMembers, newMember]);
    setNewMember({ name: "", position: "" });
  };

  const addUnit = () => {
    if (!newUnit) return;
    updateUnits([...units, newUnit]);
    setNewUnit("");
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 flex flex-col items-center text-white gap-8 font-inter">
      <div className="w-full max-w-5xl flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl text-neutral-400 shadow-card font-bold bg-button hover:bg-neutral-800 hover:text-white transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-xl font-bold uppercase tracking-widest text-neutral-400">System Settings</h1>
        <div className="w-20"></div>
      </div>

      <div className="w-full max-w-5xl space-y-8">
        <section className="bg-button/20 p-6 rounded-2xl border border-neutral-800 shadow-card">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest border-b border-neutral-800 pb-3 text-card">
            <UserPlus size={18} /> Council Members
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-8">
            <input
              placeholder="Full Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
              className="md:col-span-3 px-4 py-2 rounded-xl shadow-card text-sm bg-button text-white placeholder:text-neutral-500 focus:ring-2 ring-card outline-none"
            />
            <input
              placeholder="Position"
              value={newMember.position}
              onChange={(e) => setNewMember({ ...newMember, position: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
              className="md:col-span-3 px-4 py-2 rounded-xl shadow-card text-sm bg-button text-white placeholder:text-neutral-500 focus:ring-2 ring-card outline-none"
            />
            <button
              onClick={addMember}
              className="md:col-span-1 bg-card text-button rounded-xl font-bold text-sm hover:bg-card/80 transition-colors py-2 shadow-card"
            >
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {councilMembers.map((m, i) => (
              <div key={i} className="flex justify-between items-center bg-button/40 p-3 rounded-xl border border-neutral-800 hover:bg-neutral-800/60 transition-colors">
                <div className="overflow-hidden">
                  <p className="font-bold text-white tracking-tight text-xs truncate" title={m.name}>
                    {m.name}
                  </p>
                  <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-tighter mt-0.5 truncate" title={m.position}>
                    {m.position}
                  </p>
                </div>
                <button 
                  onClick={() => updateMembers(councilMembers.filter((_, idx) => idx !== i))}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg group transition-colors ml-2 flex-shrink-0"
                >
                  <Trash2 size={14} className="text-neutral-600 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-button/20 p-6 rounded-2xl border border-neutral-800 shadow-card">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest border-b border-neutral-800 pb-3 text-green-500">
            <PackagePlus size={18} /> Units of Measure
          </h2>
          
          <div className="flex gap-3 mb-8">
            <input
              placeholder="New unit"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
              className="flex-1 px-4 py-2 rounded-xl shadow-card text-sm bg-button text-white placeholder:text-neutral-500 focus:ring-2 ring-green-600 outline-none"
            />
            <button
              onClick={addUnit}
              className="px-8 bg-green-600/20 border border-green-600/50 text-green-500 rounded-xl font-bold text-sm hover:bg-green-600 hover:text-white transition-all shadow-card"
            >
              Add Unit
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {units.map((u, i) => (
              <div key={i} className="flex items-center gap-3 bg-button/40 px-4 py-2 rounded-xl border border-neutral-800 group hover:border-neutral-600 transition-colors">
                <span className="text-xs font-bold tracking-wider text-neutral-300">{u}</span>
                <Trash2 
                  size={14} 
                  className="text-neutral-600 cursor-pointer hover:text-red-500 transition-colors" 
                  onClick={() => updateUnits(units.filter((_, idx) => idx !== i))} 
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}