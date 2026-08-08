import { useAuth } from "@/auth/UseAuth";
import { discountColumns } from "@/components/features/discount_components/DiscountColumns";
import { FilterDropDown, SearchBar } from "@/components/shared";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useDiscounts } from "@/hooks/discount_hooks/useDiscount";
import { Plus } from "lucide-react";
import { useState } from "react";

const DiscountPage = () => {
  const { user } = useAuth();
  const {
      discounts, 
      asyncState,
      pagination,
      filter,
      updateFilter,
      filterOptions,
  } = useDiscounts();

  const role = user.trueRole;

  const [searchQuery, setSearchQuery] = useState("");

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [discountToArchive, setDiscountToArchive] = useState(null);

  const handleSearchChange = (value) => {
        const query = value?.target ? value.target.value : value;
        setSearchQuery(query);
        updateFilter('search', query);
    }

  return (
    <div className="flex flex-col h-full animate-fade-in relative font-montserrat">

      <h1 className="text-3xl font-bold text-custom-black mb-1 leading-none tracking-tight">Discount Management</h1>
      <p className="text-gray-400 text-sm mb-8">Create, remove, and change discounts</p>


        <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-xl">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

        {role !== 'MANAGER' && (
          <Button
            //onClick={() => setIsCreateAccountModalOpen(true)}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Discount
          </Button>
        )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
            <FilterDropDown
            filter={filter}
            updateFilter={updateFilter}
            filterOptions={filterOptions}
            />
        </div>
    </div>

    <h2 className="text-2xl font-bold text-custom-black mb-6">Discounts List</h2>

    <div className="overflow-y-auto h-screen min-h-100"
      onClick={(e) => e.stopPropagation()}>
      <DataTable 
        columns={discountColumns}
        data={discounts}
        keyField="discountId"
        asyncState={asyncState}
        pagination={pagination}
        filter={filter}
        updateFilter={updateFilter}
        //selectedItem={selectedAccount}
        //onRowClick={handleRowClick}
        //onRowDoubleClick={() => setIsAccountInfoModalOpen(true)}
      />
    </div>


    </div>
  );
};

export default DiscountPage;