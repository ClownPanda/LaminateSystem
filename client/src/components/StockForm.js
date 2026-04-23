import { useEffect, useState } from "react";
import API from "../api/axios";

export default function StockForm({ refresh, data, editData, setEditData }) {
  const username = localStorage.getItem("username"); // ✅ get logged-in user

  const [form, setForm] = useState({
    date: "",
    design: "",
    finish: "SF",
    thickness: username === "Arihant0.8" ? "0.8" : "0.62", // ✅ conditional
    production: 0,
    dispatch: 0,
  });

  // ✅ Autofill when editing
  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  // ✅ Opening calculation (same-day chain fixed)
  const calculateOpening = () => {
    const prev = data
      .filter(
        (d) =>
          d.design === form.design &&
          d.finish === form.finish &&
          d.thickness === form.thickness &&
          (d.date < form.date || d.date === form.date) &&
          d._id !== editData?._id
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    return prev ? prev.closing : 0;
  };

  const handleSubmit = async () => {
    const opening = calculateOpening();
    const closing =
      opening + Number(form.production) - Number(form.dispatch);

    try {
      if (editData) {
        await API.put(`/stock/${editData._id}`, {
          ...form,
          opening,
          closing,
        });
        setEditData(null);
      } else {
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
        thickness: username === "Arihant0.8" ? "0.8" : "0.62",
        production: 0,
        dispatch: 0,
      });

      refresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error saving entry");
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

        {/* ✅ FINISH */}
        <select
          value={form.finish}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, finish: e.target.value })}
        >
          {username === "Arihant0.8" ? (
            <>
              <option>SF</option>
              <option>MT</option>
              <option>HG</option>
              <option>SW</option>
              <option>FM</option>
              <option>VL</option>
              <option>VO</option>
              <option>FL</option>
              <option>SMT</option>
              <option>CS</option>
            </>
          ) : (
            <>
              <option>SF</option>
              <option>MT</option>
              <option>HG</option>
            </>
          )}
        </select>

        {/* ✅ THICKNESS */}
        <select
          value={form.thickness}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, thickness: e.target.value })}
        >
          {username === "Arihant0.8" ? (
            <option value="0.8">0.8</option>
          ) : (
            <>
              <option>0.62</option>
              <option>0.68</option>
              <option>0.72</option>
              <option>0.80</option>
            </>
          )}
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
                thickness: username === "Arihant0.8" ? "0.8" : "0.62",
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