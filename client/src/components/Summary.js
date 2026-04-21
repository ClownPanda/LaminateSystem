import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Summary({ data }) {
  const summary = {};

  data.forEach((item) => {
    const key = `${item.design}-${item.finish}-${item.thickness}`;

    if (
      !summary[key] ||
      new Date(item.date) > new Date(summary[key].date)
    ) {
      summary[key] = {
        closing: item.closing,
        date: item.date,
      };
    }
  });

  // ✅ Export function
  const exportSummary = () => {
    const exportData = Object.entries(summary).map(([key, value]) => {
      const [design, finish, thickness] = key.split("-");
      return {
        Design: design,
        Finish: finish,
        Thickness: thickness,
        Closing: value.closing,
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "summary.xlsx");
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-4">
      
      {/* ✅ Export Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Stock Summary</h2>

        <button
          onClick={exportSummary}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Export Summary
        </button>
      </div>

      {Object.keys(summary).length === 0 ? (
        <p className="text-gray-500">No data available</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(summary).map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-100 rounded-xl p-4 flex justify-between items-center"
            >
              <span className="text-sm font-medium text-gray-700">
                {key}
              </span>
              <span className="text-lg font-bold text-green-600">
                {value.closing}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}