import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import AccountInfoModal from "../../components/features/accounts_components/AccountInfoModal";
import CreateAccountModal from "../../components/features/accounts_components/CreateAccountModal";
import EditAccountModal from "../../components/features/accounts_components/EditAccountModal";
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";

// 🛡️ FALLBACK DATA
const dummyAccounts = [
  { id: "001", email: "johnsmith@gmail.com", name: "John Smith", first_name: "John", last_name: "Smith", role: "STAFF", branch: "Sta. Lucia", branch_id: "2", date: "09/09/2025", status: "Active" },
  { id: "002", email: "jdoe@gmail.com", name: "Jane Doe", first_name: "Jane", last_name: "Doe", role: "MANAGER", branch: "Riverbanks", branch_id: "3", date: "09/10/2025", status: "Active" },
  { id: "003", email: "r_williams@gmail.com", name: "Robert Williams", first_name: "Robert", last_name: "Williams", role: "CASHIER", branch: "Sta. Lucia", branch_id: "2", date: "10/11/2025", status: "Inactive" },
  { id: "004", email: "m_brown@gmail.com", name: "Michael Brown", first_name: "Michael", last_name: "Brown", role: "STAFF", branch: "Riverbanks", branch_id: "3", date: "11/12/2025", status: "Active" },
  { id: "005", email: "s_davis@gmail.com", name: "Sarah Davis", first_name: "Sarah", last_name: "Davis", role: "CASHIER", branch: "Sta. Lucia", branch_id: "2", date: "12/01/2026", status: "Active" },
  { id: "007", email: "a_wilson@gmail.com", name: "Ashley Wilson", first_name: "Ashley", last_name: "Wilson", role: "MANAGER", branch: "Sta. Lucia", branch_id: "2", date: "02/03/2026", status: "Active" },
];

const ManageAccountsPage = () => {
  const { user } = useAuth();
  const canSwitchAccess = user?.trueRole === 'manager';
  
  // 🔧 Lifted activeRole to component level for UI conditional rendering
  const activeRole = sessionStorage.getItem('activeRole')?.toUpperCase() || 'STAFF';
  
  // --- STATE ---
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ role: "All Roles", status: "All Status" });
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- API FETCH & RBAC FILTERING ---
  const fetchAccounts = async () => {
    setIsLoading(true);
    let backendAccounts = [];
    const userBranchId = sessionStorage.getItem('branchId');

    try {
      const response = await fetch('http://localhost:5000/api/Auth/users', { 
        headers: { 'Authorization': `Bearer ${user?.accessToken}` }
      });
      
      if (!response.ok) throw new Error("Endpoint not found (404)");
      
      const rawData = await response.json();
      backendAccounts = rawData.data || rawData; 

    } catch (error) {
      console.warn("Backend missing: Falling back to mock data.");
      backendAccounts = dummyAccounts;
    } finally {
      
      // 🛡️ SECURITY: Filter accounts based on role
      const authorizedAccounts = backendAccounts.filter(acc => {
        const roleToCheck = (acc.employee_role || acc.role || "").toUpperCase();
        if (activeRole === 'OWNER' || activeRole === 'ADMIN') return true; 
        
        if (activeRole === 'MANAGER') {
          return acc.branch_id?.toString() === userBranchId && 
                 (roleToCheck === 'STAFF' || roleToCheck === 'CASHIER');
        }
        
        return false; 
      });

      // 🔧 FIXED: Consistent property mapping to match your DB columns
      const mappedAccounts = authorizedAccounts.map(acc => ({
        id: acc.id || acc.employee_id || acc.userId, 
        email: acc.email || acc.employee_email,
        name: acc.name || acc.employee_full_name || `${acc.first_name} ${acc.last_name}`,
        first_name: acc.first_name,
        last_name: acc.last_name,
        middle_name: acc.middle_name || "",
        contact_no: acc.contact_no || acc.contact_number || "",
        address: acc.address || "",
        role: acc.role || acc.employee_role || "STAFF",
        branch: acc.branch || "Unknown",
        branch_id: acc.branch_id,
        date: acc.date_created ? new Date(acc.date_created).toLocaleDateString() : acc.date || "N/A",
        status: acc.status || acc.account_status || "Active"
      }));

      setAccounts(mappedAccounts);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user?.accessToken]);

  // --- FILTER ENGINE ---
  const filteredData = accounts.filter((acc) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (acc.name || "").toLowerCase().includes(searchLower) ||
      (acc.email || "").toLowerCase().includes(searchLower) ||
      (acc.id?.toString() || "").includes(searchLower);
    
    const matchesRole = !filters.role || filters.role === "All Roles" || acc.role.toUpperCase() === filters.role.toUpperCase();
    const matchesStatus = !filters.status || filters.status === "All Status" || acc.status.toUpperCase() === filters.status.toUpperCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentAccounts = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat">
      <h1 className="text-[32px] font-bold text-[#333] mb-1 tracking-tight leading-none">
        Manage Accounts
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Manage, create, and modify accounts of each user
      </p>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)}
          />
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            filterSelections={[
              { key: "role", label: "Filter: Role", options: ["All Roles", "Staff", "Cashier", "Manager"] },
              { key: "status", label: "Filter: Status", options: ["All Status", "Active", "Inactive"] },
            ]}
          />
        </div>

        {/* 🔧 HIDDEN FOR MANAGERS */}
        {activeRole !== 'MANAGER' && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <span className="text-xl leading-none">+</span> Create New Account
          </Button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-[#333] mb-6">Accounts List</h2>

      <div className="overflow-hidden min-h-[450px]">
        {isLoading ? (
            <div className="p-10 text-center text-gray-400">Fetching secured accounts...</div>
        ) : (
            <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-[12px] text-gray-400 uppercase bg-transparent border-b border-gray-100">
                <tr>
                <th className="px-4 py-3 font-medium">User ID</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Date Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentAccounts.length > 0 ? (
                currentAccounts.map((userObj, index) => (
                    <tr
                    key={userObj.id}
                    className={`${index % 2 === 0 ? "bg-[#E3DFD6]/50" : "bg-white"}`}
                    >
                    <td className="px-4 py-4 text-gray-700">{userObj.id}</td>
                    <td className="px-4 py-4">{userObj.email}</td>
                    <td className="px-4 py-4 text-gray-700">{userObj.name}</td>
                    <td className="px-4 py-4 uppercase">{userObj.role}</td>
                    <td className="px-4 py-4">{userObj.branch}</td>
                    <td className="px-4 py-4">{userObj.date}</td>
                    <td className={`px-4 py-4 font-medium uppercase ${userObj.status.toUpperCase() === 'ACTIVE' ? 'text-green-600' : 'text-red-400'}`}>{userObj.status}</td>
                    <td className="px-4 py-4 text-center">
                        <Button variant="primary" size="sm" onClick={() => { setSelectedAccount(userObj); setIsInfoModalOpen(true); }}>
                        ••• View
                        </Button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-gray-400 italic">
                    No accounts found matching your criteria.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-6 text-sm text-gray-400">
        <p>
          Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`text-2xl transition-colors ${currentPage === 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}
          >‹</button>
          <span className="text-gray-500 font-medium">{currentPage} / {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`text-2xl transition-colors ${currentPage === totalPages || totalPages === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}
          >›</button>
        </div>
      </div>

      <CreateAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={() => fetchAccounts()} />

      <AccountInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        account={selectedAccount}
        onEditClick={() => {
          setIsInfoModalOpen(false); 
          setTimeout(() => setIsEditModalOpen(true), 150);  
        }}
        onActionComplete={fetchAccounts}
      />

      <EditAccountModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} account={selectedAccount} onSave={() => fetchAccounts()} />
    </div>
  );
};

export default ManageAccountsPage;