import AccountInfoModal from "@/components/features/accounts_components/AccountInfoModal";
import AccountsTable from "@/components/features/accounts_components/AccountsTable";
import CreateAccountModal from "@/components/features/accounts_components/CreateAccountModal";
import EditAccountModal from "@/components/features/accounts_components/EditAccountModal";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/account_hooks/useAccount";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/UseAuth";
import SearchBar from "../../components/shared/SearchBar";

const ManageAccountsPage = () => {
  const { user } = useAuth();
  const { accounts, isLoading, filter, updateFilter, fetchAccount } = useAccount();
  
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [isAccountInfoModalOpen, setIsAccountInfoModalOpen] = useState(false);

  const role = user.trueRole.toUpperCase();

  const handleRowClick = async (row) => {
    setSelectedAccount(prev => prev?.employeeId === row.employeeId ? null : row);

    const profile = await fetchAccount(row.employeeId, user?.accessToken);
    setSelectedAccount(profile);
  }

  const handleSearchChange = (value) => {
    const query = value?.target ? value.target.value : value;
    setSearchQuery(query);
    updateFilter('search', query);
  }

  /*

  <FilterDropDown
            filters={filter}
            setFilters={updateFilter}
            filterSelections={[
              { key: "role", label: "Filter: Role", options: ["All Roles", "Staff", "Cashier", "Manager"] },
              { key: "status", label: "Filter: Status", options: ["All Status", "Active", "Inactive"] },
            ]}
          />

    
    />
  */

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat"
      onClick={() => setSelectedAccount(null)}
    >
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
          {/* add filter bar here */}
          
        </div>

        {/* 🔧 HIDDEN FOR MANAGERS */}
        {role !== 'MANAGER' && (
          <Button variant="primary" onClick={() => setIsCreateAccountModalOpen(true)}>
            <span className="text-xl leading-none">+</span> Create New Account
          </Button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-[#333] mb-6">Accounts List</h2>

      <div className="overflow-hidden min-h-112.5"
        onClick={(e) => e.stopPropagation()}>
       <AccountsTable
          selectedAccount={selectedAccount}
          handleRowClick={handleRowClick}
          accounts={accounts}
          isEditAccountModalOpen={isEditAccountModalOpen}
       />
      </div>

    <CreateAccountModal 
      isOpen={isCreateAccountModalOpen} 
      onClose={() => isCreateAccountModalOpen(false)}  
    />

    <AccountInfoModal
      isOpen={isAccountInfoModalOpen}
      onClose={() => setIsAccountInfoModalOpen(false)}
      selectedAccount={selectedAccount}
      onEditClick={() => {
        isAccountInfoModalOpen(false); 
        setTimeout(() => isEditAccountModalOpen(true), 150);  
      }}
    />

    <EditAccountModal
      isOpen={isEditAccountModalOpen} 
      onClose={() => setIsEditAccountModalOpen(false)} 
      account={selectedAccount}
    />

    <div className="flex justify-end">
          <Button
            className=
            "bg-custom-primary text-custom-black gap-2 hover:bg-custom-primary-50-opacity cursor-pointer disabled:bg-gray-200 disabled:text-custom-gray disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedAccount}
            onClick={() => setIsAccountInfoModalOpen(true)}
            >
            View Account
            <Eye className="h-8 w-8"/>
          </Button>
    </div>

    </div>
  );
};

export default ManageAccountsPage;