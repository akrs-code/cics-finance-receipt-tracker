import { useState, useRef, useEffect } from "react";
import { SquareX } from "lucide-react";

export default function ReceiptForm({ data, onChange }) {
  const [newItem, setNewItem] = useState({ name: "", amount: "", quantity: "" });
  const inputsRef = useRef([]);

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

  const handleCertifiedChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, certifiedBy: { ...(data.certifiedBy || {}), [name]: value } });
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.amount || !newItem.quantity) return;

    onChange({
      ...data,
      items: [...(data.items || []), { ...newItem, amount: Number(newItem.amount), quantity: Number(newItem.quantity) }],
    });

    setNewItem({ name: "", amount: "", quantity: "" });
  };

  const handleRemoveItem = (index) => {
    const updated = [...(data.items || [])];
    updated.splice(index, 1);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="bg-card rounded-3xl p-8 w-full max-w-4xl mx-auto space-y-8">
      <h3 className="text-sm font-bold mb-2 border-b-2 border-placeholder pb-2 font-inter">Receipt Info</h3>
      <div className="grid grid-cols-2 gap-6">
        {["name", "position", "receipt_no", "date", "purpose"].map((field) => {
          const label = field.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
          return (
            <div key={field} className={field === "purpose" ? "col-span-2" : ""}>
              <label htmlFor={field} className="text-xs font-bold font-inter block mb-1">
                {label}
              </label>
              <input
                id={field}
                ref={registerInput}
                name={field}
                type={field === "date" ? "date" : "text"}
                value={data[field] || ""}
                onChange={handleChange}
                onKeyDown={handleArrowNavigation}
                placeholder={`Enter ${label}`}
                className="w-full px-4 py-2 rounded-xl shadow-card text-xs font-inter"
              />
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2 border-b-2 border-placeholder pb-2 font-inter">Items</h3>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="item-name" className="text-xs font-bold block font-inter mb-1">
              Item Name
            </label>
            <input
              id="item-name"
              ref={registerInput}
              name="name"
              type="text"
              value={newItem.name}
              onChange={handleNewItemChange}
              onKeyDown={handleArrowNavigation}
              placeholder="Enter item name"
              className="w-full px-4 py-2 rounded-xl shadow-card text-xs"
            />
          </div>
          <div>
            <label htmlFor="item-amount" className="text-xs font-bold block font-inter mb-1">
              Amount
            </label>
            <input
              id="item-amount"
              ref={registerInput}
              name="amount"
              type="number"
              value={newItem.amount}
              onChange={handleNewItemChange}
              onKeyDown={handleArrowNavigation}
              placeholder="Enter amount"
              className="w-full px-4 py-2 rounded-xl shadow-card text-xs"
            />
          </div>
          <div>
            <label htmlFor="item-quantity" className="text-xs font-bold block font-inter mb-1">
              Quantity
            </label>
            <input
              id="item-quantity"
              ref={registerInput}
              name="quantity"
              type="number"
              value={newItem.quantity}
              onChange={handleNewItemChange}
              onKeyDown={handleArrowNavigation}
              placeholder="Enter quantity"
              className="w-full px-4 py-2 rounded-xl shadow-card text-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            ref={registerInput}
            onKeyDown={handleArrowNavigation}
            className="col-start-3 w-full bg-button text-white px-4 py-2 rounded-xl font-bold text-sm"
          >
            Add
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {(data.items || []).map((item, index) => (
            <li
              key={index}
              className="flex justify-around items-center bg-button/90 text-white px-4 py-2 rounded-xl shadow-inner text-sm font-inter"
            >
              <span className="font-bold">{item.quantity} × {item.name}</span>
              <span>{item.amount}</span>
              <SquareX
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 cursor-pointer hover:text-red-800"
              />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2 border-b-2 border-placeholder pb-2 font-inter">Certified By</h3>
        <label htmlFor="certified-name" className="text-xs font-bold block font-inter mb-1">
          Name
        </label>
        <input
          id="certified-name"
          ref={registerInput}
          name="name"
          value={data.certifiedBy?.name || ""}
          onChange={handleCertifiedChange}
          onKeyDown={handleArrowNavigation}
          placeholder="Certifier name"
          className="w-full px-4 py-2 rounded-xl shadow-card text-xs font-inter"
        />
      </div>
    </div>
  );
}
