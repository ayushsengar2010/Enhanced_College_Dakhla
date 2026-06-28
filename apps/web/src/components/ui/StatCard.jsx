import { Link } from "react-router-dom";

const StatCard = ({ label, value, icon, to }) => {
  const cardContent = (
    <div className="bg-admin text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:cursor-pointer">
      {/* Content */}
      <div>
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        <div className="text-[13px] font-semibold text-white/90 mt-2 tracking-wide">{label}</div>
      </div>
      
      {/* Watermark Icon */}
      {icon && (
        <div className="absolute right-3 bottom-2 text-white/10 text-6xl select-none pointer-events-none transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{cardContent}</Link>;
  }

  return cardContent;
};

export default StatCard;
