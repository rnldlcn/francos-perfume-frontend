import { useEffect, useState } from 'react';
import { UseAuth } from "../../../services/AuthService";

const CreateAccountModal = ({ isOpen, onClose, onSave }) => {
  const { user } = UseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🛡️ Get the current user's role to determine what options they see
  const activeRole = sessionStorage.getItem('activeRole')?.toUpperCase() || 'STAFF';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    address: '',
    email: '',
    branch: '',
    role: 'STAFF' 
  });

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
        setFormData({
            firstName: '', lastName: '', middleName: '', contactNo: '', 
            address: '', email: '', branch: '', role: 'STAFF'
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Map text branch to Branch ID for your database
    const branchId = formData.branch === "Sta. Lucia" ? 2 : formData.branch === "Riverbanks" ? 3 : 1;

const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    middle_name: formData.middleName,
    contact_number: formData.contactNo,
    address: formData.address,
    email: formData.email,
    branch_id: branchId,
    employee_role: formData.role,
    employee_shift: "Morning",
    employee_profile_picture: ""
};

    try {
        const response = await fetch('http://localhost:5000/api/Auth/register', { 
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${user?.accessToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText);
        }

        const savedData = await response.json();
        onSave(savedData); // Trigger parent refresh
        onClose();
        alert("Account successfully created.");
    } catch (err) { 
        alert(`Creation failed: ${err.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in font-montserrat">
      <div className="bg-[#F8F9FB] rounded-2xl shadow-xl w-full max-w-[650px] p-10 relative">
        <button onClick={onClose} className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        
        <h2 className="text-4xl font-extrabold text-[#333] text-center mb-10 tracking-tight">Create New Account:</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Enter first name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input 
              type="text" placeholder="Enter last name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Enter middle name"
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value})}
            />
            <input 
              type="text" placeholder="Enter contact no."
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.contactNo} onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
            />
          </div>

          <input 
            type="text" placeholder="Enter full address"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
          />

          <input 
            type="email" placeholder="Enter email" required
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-4">
            <select 
              required className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm text-gray-700"
              value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})}
            >
              <option value="" disabled>Select branch</option>
              {/* If they are a manager, they ideally should only be able to select their own branch, but we'll leave all options open for owners/admins */}
              <option value="Sta. Lucia">Sta. Lucia</option>
              <option value="Riverbanks">Riverbanks</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm text-gray-700"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="STAFF">STAFF</option>
              <option value="CASHIER">CASHIER</option>
              {/* 🛡️ SECURITY: Only allow Owner or Admin to see the MANAGER option */}
              {(activeRole === 'OWNER' || activeRole === 'ADMIN') && (
                <option value="MANAGER">MANAGER</option>
              )}
            </select>
          </div>

          <div className="flex justify-center gap-6 pt-6">
            <button 
              type="button" onClick={onClose} disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm text-gray-700 disabled:opacity-50"
            >
              <span className="text-lg">✕</span> Discard Changes
            </button>
            <button 
              type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm text-gray-700 disabled:opacity-50"
            >
              <span className="text-lg">✓</span> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;