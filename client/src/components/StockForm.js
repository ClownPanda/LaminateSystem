import { useEffect, useState } from "react";
import API from "../api/axios";

export default function StockForm({ refresh, data, editData, setEditData }) {
  const [form, setForm] = useState({
    date: "",
    design: "",
    finish: "SF",
    thickness: "0.62",
    production: 0,
    dispatch: 0,
  });

  // ✅ Autofill when editing
  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  // ✅ FIXED: Correct opening calculation (handles SAME DAY entries)
  const calculateOpening = () => {
    const filtered = data.filter(
      (d) =>
        d.design === form.design &&
        d.finish === form.finish &&
        d.thickness === form.thickness &&
        d._id !== editData?._id // avoid self when editing
    );

    if (filtered.length === 0) return 0;

    // ✅ Sort by date + latest entry (same day included)
    const latest = filtered.sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);

      if (dateDiff === 0) {
        // same date → pick latest created entry
        return new Date(b._id) - new Date(a._id);
      }

      return dateDiff;
    })[0];

    return latest.closing;
  };

  const handleSubmit = async () => {
    const opening = calculateOpening();
    const closing =
      opening + Number(form.production) - Number(form.dispatch);

    try {
      if (editData) {
        // ✅ UPDATE
        await API.put(`/stock/${editData._id}`, {
          ...form,
          opening,
          closing,
        });
        setEditData(null);
      } else {
        // ✅ CREATE
        await API.post("/stock", {
          ...form,
          opening,
          closing,
        });
      }

      // ✅ Reset form
      setForm({
        date: "",
        design: "",
        finish: "SF",
        thickness: "0.62",
        production: 0,
        dispatch: 0,
      });

      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <div className="grid grid-cols-6 gap-3">
        
        <input
          type="date"
          value={form.date}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Design"
          value={form.design}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, design: e.target.value })}
        />

        <select
          value={form.finish}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, finish: e.target.value })}
        >
          <option>SF</option>
          <option>MT</option>
          <option>HG</option>
        </select>

        <select
          value={form.thickness}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, thickness: e.target.value })}
        >
          <option>0.62</option>
          <option>0.68</option>
          <option>0.72</option>
          <option>0.80</option>
        </select>

        <input
          type="number"
          placeholder="Production"
          value={form.production}
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, production: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Dispatch"
          value={form.dispatch}
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, dispatch: e.target.value })
          }
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded text-white ${
            editData ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {editData ? "Update Entry" : "Save Entry"}
        </button>

        {editData && (
          <button
            onClick={() => {
              setEditData(null);
              setForm({
                date: "",
                design: "",
                finish: "SF",
                thickness: "0.62",
                production: 0,
                dispatch: 0,
              });
            }}
            className="px-4 py-2 rounded bg-gray-400 text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}