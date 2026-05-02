import DataTable from "@/components/data_components/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AddProductModal from "../../components/features/inventory_components/AddProductModal";
import EditProductModal from "../../components/features/inventory_components/EditProductModal";
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";
import { fetchAllInventory, updateQuantity } from "../../services/InventoryService";
import { UseAuth } from "../../services/UseAuth";

const filterSelections = [
  {
    key: "type",
    label: "Perfume Type",
    options: ["All Perfume Types", "Premium", "Classic"],
  },
  {
    key: "branch",
    label: "Branch",
    options: ["All Branches", "Sta. Lucia", "Riverbanks"],
  },
  {
    key: "gender",
    label: "Gender",
    options: ["All Genders", "Unisex", "Male", "Female"],
  },

];

const InventoryPage = ({ role }) => {

  const columns = [
  {
    header: 'ID',
    accessorKey: 'product_display_id',
    enableSorting: true,
  },
  {
    header: 'Perfume Name',
    accessorKey: 'product_name',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Perfume Type',
    accessorKey: 'product_type',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Branch',
    accessorKey: 'branch_name',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Note',
    accessorKey: 'product_note',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Gender',
    accessorKey: 'product_gender',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Date Created',
    accessorKey: 'product_date_created',
    sortingFn: 'datetime',
  },
  {
    header: 'Quantity',
    accessorKey: 'product_qty',
    sortingFn: 'basic',
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({row}) => {
      const product = row.original;
        return (
          <div className="flex gap-1">
            <Button variant="primary" size="icon-sm" onClick={() => increment(product.product_id)}><Plus size={14}/></Button>
            <Button variant="primary" size="icon-sm" onClick={() => decrement(product.product_id)}><Minus size={14}/></Button>
            <Button variant="primary" size="icon-sm" onClick={() => handleOpenEditModal(product.product_id, role)}><Edit size={14}/></Button>
          </div>
        )
      }
    }
  ];


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
    // 1. Give it a temporary fake ID until you connect a real database later
    const productWithId = {
      ...newProduct,
      id: Math.floor(Math.random() * 1000).toString(),
    };

    // 2. Put the new product at the very top of the existing inventory list
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

  const handleQuantityUpdate = useCallback(async (productId, newQty) => {
    if (!productId) return;
    try {

      const updatedProduct = await updateQuantity(productId, newQty, user.accessToken);
      setInventory((prev) =>
        prev.map((product) =>
          product.product_id === productId
            ? { ...product, product_qty: updatedProduct.product_qty } 
            : product,
        ),
      );
    } catch (error) {
      // add popups
      alert("Failed to update quantity: " + error.message);
    }

  }, [user.accessToken]);

  const increment = useCallback((productId) => handleQuantityUpdate(productId, 1), [handleQuantityUpdate]);
  const decrement = useCallback((productId) => handleQuantityUpdate(productId, -1), [handleQuantityUpdate]);

  const handleOpenEditModal = (id) => {
    const productToEdit = inventory.find((product) => product.product_id === id);
    setEditingProduct(productToEdit);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProduct) => {
    // 🚨 LOCAL UPDATE:
    setInventory((prev) =>
      prev.map((product) =>
        product.product_id === updatedProduct.product_id ? updatedProduct : product,
      ),
    );
    setIsEditModalOpen(false);

    /*
    // 🔌 UNCOMMENT WHEN .NET IS READY
    try {
      const response = await fetch(`https://localhost:5001/api/inventory/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (response.ok) {
        setInventory(prev => prev.map(product => product.id === updatedProduct.id ? updatedProduct : product));
        setIsEditModalOpen(false);
      } else {
        alert("Failed to save changes to database.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    */
  };

  const handleResetFilters = () => {
    setFilters({
      type: "All Perfume Types",
      branch: "All Branches",
      gender: "All Genders",
    });
  };


  const filteredInventory = inventory.filter((product) => {
  // 1. Defend against missing properties and handle Number to String conversion
  const name = product.product_name || "";
  const id = product.product_display_id?.toString() || ""; // Using display_id from your DTO
  const type = product.product_type || "";
  const branch = product.branch_display_id || ""; // From your DTO
  const gender = product.product_gender || "";

  const matchesSearch =
    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    id.includes(searchQuery);

  const matchesType =
    filters.type === "All Perfume Types" || type === filters.type;
    
  const matchesBranch =
    filters.branch === "All Branches" || branch === filters.branch;
    
  const matchesGender =
    filters.gender === "All Genders" || gender === filters.gender;

  return matchesSearch && matchesType && matchesBranch && matchesGender;
});

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      {/* HEADER SECTION */}
      <div className="flex justify-between products-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none mb-2">
            Inventory
          </h1>
          <p className="text-custom-gray text-sm">
            Overview of all available parfum products
          </p>
        </div>

        {/* We put the buttons in a flex container so they sit next to each other */}
        <div className="flex gap-3">
          <Button variant="primary">
            <span className="text-lg">▤</span> Scan barcode
          </Button>

          {/*
            CHECK IF USER IS MANAGER
          */}

          {isManager && (
            <Button variant="success" onClick={() => setIsAddModalOpen(true)}>
              + ADD PRODUCT
            </Button>
          )}
        </div>
      </div>

      <div className="flex products-center gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            const text = value?.target ? value.target.value : value;
            setSearchQuery(text);
          }}
        />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          filterSelections={filterSelections}
        />
      </div>

      <DataTable
        data={filteredInventory}
        columns={columns}
        manualPagination={true}
        pageCount={totalPages}
        pageIndex={page - 1}
        onPageChange={(newPage) => setPage(newPage + 1)}
        totalCount={totalCount}
      />

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
    </div>
  );
};

export default InventoryPage;
