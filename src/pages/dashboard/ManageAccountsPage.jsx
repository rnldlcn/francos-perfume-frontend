import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/account_hooks/useAccount";
import { useState } from "react";
import { useAuth } from "../../auth/UseAuth";
import AccountInfoModal from "../../components/features/accounts_components/AccountInfoModal";
import CreateAccountModal from "../../components/features/accounts_components/CreateAccountModal";
import EditAccountModal from "../../components/features/accounts_components/EditAccountModal";
import FilterDropDown from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";

const ManageAccountsPage = () => {
  const { user } = useAuth();
  const { accounts, filter, updateFilter } = useAccount();
  
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const role = user.activeRole;

  const handleSearchChange = (value) => {
    const query = value?.target ? value.target.value : value;
    setSearchQuery(query);
    updateFilter('search', query);
  }

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
            onChange={handleSearchChange}
          />
          <FilterDropDown
            filters={filter}
            setFilters={updateFilter}
            filterSelections={[
              { key: "role", label: "Filter: Role", options: ["All Roles", "Staff", "Cashier", "Manager"] },
              { key: "status", label: "Filter: Status", options: ["All Status", "Active", "Inactive"] },
            ]}
          />
        </div>

        {/* 🔧 HIDDEN FOR MANAGERS */}
        {role !== 'MANAGER' && (
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