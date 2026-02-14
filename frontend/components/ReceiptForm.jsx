import { useState, useRef, useEffect } from "react";
import { SquareX, Plus, FileText, ClipboardList, ShieldCheck } from "lucide-react";
import { useSettings } from "../hooks/useSettings.js";

export default function ReceiptForm({ data, onChange }) {
  const { councilMembers, audits, units } = useSettings();
  const [newItem, setNewItem] = useState({
    name: "",
    amount: "",
    quantity: "",
    unit: units[0] || "pc"
  });

  const inputsRef = useRef([]);

  useEffect(() => {
    if (units.length > 0 && !units.includes(newItem.unit)) {
      setNewItem(prev => ({ ...prev, unit: units[0] }));
    }
  }, [units]);

  const registerInput = (el) => {
    if (el && !inputsRef.current.includes(el)) {
      inputsRef.current.push(el);
    }
  };

  useEffect(() => {
    inputsRef.current = [];
  }, [data.items?.length]);

  const blockInvalidChar = (e) => {
    if (["e", "E", "-", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleArrowNavigation = (e) => {
    const index = inputsRef.current.indexOf(e.target);
    if (index === -1) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      (inputsRef.current[index + 1] || inputsRef.current[0]).focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      (inputsRef.current[index - 1] || inputsRef.current[inputsRef.current.length - 1]).focus();
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let sanitizedValue = value;

    if (type === "text" && name !== "receipt_no") {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (type === "number") {
      sanitizedValue = value.replace(/[^0-9.]/g, "");
    }

    onChange({ ...data, [name]: sanitizedValue });
  };

  const handleMemberSelect = (e) => {
    const selectedMember = councilMembers.find((member) => member.name === e.target.value);
    onChange({
      ...data,
      name: selectedMember?.name || "",
      position: selectedMember?.position || "",
      certifiedBy: selectedMember?.name || "",
    });
  };

  const handleAuditSelect = (e) => {
    const selected = audits.find(a => a.name === e.target.value);
    onChange({
      ...data,
      auditBy: selected
        ? { name: selected.name, position: selected.position }
        : null
    });
  };

  const handleAddItem = () => {
    const amount = parseFloat(newItem.amount);
    const qty = parseFloat(newItem.quantity);
    if (!newItem.name || !amount || amount <= 0 || !qty || qty <= 0) return;
    
    onChange({
      ...data,
      items: [
        ...(data.items || []),
        {
          ...newItem,
          name: newItem.name.toUpperCase(),
          amount: Math.abs(amount),
          quantity: Math.abs(qty),
        },
      ],
    });
    setNewItem({ name: "", amount: "", quantity: "", unit: units[0] || "pc" });
  };

  const handleRemoveItem = (index) => {
    const updated = [...(data.items || [])];
    updated.splice(index, 1);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="w-full bg-[#0a0a0a] flex flex-col items-center text-white font-inter antialiased">
      <div className="w-full max-w-5xl space-y-8">
        <section className="bg-[#111111] border border-neutral-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText size={18} className="text-neutral-500" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              General Information
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Responsible Officer</label>
              <select
                ref={registerInput}
                value={data.name || ""}
                onChange={handleMemberSelect}
                onKeyDown={handleArrowNavigation}
                className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#0a0a0a] border border-neutral-800 text-white focus:border-neutral-600 outline-none transition-all"
              >
                <option value="">SELECT OFFICER</option>
                {councilMembers.map((member, index) => (
                  <option key={index} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Full Name</label>
              <input readOnly value={data.name || ""} placeholder="Waiting for selection..." className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#141414] text-neutral-400 border border-neutral-800 cursor-not-allowed uppercase" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Designated Position</label>
              <input readOnly value={data.position || ""} placeholder="---" className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#141414] text-neutral-400 border border-neutral-800 cursor-not-allowed uppercase" />
            </div>

            {["receipt_no", "date", "purpose", "category"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">
                  {field.replace("_", " ")}
                </label>
                <input
                  name={field}
                  type={field === "date" ? "date" : "text"}
                  ref={registerInput}
                  value={data[field] || ""}
                  onChange={handleChange}
                  onKeyDown={handleArrowNavigation}
                  placeholder={`Enter ${field.replace("_", " ")}`}
                  className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#0a0a0a] border border-neutral-800 text-white placeholder:text-neutral-700 focus:border-neutral-600 outline-none transition-all uppercase tracking-wider"
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Semester</label>
              <select
                name="semester"
                onChange={handleChange}
                ref={registerInput}
                value={data.semester || ""}
                onKeyDown={handleArrowNavigation}
                className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#0a0a0a] border border-neutral-800 text-white focus:border-neutral-600 outline-none transition-all"
              >
                <option value="" disabled>SELECT PERIOD</option>
                <option value="1st Semester">1ST SEMESTER</option>
                <option value="2nd Semester">2ND SEMESTER</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] p-8 rounded-2xl border border-neutral-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList size={18} className="text-neutral-500" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Expenditure Details
            </h3>
          </div>

          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider ml-1">Item or Service Name</label>
              <input
                placeholder="Enter description of item or service purchased"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value.toUpperCase() })}
                className="w-full px-5 py-4 rounded-xl text-[12px] font-bold uppercase bg-[#0a0a0a] border border-neutral-800 text-white outline-none focus:border-neutral-600 transition-all placeholder:text-neutral-700"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider ml-1">Unit Price (₱)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  onKeyDown={blockInvalidChar}
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl text-[12px] font-bold bg-[#0a0a0a] border border-neutral-800 text-white outline-none focus:border-neutral-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider ml-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  onKeyDown={blockInvalidChar}
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl text-[12px] font-bold bg-[#0a0a0a] border border-neutral-800 text-white outline-none focus:border-neutral-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider ml-1">Unit</label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl text-[12px] font-bold bg-[#0a0a0a] border border-neutral-800 text-white outline-none focus:border-neutral-600 cursor-pointer"
                >
                  {units.map((unit, i) => (
                    <option key={i} value={unit}>{unit.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-4 bg-white text-black rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar border-t border-neutral-800 pt-6">
            {(data.items || []).length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-neutral-800/50 rounded-2xl">
                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">No items added yet</p>
              </div>
            ) : (
              (data.items || []).map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-[#0d0d0d] px-6 py-4 rounded-xl border border-neutral-800 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-8 h-8 rounded bg-[#0a0a0a] border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-500">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase text-white tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-neutral-500 font-medium">
                        {item.quantity} {item.unit} × ₱{Number(item.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[14px] font-bold text-white tabular-nums">
                      ₱{(item.amount * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <button onClick={() => handleRemoveItem(index)} className="text-neutral-600 hover:text-red-500 transition-all">
                      <SquareX size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-[#111111] border border-neutral-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck size={18} className="text-neutral-500" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Signatories & Validation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Auditor Selection</label>
              <select
                ref={registerInput}
                value={data.auditBy?.name || ""}
                onChange={handleAuditSelect}
                onKeyDown={handleArrowNavigation}
                className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#0a0a0a] border border-neutral-800 text-white focus:border-neutral-600 outline-none transition-all"
              >
                <option value="">SELECT AUDITOR</option>
                {audits.map((member, index) => (
                  <option key={index} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Auditor Name</label>
              <input readOnly value={data.auditBy?.name || ""} placeholder="Waiting..." className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#141414] text-neutral-400 border border-neutral-800 cursor-not-allowed uppercase" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Auditor Position</label>
              <input readOnly value={data.auditBy?.position || ""} placeholder="---" className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#141414] text-neutral-400 border border-neutral-800 cursor-not-allowed uppercase" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Certified By</label>
              <input readOnly value={data.certifiedBy || ""} placeholder="---" className="w-full px-4 py-3 rounded-lg text-[11px] font-bold bg-[#141414] text-neutral-400 border border-neutral-800 cursor-not-allowed uppercase" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}