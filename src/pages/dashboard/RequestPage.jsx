import { useEffect, useState } from "react";
import { Eye, Send, Inbox, ChevronDown } from "lucide-react";
import DataTable from "@/components/data_components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import CreateRequestModal from "../../components/features/request_components/CreateRequestModal";
import RequestDetailsModal from "../../components/features/request_components/RequestDetailsModal";
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";
import { UseAuth } from "../../services/UseAuth"; // Assuming you need token for DB

const statusOptions = [
  { key: "status", label: "Filter: Status", options: ["All Statuses", "Manager Review", "Owner Review", "Approved", "Rejected"] },
];

const RequestPage = () => {
  const { user } = UseAuth();
  
  // --- STATE ---
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "All Statuses" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState("request"); // 'send' or 'request'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // --- DATABASE FETCH (API INTEGRATION) ---
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // 🔌 UNCOMMENT AND UPDATE THIS WHEN YOUR .NET CONTROLLER IS READY
        /*
        const response = await fetch('https://localhost:5001/api/requests', {
          headers: { 'Authorization': `Bearer ${user.accessToken}` }
        });
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
        */

        // 🚧 FALLBACK DUMMY DATA UNTIL BACKEND IS CONNECTED
        const dummyDbData = [
          { id: "REQ-001", requested_from: "Riverbanks", sent_to: "Sta. Lucia", status: "Manager Review", qty: 24, created_by: "Sample O. Name", date_created: "11/04/2026 12:00 AM" },
          { id: "REQ-002", requested_from: "Riverbanks", sent_to: "Sta. Lucia", status: "Owner Review", qty: 24, created_by: "Sample O. Name", date_created: "11/04/2026 12:00 AM" },
          { id: "REQ-003", requested_from: "Riverbanks", sent_to: "Sta. Lucia", status: "Approved", qty: 24, created_by: "Sample O. Name", date_created: "11/04/2026 12:00 AM" },
          { id: "REQ-004", requested_from: "Riverbanks", sent_to: "Sta. Lucia", status: "Rejected", qty: 24, created_by: "Sample O. Name", date_created: "11/04/2026 12:00 AM" },
        ];
        setRequests(dummyDbData);
      } catch (error) {
        console.error("Database connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user?.accessToken]);

  // --- STATUS BADGE RENDERER ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "Manager Review":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-transparent shadow-none hover:bg-blue-100">🕒 {status}</Badge>;
      case "Owner Review":
        return <Badge variant="outline" className="bg-pink-100 text-pink-700 border-transparent shadow-none hover:bg-pink-100">🕒 {status}</Badge>;
      case "Approved":
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-transparent shadow-none hover:bg-green-100">✓ {status}</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-transparent shadow-none hover:bg-red-100">✕ {status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // --- TABLE COLUMNS ---
  const columns = [
    {
      header: 'REQ ID',
      accessorKey: 'id',
      enableSorting: true
    },
    {
      header: 'From → To',
      id: 'from_to',
      cell: ({ row }) => `${row.original.requested_from} → ${row.original.sent_to}`
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => getStatusBadge(row.original.status)
    },
    {
      header: 'Units',
      accessorKey: 'qty',
      cell: ({ row }) => `${row.original.qty} units`
    },
    {
      header: 'Created By',
      accessorKey: 'created_by',
      enableSorting: true
    },
    {
      header: 'Date Created',
      accessorKey: 'date_created',
      enableSorting: true
    },
    {
      header: 'Action',
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Button variant="outline" size="sm" className="h-8 text-xs bg-[#E5D5C1]/20 hover:bg-[#E5D5C1]/40 border-transparent text-[#333]" onClick={() => handleOpenDetails(item)}>
            <Eye size={14} className="mr-1.5 opacity-70"/> View Details
          </Button>
        )
      }
    }
  ];

  // --- FILTER ENGINE ---
  const filteredData = requests.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    
    // Search by ID, Branch, or Creator as requested in the mockup
    const matchesSearch = 
      item.id.toLowerCase().includes(searchLower) || 
      item.requested_from.toLowerCase().includes(searchLower) || 
      item.sent_to.toLowerCase().includes(searchLower) ||
      item.created_by.toLowerCase().includes(searchLower);
      
    const matchesStatus = !filters.status || filters.status === "All Statuses" || item.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  // --- HANDLERS ---
  const handleOpenNewTransfer = (type) => {
    setRequestType(type);
    setIsModalOpen(true);
  };

  const handleAddRequest = (newRequest) => {
    // Optimistic UI update while DB processes
    setRequests([newRequest, ...requests]);
  };

  const handleOpenDetails = (requestObj) => {
    setSelectedRequest(requestObj);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative font-montserrat">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#333] mb-1 leading-none tracking-tight">Request</h1>
          <p className="text-gray-500 text-sm">View and manage inventory transfer requests</p>
        </div>

        {/* NEW TRANSFER DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] shadow-sm px-4">
              <span className="text-lg leading-none mr-2">+</span> New Transfer <ChevronDown size={16} className="ml-2 opacity-70"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white p-1 rounded-lg border border-gray-200 shadow-lg">
            <DropdownMenuItem 
              onClick={() => handleOpenNewTransfer('send')} 
              className="cursor-pointer gap-3 p-2 hover:bg-gray-50 focus:bg-gray-50 rounded-md"
            >
              <Send size={16} className="opacity-70"/> <span className="font-medium text-[#333]">Send Stock</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleOpenNewTransfer('request')} 
              className="cursor-pointer gap-3 p-2 hover:bg-gray-50 focus:bg-gray-50 rounded-md"
            >
              <Inbox size={16} className="opacity-70"/> <span className="font-medium text-[#333]">Request for Stock</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      {/* MODALS */}
      <RequestDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        request={selectedRequest} 
      />
      
      <CreateRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddRequest} 
        type={requestType} 
      />
    </div>
  );
};

export default RequestPage;