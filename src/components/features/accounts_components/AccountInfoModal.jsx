import React, { useState } from 'react';
import { UseAuth } from "../../../services/UseAuth";

const AccountInfoModal = ({ isOpen, onClose, account, onEditClick, onActionComplete }) => {
  const { user } = UseAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !account) {
    if (showResetConfirm) setShowResetConfirm(false);
    if (showDeactivateConfirm) setShowDeactivateConfirm(false);
    return null;
  }

  // --- ROLE BASED ACCESS LOGIC ---
  const currentRole = user?.trueRole?.toUpperCase() || user?.activeRole?.toUpperCase() || sessionStorage.getItem('activeRole')?.toUpperCase() || '';
  const canModify = currentRole === 'OWNER' || currentRole === 'ADMIN';

  // Fallback for ID depending on how your table passes the data
  const targetId = account.employee_id || account.id;

  // --- DATA PARSING LOGIC ---
  // Prioritize the newly added explicit database columns.
  // Fallback to splitting the legacy employee_full_name string for older accounts.
  const nameParts = (account.employee_full_name || "").trim().split(/\s+/);
  
  const firstName = account.first_name || account.firstName || nameParts[0] || "N/A";
  const lastName = account.last_name || account.lastName || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : "N/A");
  const middleName = account.middle_name || account.middleName || (nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "N/A");

  // Safely drill down in case EF Core nested the Auth table data
  const email = account.email || account.employeeAuths?.email || account.employeeAuth?.email || "N/A";
  const role = account.employee_role || account.role || account.employeeAuths?.employee_role || account.employeeAuth?.employee_role || "N/A";
  const branchName = account.branch_display_id || account.branch || "Unknown";
  const contactNo = account.contact_number || account.contact_no || "N/A";

  // --- ACTUAL API HANDLERS ---
  const handleResetConfirm = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/Employees/resetPassword/${targetId}`, {
          method: 'PUT', 
          headers: { 
              'Authorization': `Bearer ${user?.accessToken}`,
              'Content-Type': 'application/json' 
          }
      });
      
      if (!response.ok) throw new Error(await response.text());
      
      alert(`Password successfully reset for ${email}. The default password is now ZFranco123!`);
      
      setShowResetConfirm(false);
      onClose(); 
    } catch (err) {
      alert(`Error resetting password: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/Employees/deactivate/${targetId}`, {
          method: 'PUT',
          headers: { 
              'Authorization': `Bearer ${user?.accessToken}`,
              'Content-Type': 'application/json' 
          }
      });

      if (!response.ok) throw new Error(await response.text());
      
      alert("Account successfully deactivated.");

      setShowDeactivateConfirm(false);
      onClose();
      if(onActionComplete) onActionComplete(); 
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- NESTED CONFIRMATION VIEWS ---
  if (showResetConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 font-montserrat">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden relative">
          <button onClick={() => setShowResetConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <span className="text-2xl">✕</span>
          </button>
          <div className="p-8 text-center mt-4">
            <h3 className="text-2xl font-bold text-[#333] mb-4">Reset password for this account?</h3>
            <p className="text-sm text-gray-500 mb-8">The user will need to use the default password "ZFranco123!" to log back in.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleResetConfirm} disabled={isProcessing} className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] font-bold py-3 px-12 rounded-md transition-colors w-32 disabled:opacity-50">
                {isProcessing ? "..." : "YES"}
              </button>
              <button onClick={() => setShowResetConfirm(false)} disabled={isProcessing} className="border-2 border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 font-bold py-3 px-12 rounded-md transition-colors w-32">
                NO
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showDeactivateConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 font-montserrat">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden relative">
          <button onClick={() => setShowDeactivateConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <span className="text-2xl">✕</span>
          </button>
          <div className="p-8 text-center mt-4">
            <h3 className="text-2xl font-bold text-[#333] mb-8">Are you sure you want to disable this account?</h3>
            <div className="flex gap-4 justify-center">
              <button onClick={handleDeactivateConfirm} disabled={isProcessing} className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] font-bold py-3 px-12 rounded-md transition-colors w-32 disabled:opacity-50">
                {isProcessing ? "..." : "YES"}
              </button>
              <button onClick={() => setShowDeactivateConfirm(false)} disabled={isProcessing} className="border-2 border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 font-bold py-3 px-12 rounded-md transition-colors w-32">
                NO
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ACCOUNT INFO VIEW ---
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-montserrat">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-2xl">‹</span>
          </button>
          <h2 className="text-2xl font-bold text-[#333]">Account Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-xl">✕</span>
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">First name:</p>
              <p className="font-bold text-[#333] text-lg">{firstName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Middle name:</p>
              <p className="font-bold text-[#333] text-lg">{middleName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Last name:</p>
              <p className="font-bold text-[#333] text-lg">{lastName}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-1">Address:</p>
            <p className="font-bold text-[#333] text-lg uppercase">{account.address || "N/A"}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Email:</p>
              <p className="font-bold text-[#333] text-lg">{email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Contact no.:</p>
              <p className="font-bold text-[#333] text-lg">{contactNo}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs text-gray-400 mb-1">Branch:</p>
              <p className="font-bold text-[#333] text-lg">{branchName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Role:</p>
              <p className="font-bold text-[#333] text-lg uppercase">{role}</p>
            </div>
          </div>

          {canModify && (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { onClose(); onEditClick(); }} className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] py-2.5 rounded-md font-medium transition-colors">Edit Account</button>
              <button onClick={() => setShowResetConfirm(true)} className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">Reset Password</button>
              <button onClick={() => setShowDeactivateConfirm(true)} className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">Deactivate Account</button>
              
              <button onClick={() => alert("Archive endpoint not yet wired in frontend")} className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">Archive Account</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfoModal;