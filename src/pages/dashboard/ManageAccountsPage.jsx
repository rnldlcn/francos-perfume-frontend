import AccountInfoModal from "@/components/features/accounts_components/AccountInfoModal";
import CreateAccountModal from "@/components/features/accounts_components/CreateAccountModal";
import EditAccountModal from "@/components/features/accounts_components/EditAccountModal";
import { FilterDropDown } from "@/components/shared";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/account_hooks/useAccount";
import { accountColumns } from "@/utils/columns";
import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/UseAuth";
import SearchBar from "../../components/shared/SearchBar";

const ManageAccountsPage = () => {
  const { user } = useAuth();
  const { 
    accounts, 
    asyncState,
    pagination,
    filter,
    updateFilter,
    fetchAccount,
    archive,
    toggleStatus,
    resetPassword,
    filterOptions,
    updateDetails,
  } = useAccount();
  
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isAccountInfoModalOpen, setIsAccountInfoModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);

  const role = user.trueRole.toUpperCase();


  const handleRowClick = async (row) => {
    
    if (selectedAccount?.employeeId === row.employeeId) {
      setSelectedAccount(null);
      return;
    }

    setSelectedAccount(row);    

    const profile = await fetchAccount(row.employeeId, user?.accessToken);
    if (profile) {
      setSelectedAccount(prev => prev ? { ...prev, ...profile }: profile);
    }
  }

  const handleSearchChange = (value) => {
    const query = value?.target ? value.target.value : value;
    setSearchQuery(query);
    updateFilter('search', query);
  }

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat">
      <h1 className="text-3xl font-bold text-custom-black mb-1 tracking-tight leading-none">
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
          <FilterDropDown 
            filter={filter}
            updateFilter={updateFilter}
            filterOptions={filterOptions}
          />
        </div>

        {/* 🔧 HIDDEN FOR MANAGERS */}
        {role !== 'MANAGER' && (
          <Button
          variant="primary" 
          onClick={() => setIsCreateAccountModalOpen(true)}
          >
            <Plus className="h-8 w-8"/>
            Create New Account
          </Button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-custom-black mb-6">Accounts List</h2>

    <div className="overflow-hidden min-h-100"
      onClick={(e) => e.stopPropagation()}>
      <DataTable 
        columns={accountColumns}
        data={accounts}
        keyField="employeeId"
        asyncState={asyncState}
        pagination={pagination}
        filter={filter}
        updateFilter={updateFilter}
        selectedItem={selectedAccount}
        onRowClick={handleRowClick}
        onRowDoubleClick={() => setIsAccountInfoModalOpen(true)}
      />
    </div>

    <CreateAccountModal 
      isOpen={isCreateAccountModalOpen} 
      onClose={() => setIsCreateAccountModalOpen(false)}  
    />

    <AccountInfoModal
      isOpen={isAccountInfoModalOpen}
      onClose={() => setIsAccountInfoModalOpen(false)}
      selectedAccount={selectedAccount}
      setSelectedAccount={setSelectedAccount}
      archive={archive}
      toggleStatus={toggleStatus}
      resetPassword={resetPassword}
      setIsEditAccountModalOpen={setIsEditAccountModalOpen}
    />

    <EditAccountModal 
      isOpen={isEditAccountModalOpen}
      onClose={() => setIsEditAccountModalOpen(false)}
      selectedAccount={selectedAccount}
      filterOptions={filterOptions}
      updateDetails={updateDetails}
    />

    <div className="flex justify-end">
      <Button
        variant={selectedAccount ? "default" : "ghost"}
        disabled={!selectedAccount}
        onClick={() => setIsAccountInfoModalOpen(true)}
        >
        <Eye className="h-8 w-8"/>
        View Account
      </Button>
    </div>

    </div>
  );
};

export default ManageAccountsPage;