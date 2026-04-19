import { useState } from "react";
import API from "../api/axios";

export default function StockForm({ refresh, data }) {
  const [form, setForm] = useState({
    date: "",
    design: "",
    finish: "SF",
    thickness: "0.62",
    production: 0,
    dispatch: 0
  });

  const calculateOpening = () => {
    const prev = data
      .filter(
        (d) =>
          d.design === form.design &&
          d.finish === form.finish &&
          d.thickness === form.thickness &&
          d.date < form.date
      )
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    return prev ? prev.closing : 0;
  };

  const handleSubmit = async () => {
    const opening = calculateOpening();
    const closing =
      opening + Number(form.production) - Number(form.dispatch);

    await API.post("/stock", { ...form, opening, closing });
    refresh();
  };

  return (
    <div className="grid grid-cols-6 gap-2 mb-4">
      <input type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <input placeholder="Design" onChange={(e) => setForm({ ...form, design: e.target.value })} />

      <select onChange={(e) => setForm({ ...form, finish: e.target.value })}>
        <option>SF</option>
        <option>MT</option>
        <option>HG</option>
      </select>

      <select onChange={(e) => setForm({ ...form, thickness: e.target.value })}>
        <option>0.62</option>
        <option>0.68</option>
        <option>0.72</option>
      </select>

      <input
        type="number"
        placeholder="Production"
        onChange={(e) => setForm({ ...form, production: e.target.value })}
      />

      <input
        type="number"
        placeholder="Dispatch"
        onChange={(e) => setForm({ ...form, dispatch: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="col-span-6 bg-green-500 text-white p-2"
      >
        Save Entry
      </button>
    </div>
  );
}