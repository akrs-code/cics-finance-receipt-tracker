import { useState, useRef, useEffect } from "react";
import { SquareX, Plus } from "lucide-react";

export default function ReceiptForm({ data, onChange }) {
  const [newItem, setNewItem] = useState({ name: "", amount: "", quantity: "" });
  const inputsRef = useRef([]);

  const councilMembers = [
    { name: "Amnisa D. Arsa", position: "Chief Minister" },
    { name: "Nor-Ainie T. Macalatas", position: "Executive Secretary" },
    { name: "Raisha M. Matonding", position: "Assistant Secretary" },
    { name: "Janna M. Barsi", position: "Associate Justice" },
    { name: "Alexsarah D.C. Racman", position: "Speaker of the Parliament" },
    { name: "Peejay C. Patos", position: "DCS Society Head" },
    { name: "Saibah H.O. Saidamen", position: "DIS Society Head" },
    { name: "Norhadi M. Norodin", position: "CSRAW Commissioner" },
    { name: "Sittie Aisha C. Abdulmanan", position: "Minister of Audit" },
    { name: "Mohammad Hosni M. Palantig", position: "Minister of Public Affairs" },
    { name: "Amal O. Sultan", position: "Minister of Finance" },
    { name: "Hafsah R. Mangorangca", position: "Minister of Academic Affairs" },
    { name: "Jehan Fatmah P. Radiamoda", position: "Minister of Sports and Recreation" },
    { name: "Sarhan G. Mundig", position: "Minister of Press & Information" },
    { name: "Honey Jane B. Mamac", position: "Minister of Documentation" },
    { name: "Mohammad M. Camid", position: "Minister of Business Operation" },
    { name: "Al-Banie M. Agakhan", position: "SSG Representative" },
    { name: "John Warren A. Villarta", position: "SSG Representative" },
    { name: "Mohammad Zulkifli S. Macadato", position: "Deputy Minister of Public Affairs" },
    { name: "Omar O. Batocala", position: "Deputy Minister of Academic Affairs" },
    { name: "Asnawi L. Hassan", position: "Deputy Minister of Press & Information" },
    { name: "Rahimah H.R. H.Jamel", position: "Deputy Minister of Documentation" },
    { name: "Fahad M. Baraiman", position: "Deputy Minister of Business Operation" },
    { name: "Hafiz M. Daison", position: "Technical Director" },
    { name: "Crysttel Angeline B. Ali", position: "Public Information Officer" },
    { name: "Abdul-khaliq R. Solaiman", position: "Operation Officer of Press & Information" },
    { name: "Nasrimah L. Nasroden", position: "Secretary of Financial Records" },
    { name: "Norfaida P. Abdulcadir", position: "Secretary of Funds and Expenditures" },
    { name: "Wassim D. Alikhan", position: "Associate Minister of Business Operation" },
  ];

  const registerInput = (el) => {
    if (el && !inputsRef.current.includes(el)) {
      inputsRef.current.push(el);
    }
  };

  useEffect(() => {
    inputsRef.current = [];
  }, [data.items?.length]);

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
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleMemberSelect = (e) => {
    const selectedMember = councilMembers.find(m => m.name === e.target.value);
    onChange({
      ...data,
      name: selectedMember?.name || "",
      position: selectedMember?.position || ""
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.amount || !newItem.quantity) return;
    onChange({
      ...data,
      items: [...(data.items || []), {
        ...newItem,
        amount: Number(newItem.amount),
        quantity: Number(newItem.quantity)
      }],
    });
    setNewItem({ name: "", amount: "", quantity: "" });
  };

  const handleRemoveItem = (index) => {
    const updated = [...(data.items || [])];
    updated.splice(index, 1);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="bg-neutral-900 p-6 flex flex-col items-center text-white gap-6 font-inter">
      <div className="w-full max-w-4xl bg-button/30 p-8 rounded-2xl shadow-card space-y-8">
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
                  <option key={i} value={m.name}>{m.name}</option>
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
                <label className="text-xs font-bold block mb-1 capitalize">{field.replace("_", " ")}</label>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="text-xs font-bold block mb-1">Item Name</label>
              <input
                placeholder="Item name"
                name="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                name="amount"
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold block mb-1">Qty</label>
                <input
                  type="number"
                  placeholder="1"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-button px-4 py-2 rounded-xl font-bold text-white shadow-card hover:opacity-80 transition-opacity"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {(data.items || []).map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-button/40 p-3 rounded-xl border border-neutral-800">
                <div className="text-sm">
                  <span className="font-bold text-white">{item.quantity}x</span> {item.name}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white text-sm">₱{(item.amount * item.quantity).toFixed(2)}</span>
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
            name="name"
            ref={registerInput}
            value={data.certifiedBy?.name || ""}
            onChange={(e) => onChange({ ...data, certifiedBy: { name: e.target.value } })}
            onKeyDown={handleArrowNavigation}
            placeholder="Certifier Name"
            className="w-full px-4 py-2 rounded-xl text-sm bg-button text-white shadow-card focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}