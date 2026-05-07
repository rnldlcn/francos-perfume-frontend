import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import AddProductModal from "../../components/features/inventory_components/AddProductModal";
import EditProductModal from "../../components/features/inventory_components/EditProductModal";
import EditBatchModal from "../../components/features/inventory_components/EditBatchModal"; // <--- NEW IMPORT
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";
import { fetchAllInventory } from "../../services/InventoryService";
import { UseAuth } from "../../services/UseAuth";
import perfumePlaceholder from "../../assets/FrancoPerfumeLogo.png";

const filterSelections = [
  { key: "type", label: "Perfume Type", options: ["All Perfume Types", "Premium", "Classic"] },
  { key: "branch", label: "Branch", options: ["All Branches", "Sta. Lucia", "Riverbanks"] },
  { key: "gender", label: "Gender", options: ["All Genders", "Unisex", "Male", "Female"] },
];

const Inventory = ({ role }) => {
  const { user } = UseAuth();
  const isManager = role === "manager";

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "All Perfume Types",
    branch: "All Branches",
    gender: "All Genders",
  });

  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  // MODAL STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false); // <--- NEW STATE
  const [editingBatch, setEditingBatch] = useState(null); // <--- NEW STATE

  useEffect(() => {
    const getInventoryData = async (token) => {
      try {
        setIsLoading(true);
        const data = await fetchAllInventory(token);
        
        // 🚨 CRITICAL FIX: If backend doesn't supply batches yet, bind dummy batches to the object
        // Otherwise, edits won't stick because the state is strictly read-only.
        const dataWithBatches = data.map(item => ({
          ...item,
          batches: item.batches || [
            { batchId: `BAT-${Math.floor(100 + Math.random() * 900)}`, dateReceived: "2026-11-04", targetDate: "2026-11-10", qty: 2 },
            { batchId: `BAT-${Math.floor(100 + Math.random() * 900)}`, dateReceived: "2026-11-04", targetDate: "2026-11-10", qty: 3 }
          ]
        }));
        
        setInventory(dataWithBatches);
      } catch (error) {
        console.error("Inventory fetch failed:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getInventoryData(user.accessToken);
  }, [user.accessToken]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- HANDLERS FOR BATCHES ---
  const handleOpenEditBatchModal = (batch, product) => {
    // Merge product info into the batch object so the modal can read it
    setEditingBatch({ 
      ...batch, 
      perfumeName: product.product_name, 
      productId: product.product_display_id 
    });
    setIsEditBatchModalOpen(true);
  };

  const handleSaveBatchEdit = (updatedBatch) => {
    // Locally update the specific batch inside the inventory state array
    setInventory((prev) =>
      prev.map((product) => {
        if (product.product_display_id === updatedBatch.productId) {
          const updatedBatches = product.batches.map(b =>
            b.batchId === updatedBatch.batchId 
              ? { ...b, qty: updatedBatch.qty, targetDate: updatedBatch.targetDate } 
              : b
          );
          return { ...product, batches: updatedBatches };
        }
        return product;
      })
    );
    setIsEditBatchModalOpen(false);
  };

  // --- HANDLERS FOR PRODUCTS ---
  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Math.floor(Math.random() * 1000).toString(),
      batches: [], 
    };
    setInventory([productWithId, ...inventory]);
  };

  const handleOpenEditModal = (id) => {
    const productToEdit = inventory.find((item) => item.product_display_id === id);
    setEditingProduct(productToEdit);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProduct) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.product_display_id === updatedProduct.product_display_id ? updatedProduct : item
      )
    );
    setIsEditModalOpen(false);
  };

  const filteredInventory = inventory.filter((item) => {
    const name = item.product_name || "";
    const id = item.product_display_id?.toString() || "";
    const type = item.product_type || "";
    const branch = item.branch_name || "";
    const gender = item.product_gender || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.includes(searchQuery);
    const matchesType = filters.type === "All Perfume Types" || type === filters.type;
    const matchesBranch = filters.branch === "All Branches" || branch === filters.branch;
    const matchesGender = filters.gender === "All Genders" || gender === filters.gender;

    return matchesSearch && matchesType && matchesBranch && matchesGender;
  });

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

        <div className="flex gap-3">
          <Button variant="outline">
            <span className="text-lg mr-2">▤</span> Scan barcode
          </Button>

          {isManager && (
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              + ADD PRODUCT
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(value) => setSearchQuery(value?.target ? value.target.value : value)}
        />
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          filterSelections={filterSelections}
        />
      </div>

      <div className="flex flex-col gap-4 pb-8">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading inventory data...</div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No products found.</div>
        ) : (
          filteredInventory.map((product) => {
            const isExpanded = expandedRows[product.product_display_id];
            
            // Read batches from the state we mapped in useEffect
            const batches = product.batches || [];
            
            const totalUnits = batches.reduce((sum, b) => sum + b.qty, 0);
            const totalBatches = batches.length;
            const isLowStock = totalUnits < 10;

            return (
              <div key={product.product_display_id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all">
                
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(product.product_display_id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 p-2">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                      <img src={perfumePlaceholder} alt="Product" className="object-cover h-10 w-10 opacity-60" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-[#333] leading-none">{product.product_name || "Unknown Product"}</h3>
                        {isLowStock && <Badge variant="destructive" className="h-5 text-[10px]">⚠️ Low Stock</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="h-5 bg-green-50 text-green-700 border-green-200">{product.branch_name}</Badge>
                        <Badge variant="outline" className="h-5 bg-blue-50 text-blue-700 border-blue-200">{product.product_type}</Badge>
                        <Badge variant="outline" className="h-5 bg-pink-50 text-pink-700 border-pink-200">{product.product_gender}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pr-4">
                    <p className="font-bold text-[#333] text-lg">{totalUnits} units</p>
                    <p className="text-xs text-gray-500">{totalBatches} batches</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                    {totalBatches === 0 ? (
                      <div className="text-center py-6 font-bold text-gray-400 bg-white border border-gray-200 rounded-md">
                        NO AVAILABLE BATCH FOUND
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="font-semibold text-gray-600">Batch ID</TableHead>
                              <TableHead className="font-semibold text-gray-600">Date Received</TableHead>
                              <TableHead className="font-semibold text-gray-600">Target Date</TableHead>
                              <TableHead className="font-semibold text-gray-600 text-center">Quantity</TableHead>
                              <TableHead className="font-semibold text-gray-600 text-right pr-6">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {batches.map((batch, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium text-gray-700">{batch.batchId}</TableCell>
                                <TableCell className="text-gray-600">{batch.dateReceived}</TableCell>
                                <TableCell className="text-gray-600">{batch.targetDate}</TableCell>
                                <TableCell className="text-center text-gray-700">{batch.qty}</TableCell>
                                <TableCell className="text-right pr-4">
                                  {/* THE EDIT BATCH BUTTON TRIGGER */}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs flex items-center gap-1.5 ml-auto"
                                    onClick={() => handleOpenEditBatchModal(batch, product)}
                                  >
                                    <Edit size={12} /> Edit Batch
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveEdit}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      {/* NEW EDIT BATCH MODAL COMPONENT */}
      <EditBatchModal
        isOpen={isEditBatchModalOpen}
        onClose={() => setIsEditBatchModalOpen(false)}
        batch={editingBatch}
        onSave={handleSaveBatchEdit}
      />
    </div>
  );
};

export default Inventory;