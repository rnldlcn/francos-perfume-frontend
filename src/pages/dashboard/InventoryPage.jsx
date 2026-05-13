import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import perfumePlaceholder from "../../assets/FrancoPerfumeLogo.png";
import AddProductModal from "../../components/features/inventory_components/AddProductModal";
import EditBatchModal from "../../components/features/inventory_components/EditBatchModal";
import EditProductModal from "../../components/features/inventory_components/EditProductModal";
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";
import { fetchAllInventory } from "../../services/InventoryService";
import { UseAuth } from "../../services/UseAuth";

const filterSelections = [
  { key: "type", label: "Perfume Type", options: ["All Perfume Types", "Standard", "Premium", "Signature"] },
  { key: "branch", label: "Branch", options: ["All Branches", "Sta. Lucia", "Riverbanks", "Warehouse"] },
  { key: "gender", label: "Gender", options: ["All Genders", "Unisex", "Men", "Women"] },
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  useEffect(() => {
    const getInventoryData = async (token) => {
      try {
        setIsLoading(true);
        const response = await fetchAllInventory(token);
        
        const inventoryArray = response.data || []; 
        
        const dataWithBatches = inventoryArray.map(item => {
          // 🔧 FIXED: Read both lowercase 'batches' (from real API) and uppercase 'Batches' just in case
          const backendBatches = item.batches || item.Batches || []; 
          
          const mappedBatches = backendBatches.map(b => ({
            batchId: b.batch_display_id || b.batchId,
            dateReceived: new Date(b.date_received || b.dateReceived).toLocaleDateString(),
            targetDate: (b.target_date || b.targetDate) ? new Date(b.target_date || b.targetDate).toLocaleDateString() : "N/A",
            qty: b.quantity || b.qty
          }));

          return {
            ...item,
            // Fallback to the API's total_units if the array mapping acts up
            totalUnits: item.total_units || 0, 
            batches: mappedBatches
          };
        });
        
        setInventory(dataWithBatches);
      } catch (error) {
        console.error("Inventory fetch failed:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getInventoryData(user.accessToken);
  }, [user.accessToken]);

  const toggleRow = (rowKey) => {
    setExpandedRows((prev) => ({ ...prev, [rowKey]: !prev[rowKey] }));
  };

  const handleOpenEditBatchModal = (batch, product) => {
    setEditingBatch({ 
      ...batch, 
      perfumeName: product.product_name, 
      productId: product.product_display_id,
      branchName: product.branch_name 
    });
    setIsEditBatchModalOpen(true);
  };

  const handleSaveBatchEdit = (updatedBatch) => {
    setInventory((prev) =>
      prev.map((product) => {
        if (product.product_display_id === updatedBatch.productId && product.branch_name === updatedBatch.branchName) {
          const updatedBatches = product.batches.map(b =>
            b.batchId === updatedBatch.batchId 
              ? { ...b, qty: updatedBatch.qty, targetDate: updatedBatch.targetDate } 
              : b
          );
          // Recalculate total units locally after a save
          const newTotal = updatedBatches.reduce((sum, b) => sum + parseInt(b.qty || 0), 0);
          return { ...product, batches: updatedBatches, totalUnits: newTotal };
        }
        return product;
      })
    );
    setIsEditBatchModalOpen(false);
  };


  const { user } = UseAuth();
  const isManager = role === "manager";

  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    type: "All Perfume Types",
    branch: "All Branches",
    gender: "All Genders",
  });

  const [inventory, setInventory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;
  // use this for loading
  const [isLoading, setIsLoading] = useState(true);
 

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const getInventoryData = async (token) => {
      try {
        setIsLoading(true);
        const result = await fetchAllInventory(token, page, PAGE_SIZE);
        console.log("Fetched inventory data:", result.data);
        setInventory(result.data || []);
        setTotalPages(result.totalInventoriesPage);
        setTotalCount(result.totalInventories);
      } catch (error) {
        // add popups
        alert("Inventory failed: " + error.message);
      }
    }
    getInventoryData(user.accessToken);
  }, [user.accessToken, page]);

  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Math.floor(Math.random() * 1000).toString(),
      batches: [],
      totalUnits: 0 
    };
    setInventory([productWithId, ...inventory]);
  };

  /* // 🔌 UNCOMMENT WHEN .NET IS READY
  const [inventory, setInventory] = useState([]);
  useEffect(() => {
    fetch('https://localhost:5001/api/inventory') 
      .then(response => response.json())
      .then(data => setInventory(data));
  }, []);
  */

  // --- LOGIC: Qty Buttons ---
  const increment = useCallback(async (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  }, []);

  const decrement = useCallback(async (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item,
      ),
    );
  }, []); 


  const handleOpenEditModal = (id, role) => {
    const productToEdit = inventory.find((item) => item.id === id);
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
      
    const matchesType = filters.type === "All Perfume Types" || type.toLowerCase() === filters.type.toLowerCase();
    const matchesBranch = filters.branch === "All Branches" || branch.toLowerCase() === filters.branch.toLowerCase();
    const matchesGender = filters.gender === "All Genders" || gender.toLowerCase() === filters.gender.toLowerCase();

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

      <div className="flex products-center gap-4 mb-6">
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
            const rowKey = `${product.product_display_id}-${product.branch_name}`;
            const isExpanded = expandedRows[rowKey];
            
            const batches = product.batches || [];
            
            // 🔧 Use the totalUnits we mapped above
            const displayUnits = product.totalUnits || 0;
            const totalBatches = batches.length;
            const isLowStock = displayUnits > 0 && displayUnits < 10;

            return (
              <div key={rowKey} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all">
                
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(rowKey)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 p-2">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                      <img src={product.product_image_url || perfumePlaceholder} alt="Product" className="object-cover h-10 w-10 opacity-60" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-[#333] leading-none">{product.product_name || "Unknown Product"}</h3>
                        {isLowStock && <Badge variant="destructive" className="h-5 text-[10px] uppercase font-bold tracking-wider">⚠️ Low Stock</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`h-5 border text-xs ${product.branch_name?.toUpperCase() === 'WAREHOUSE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          {product.branch_name?.toUpperCase() || "UNKNOWN BRANCH"}
                        </Badge>
                        <Badge variant="outline" className="h-5 bg-blue-50 text-blue-700 border-blue-200">{product.product_type}</Badge>
                        <Badge variant="outline" className="h-5 bg-pink-50 text-pink-700 border-pink-200">{product.product_gender}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pr-4">
                    <p className="font-bold text-[#333] text-lg">{displayUnits} units</p>
                    <p className="text-xs text-gray-500">{totalBatches} batches</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                    {totalBatches === 0 ? (
                      <div className="text-center py-6 font-bold text-gray-400 bg-white border border-gray-200 rounded-md tracking-widest text-sm">
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

      <EditBatchModal
        isOpen={isEditBatchModalOpen}
        onClose={() => setIsEditBatchModalOpen(false)}
        batch={editingBatch}
        onSave={handleSaveBatchEdit}
      />
    </div>
  );
};

export default InventoryPage;
