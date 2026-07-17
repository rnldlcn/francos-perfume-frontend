import InventoryRow from "@/components/features/inventory_components/InventoryRow";
import { formatDateForInput } from "@/utils/dateFormatUtils";
import { useState } from "react";
import EditBatchModal from "../../components/features/inventory_components/EditBatchModal";
import FilterDropDown from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";
import { useInventory } from "../../hooks/inventory_hooks/useInventory";

const filterSelections = [
  { key: "product_type", label: "Perfume Type", 
    options: 
    [ 
      { label: "All Perfume Types", value:''}, 
      { label: "Classic", value: "Classic" },
      { label: "Premium", value: "Premium" }
    ]
  },
  { key: "branch", label: "Branch", options: 
    [
      { label: "All Branches", value: ''},
      { label: "Sta. Lucia", value: "2" },
      { label: "Riverbanks", value: "3" },
      { label: "Warehouse", value: "1" }
    ] 
  },
  { key: "product_gender", label: "Gender", options: 
    [ { label: "All Genders", value: ''}, 
     { label: "Unisex", value: "Unisex" },
     { label: "Men", value: "Men" },
     { label: "Women", value: "Women" }
    ] 
  },
];

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); 
  // can add error here
  const { inventory, isLoading, totalPages, totalEntries, fetchBatchesForProduct, handleSaveBatchEdit, filter, updateFilter } = useInventory();

  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const [batchMap, setBatchMap] = useState([]);

  const handleOpenEditBatchModal = (batch, product) => {
    const date = batch.targetDate || batch.dateReceived;
    const formattedTargetDate = date ? formatDateForInput(date) : null;
        setEditingBatch({ 
          ...batch,
          branchId: batch.branchId,
          batchDisplayId: batch.batchDisplayId,
          productName: product.productName,
          quantity: batch.quantity,
          targetDate: formattedTargetDate
        });
        setIsEditBatchModalOpen(true);
    };
  
  const handleSearchChange = (value) => {
    const query = value?.target ? value.target.value : value;
    setSearchQuery(query);
    updateFilter('search', query);
  }
  
  return (
    <div className="flex flex-col h-full animate-fade-in relative font-montserrat">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#333] tracking-tight leading-none mb-2">
            Inventory
          </h1>
          <p className="text-gray-500 text-sm">
            Overview of all available parfum products
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FilterDropDown
          filter={filter}
          updateFilter={updateFilter}
          filterSelections={filterSelections}
        />
      </div>

      <div className="flex flex-col gap-4 pb-4 flex-1">
        <InventoryRow 
          inventory={inventory}
          isLoading={isLoading}
          totalPages={totalPages}
          totalEntries={totalEntries}
          batchMap={batchMap}
          setBatchMap={setBatchMap}
          fetchBatchesForProduct={fetchBatchesForProduct}
          handleSaveBatchEdit={handleSaveBatchEdit}
          filter={filter}
          updateFilter={updateFilter}
          handleOpenEditBatchModal={handleOpenEditBatchModal}
        />
      </div>

      <EditBatchModal
        key={editingBatch?.batchId || "empty"}
        isOpen={isEditBatchModalOpen}
        onClose={() => setIsEditBatchModalOpen(false)}
        batch={editingBatch}
        onSave={async (submittedBatchData) => {
          await handleSaveBatchEdit(submittedBatchData);
          setIsEditBatchModalOpen(false)
          setBatchMap(prev => {
            const next = {...prev};
            delete next[`${submittedBatchData.productId}-${submittedBatchData.branchId}`]
            return next;
          })
        }}
      />  
    </div>
  );
};

export default InventoryPage;