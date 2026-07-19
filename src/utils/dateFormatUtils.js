export const formatDateForTable = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toISOString().split('T')[0];
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split('T')[0]; 
};

export const formatDateTimeForTable = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const datePart = date.toISOString().split('T')[0];
  const timePart = date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return `${datePart}, ${timePart}`;
};