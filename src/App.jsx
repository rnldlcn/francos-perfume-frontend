import React, { useState } from "react";
import RoleGateway from "./components/RoleLogin"; // Double check this filename!
import StaffLogin from "./components/StaffLogin";

function App() {
  const [view, setView] = useState("gateway");
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    setView("login");
  };

  const handleGoBack = () => {
    setView("gateway");
  };

  return (
    <div>
      <div className="font-sans">
      
    </div>
      {view === "gateway" ? (
        <RoleGateway onSelect={handleRoleSelect} />
      ) : (
        <StaffLogin role={selectedRole} onBack={handleGoBack} />
      )}
    </div>
  );
}

export default App;