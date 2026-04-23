import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";
import StockForm from "../components/StockForm";
import StockTable from "../components/StockTable";
import Summary from "../components/Summary";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "/";
};

  const fetchData = useCallback(async () => {
    try {
      const res = await API.get(`/stock?search=${search}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [search]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
    } else {
      fetchData();
    }
  }, [fetchData]);

  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Stock Dashboard</h1>

  <button
    onClick={logout}
    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
  >
    Logout
  </button>
</div>
      <h1 className="text-2xl mb-4 font-bold">Stock Dashboard</h1>

      <input
        placeholder="Search Design"
        className="border p-2 mb-4 w-full rounded"
        onChange={(e) => setSearch(e.target.value)}
      />

      <StockForm
        refresh={fetchData}
        data={data}
        editData={editData}
        setEditData={setEditData}
      />

      <StockTable
        data={data}
        refresh={fetchData}
        onEdit={setEditData}
      />

      <Summary data={data} />
    </div>
  );
}