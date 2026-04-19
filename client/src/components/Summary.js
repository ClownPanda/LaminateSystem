export default function Summary({ data }) {
  const summary = {};

  data.forEach((item) => {
    const key = `${item.design}-${item.finish}-${item.thickness}`;
    summary[key] = (summary[key] || 0) + item.closing;
  });

  return (
    <div className="mt-4">
      <h2 className="font-bold">Summary</h2>
      <ul>
        {Object.keys(summary).map((key) => (
          <li key={key}>
            {key}: {summary[key]}
          </li>
        ))}
      </ul>
    </div>
  );
}