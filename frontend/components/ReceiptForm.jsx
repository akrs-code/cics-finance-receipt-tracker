import { useState, useRef, useEffect } from "react";
import { SquareX, Plus } from "lucide-react";
import { useSettings } from "../hooks/useSettings.js";

export default function ReceiptForm({ data, onChange }) {
  const { councilMembers, units } = useSettings();
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
      sanitizedValue = value === "" ? "" : Math.abs(Number(value)).toString();
    }

    onChange({ ...data, [name]: sanitizedValue });
  };

  const handleMemberSelect = (e) => {
    const selectedMember = councilMembers.find((m) => m.name === e.target.value);
    onChange({
      ...data,
      name: selectedMember?.name || "",
      position: selectedMember?.position || "",
      certifiedBy: selectedMember?.name || "",
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.amount || !newItem.quantity) return;
    onChange({
      ...data,
      items: [
        ...(data.items || []),
        {
          ...newItem,
          amount: Math.abs(Number(newItem.amount)),
          quantity: Math.abs(Number(newItem.quantity)),
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
    <div className="bg-neutral-900 p-6 flex flex-col items-center text-white gap-6 font-inter">
      <div className="w-full max-w-5xl bg-button/30 p-8 rounded-2xl shadow-card space-y-8">
        <div>
          <h3 className="text-sm font-bold mb-4 border-b-2 border-neutral-700 pb-2 uppercase tracking-wider">
            Receipt Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold block mb-1">Select Council Member</label>
              <select
                ref={registerInput}
                value={data.name || ""}
                onChange={handleMemberSelect}
                onKeyDown={handleArrowNavigation}
                className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
              >
                <option value="">Choose a member...</option>
                {councilMembers.map((m, i) => (
                  <option key={i} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Name</label>
              <input
                readOnly
                value={data.name || ""}
                placeholder="Select a member..."
                className="w-full px-4 py-2 rounded-xl text-sm bg-button/50 text-neutral-400 cursor-not-allowed shadow-card placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Position</label>
              <input
                readOnly
                value={data.position || ""}
                placeholder="Member's position..."
                className="w-full px-4 py-2 rounded-xl text-sm bg-button/50 text-neutral-400 cursor-not-allowed shadow-card placeholder:text-neutral-600"
              />
            </div>

            {["receipt_no", "date", "purpose", "category"].map((field) => (
              <div key={field}>
                <label className="text-xs font-bold block mb-1 capitalize">
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
                  className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white placeholder:text-neutral-500 shadow-card focus:outline-none focus:ring-1 ring-neutral-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-4 border-b-2 border-neutral-700 pb-2 uppercase tracking-wider">
            Items
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Item</label>
                <input
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") })
                  }
                  className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  onKeyDown={blockInvalidChar}
                  value={newItem.amount}
                  onChange={(e) =>
                    setNewItem({ ...newItem, amount: e.target.value.replace(/[^0-9.]/g, "") })
                  }
                  className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Quantity</label>
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  onKeyDown={blockInvalidChar}
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value.replace(/[^0-9]/g, "") })
                  }
                  className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Unit</label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
                >
                  {/* DYNAMIC UNITS MAPPING */}
                  {units.map((u, i) => (
                    <option key={i} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddItem}
                className="h-30 w-full bg-button rounded-xl font-bold text-white shadow-card hover:opacity-80 transition-opacity flex items-center justify-center"
              >
                <Plus size={22} />
              </button>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {(data.items || []).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-button/40 p-3 rounded-xl border border-neutral-800"
              >
                <div className="text-sm">
                  <span className="font-bold text-white">{item.quantity}x</span> {item.name}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white text-sm">
                    ₱{(item.amount * item.quantity).toFixed(2)}
                  </span>
                  <SquareX
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 cursor-pointer hover:opacity-70"
                    size={18}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-4 border-b-2 border-neutral-700 pb-2 uppercase tracking-wider">
            Certification
          </h3>
          <label className="text-xs font-bold block mb-1">Certified Correct By</label>
          <input
            readOnly
            value={data.certifiedBy || ""}
            placeholder="Select a member above..."
            className="w-full px-4 py-2 rounded-xl text-sm bg-button/50 text-neutral-400 cursor-not-allowed shadow-card placeholder:text-neutral-600"
          />
        </div>
      </div>
    </div>
  );
}