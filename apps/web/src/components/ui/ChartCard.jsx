const ChartCard = ({ title, children }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="mt-6 h-64">{children}</div>
  </div>
);

export default ChartCard;
