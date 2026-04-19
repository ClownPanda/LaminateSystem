import { useEffect, useState } from "react";
import API from "../api/axios";
import StockForm from "../components/StockForm";
import StockTable from "../components/StockTable";
import Summary from "../components/Summary";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await API.get(`/stock?search=${search}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Stock Dashboard</h1>

      <input
        placeholder="Search Design"
        className="border p-2 mb-4"
        onChange={(e) => setSearch(e.target.value)}
      />

      <StockForm refresh={fetchData} data={data} />
      <StockTable data={data} refresh={fetchData} />
      <Summary data={data} />
    </div>
  );
}