import API from "../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function StockTable({ data, refresh, onEdit }) {
  const handleDelete = async (id) => {
    await API.delete(`/stock/${id}`);
    refresh();
  };

  // ✅ Export function
  const exportExcel = () => {
    const formattedData = data.map((d) => ({
      Date: d.date,
      Design: d.design,
      Finish: d.finish,
      Thickness: d.thickness,
      Opening: d.opening,
      Production: d.production,
      Dispatch: d.dispatch,
      Closing: d.closing,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "stock_data.xlsx");
  };

  return (
    <div className="mt-6">

      {/* ✅ Export Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={exportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Export Excel
        </button>
      </div>

      {/* Header */}
      <div className="bg-gray-100 rounded-2xl px-6 py-4 shadow-sm mb-2">
        <div className="grid grid-cols-9 text-sm font-semibold text-gray-700">
          <span>Date</span>
          <span>Design</span>
          <span>Finish</span>
          <span>Thickness</span>
          <span>Opening</span>
          <span>Production</span>
          <span>Dispatch</span>
          <span>Closing</span>
          <span>Action</span>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {data.map((d) => (
          <div
            key={d._id}
            className="grid grid-cols-9 px-6 py-4 border-b items-center hover:bg-gray-50"
          >
            <span>{d.date}</span>
            <span>{d.design}</span>
            <span>{d.finish}</span>
            <span>{d.thickness}</span>
            <span>{d.opening}</span>
            <span>{d.production}</span>
            <span>{d.dispatch}</span>
            <span className="font-semibold">{d.closing}</span>

            <span className="flex gap-2">
              <button
                onClick={() => onEdit(d)}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(d._id)}
                className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200"
              >
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}