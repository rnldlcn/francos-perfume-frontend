import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Eye } from "lucide-react"; 
import DataTable from "@/components/data_components/DataTable";
import { Button } from "@/components/ui/button";

import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";
import { UseAuth } from "../../services/UseAuth";
import { RequestService } from "../../services/RequestService";
import StatusBadge from "../../components/shared/StatusBadge"; // <-- IMPORTED YOUR NEW COMPONENT

const statusOptions = [
  { key: "status", label: "Filter: Status", options: ["All Statuses", "PENDING MANAGER", "PENDING OWNER", "APPROVED", "REJECTED"] },
];

const RequestPage = () => {
  const { user } = UseAuth();
  const navigate = useNavigate(); 
  
  // --- STATE ---
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "All Statuses" });

  // --- DATABASE FETCH (API INTEGRATION) ---
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // LIVE API CALL - Matches your RequestController.DisplayRequests method
        const response = await RequestService.getAllRequests();
        
        // The C# controller returns: { totalRequests, totalPages, page, pageSize, data: [...] }
        setRequests(response.data || []); 
      } catch (error) {
        console.error("Database connection error:", error);
        alert("Failed to load requests from the database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user?.accessToken]);

  // --- TABLE COLUMNS (Updated to match DisplayRequestDTO.cs) ---
  const columns = [
    {
      header: 'REQ ID',
      accessorKey: 'request_display_id', // Mapped to C# DTO
      enableSorting: true
    },
    {
      header: 'From → To',
      id: 'from_to',
      cell: ({ row }) => `${row.original.requested_from} → ${row.original.delivered_to}` // Mapped to C# DTO
    },
    {
      header: 'Status',
      accessorKey: 'request_status', // Mapped to C# DTO
      // 🔧 FIXED: Replaced the bulky switch statement with your clean component
      cell: ({ row }) => <StatusBadge status={row.original.request_status} />
    },
    {
      header: 'Total Items',
      accessorKey: 'item_count', // Mapped to C# DTO
      cell: ({ row }) => `${row.original.item_count} items`
    },
    {
      header: 'Created By',
      accessorKey: 'employee_display_id', // Mapped to C# DTO
      enableSorting: true
    },
    {
      header: 'Date Created',
      accessorKey: 'request_date_submitted', // Mapped to C# DTO
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.request_date_submitted).toLocaleDateString()
    },
    {
      header: 'Action',
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-[#E5D5C1]/20 hover:bg-[#E5D5C1]/40 border-transparent text-[#333]" 
            // Navigates using the database INT ID for the backend lookup
            onClick={() => navigate(`/home/requests/${item.request_id}`)}
          >
            <Eye size={14} className="mr-1.5 opacity-70"/> View Details
          </Button>
        )
      }
    }
  ];

  // --- FILTER ENGINE ---
  const filteredData = requests.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    
    // Updated to search against the correct C# DTO properties
    const matchesSearch = 
      (item.request_display_id?.toLowerCase() || "").includes(searchLower) || 
      (item.requested_from?.toLowerCase() || "").includes(searchLower) || 
      (item.delivered_to?.toLowerCase() || "").includes(searchLower) ||
      (item.employee_display_id?.toLowerCase() || "").includes(searchLower);
      
    const matchesStatus = !filters.status || filters.status === "All Statuses" || item.request_status === filters.status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full animate-fade-in relative font-montserrat">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#333] mb-1 leading-none tracking-tight">Requests</h1>
          <p className="text-gray-500 text-sm">View and manage inventory transfer requests</p>
        </div>

        {/* DIRECT ROUTING BUTTON TO CREATE PAGE */}
        <Button 
          variant="primary" 
          className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] shadow-sm px-4 font-semibold"
          onClick={() => navigate('/home/new-transfer')} 
        >
          <span className="text-lg leading-none mr-2">+</span> New Transfer
        </Button>
      </div>

      {/* FILTER SECTION */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="w-full max-w-xl">
          <SearchBar 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)} 
            placeholder="Search by ID, branch, or creator"
          />
        </div>
        <div className="w-64">
          <FilterBar filters={filters} setFilters={setFilters} filterSelections={statusOptions} />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1">
        {isLoading ? (
           <div className="p-10 text-center text-gray-400">Loading requests from database...</div>
        ) : (
          <DataTable 
            data={filteredData}
            columns={columns}
          />
        )}
      </div>

    </div>
  );
};

export default RequestPage;