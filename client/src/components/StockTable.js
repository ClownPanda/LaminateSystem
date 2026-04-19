import API from "../api/axios";

export default function StockTable({ data, refresh }) {
  const handleDelete = async (id) => {
    await API.delete(`/stock/${id}`);
    refresh();
  };

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr>
          <th>Date</th>
          <th>Design</th>
          <th>Finish</th>
          <th>Opening</th>
          <th>Closing</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d._id}>
            <td>{d.date}</td>
            <td>{d.design}</td>
            <td>{d.finish}</td>
            <td>{d.opening}</td>
            <td>{d.closing}</td>
            <td>
              <button onClick={() => handleDelete(d._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}