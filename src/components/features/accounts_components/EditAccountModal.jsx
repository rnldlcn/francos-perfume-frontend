import React, { useState, useEffect } from 'react';
import { UseAuth } from "../../../services/UseAuth";

const EditAccountModal = ({ isOpen, onClose, account, onSave }) => {
  const { user } = UseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeRole = sessionStorage.getItem('activeRole')?.toUpperCase() || 'STAFF';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    address: '',
    email: '',
    branch: '',
    role: ''
  });

  // Pre-fill the form using the actual database keys fetched from backend
  useEffect(() => {
    if (account && isOpen) {
      setFormData({
        firstName: account.first_name || '',
        lastName: account.last_name || '',
        middleName: account.middle_name || '',
        contactNo: account.contact_no || account.contact_number || '',
        address: account.address || '',
        email: account.email || '',
        branch: account.branch || 'Sta. Lucia',
        role: account.role?.toUpperCase() || 'STAFF'
      });
    }
  }, [account, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const branchId = formData.branch === "Sta. Lucia" ? 2 : formData.branch === "Riverbanks" ? 3 : 1;
    // Use employee_id from DisplayEmployeeProfileDTO, fallback to id
    const targetId = account.employee_id || account.id;

    try {
        // -------------------------------------------------------------
        // CALL 1: Update Profile Details (Name, Contact, Address, Branch)
        // -------------------------------------------------------------
        const profilePayload = {
            branch_id: parseInt(branchId), 
            first_name: formData.firstName,
            last_name: formData.lastName,
            middle_name: formData.middleName || "",
            contact_number: formData.contactNo,
            address: formData.address,
            employee_shift: "Morning", // Required field for DTO
            employee_image_url: ""     // Required field for DTO
        };

        const profileResponse = await fetch(`http://localhost:5000/api/Employees/updateProfile/${targetId}`, { 
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${user?.accessToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(profilePayload)
        });

        if (!profileResponse.ok) {
            const errText = await profileResponse.text();
            throw new Error(`Profile Update Failed: ${errText}`);
        }

        // -------------------------------------------------------------
        // CALL 2: Update Authentication Details (Email, Role)
        // -------------------------------------------------------------
        const authPayload = {
            email: formData.email,
            employee_role: formData.role,
            password_status: account.password_status || "active" // Must pass existing status
        };

        const authResponse = await fetch(`http://localhost:5000/api/Employees/updateAuth/${targetId}`, { 
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${user?.accessToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(authPayload)
        });

        if (!authResponse.ok) {
            const errText = await authResponse.text();
            throw new Error(`Auth Update Failed: ${errText}`);
        }

        onSave(); // Refresh parent table
        onClose();
        alert("Account successfully updated.");
    } catch (err) { 
        alert(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[60] animate-fade-in font-montserrat">
      <div className="bg-[#F8F9FB] rounded-2xl shadow-xl w-full max-w-[650px] p-10 relative">
        <button onClick={onClose} className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        <h2 className="text-4xl font-extrabold text-[#333] text-center mb-10 tracking-tight">Edit Account Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="First name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input 
              type="text" placeholder="Last name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Middle name"
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value})}
            />
            <input 
              type="text" placeholder="Contact no. (e.g., 09123456789)" required
              maxLength={11} minLength={11} pattern="^09\d{9}$"
              title="Must be an 11-digit number starting with 09"
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.contactNo} 
              onChange={(e) => setFormData({...formData, contactNo: e.target.value.replace(/\D/g, '')})}
            />
          </div>

          <input 
            type="text" placeholder="Full address" required
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
          />

          <input 
            type="email" placeholder="Email" required
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-4">
            <select 
              required className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm text-gray-700"
              value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})}
            >
              <option value="Sta. Lucia">Sta. Lucia</option>
              <option value="Riverbanks">Riverbanks</option>
            </select>
            <select 
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm text-gray-700"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="STAFF">STAFF</option>
              <option value="CASHIER">CASHIER</option>
              {(activeRole === 'OWNER' || activeRole === 'ADMIN' || account?.role?.toUpperCase() === 'MANAGER') && (
                <option value="MANAGER">MANAGER</option>
              )}
            </select>
          </div>

          <div className="flex justify-center gap-6 pt-6">
            <button type="button" onClick={onClose} className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm text-gray-700 transition-colors">✕ Discard Changes</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm text-gray-700 transition-colors disabled:opacity-50">
                ✓ {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;