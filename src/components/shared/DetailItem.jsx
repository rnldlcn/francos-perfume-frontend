const DetailItem = ({ label, value, className = "", uppercase = false }) => {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-bold text-foreground text-lg ${uppercase ? "uppercase" : ""}`}>
        {value ?? "N/A"}
      </p>
    </div>
  );
};

export default DetailItem;