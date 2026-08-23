
import { useAuth } from "@/auth/UseAuth";
import { requestColumns } from "@/components/features/request_components/RequestColumns";
import RequestDetailsPage from "@/components/features/request_components/RequestDetailsPage";
import { FilterDropDown, SearchBar } from "@/components/shared";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/request_hooks/useRequest";
import { ArrowDownLeft, ArrowUpRight, Eye, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const RequestPage = () => {
    const navigate = useNavigate(); 
    const { user } = useAuth();
    const {
        requests,
        asyncState,
        pagination,
        filter,
        fetchRequest,
        updateFilter,
        filterOptions,
        fetchRequestDetails
    } = useRequest();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const requestId = searchParams.get("requestId");
    const isRequestDetailsPageOpen = Boolean(requestId);

    const handleChangeDirection = (direction) => {
        updateFilter('direction', direction);
        updateFilter('pageCount', 1);
    }

    const handleRowClick = async (row) => {
        if (selectedRequest?.requestId === row.requestId) {
            setSelectedRequest(null);
            return;
        }

        setSelectedRequest(row);    

        const request = await fetchRequestDetails(row.requestId);
        if (request) {
            setSelectedRequest(prev => prev ? { ...prev, ...request }: request);
        }
    }

    const handleViewRequest = (row) => {
        const request = row || selectedRequest
        if(request) {
            navigate(`/home/requests/${request.requestId}`);
        }
    }

    const handleClose = () => {
        setSearchParams({});
    }
  

    const handleSearchChange = (value) => {
        const query = value?.target ? value.target.value : value;
        setSearchQuery(query);
        updateFilter('search', query);
    }

    return (
        <div className="flex flex-col h-full animate-fade-in relative font-montserrat">
        <div className="flex justify-between items-end mb-6">

            <div>
                <h1 className="text-3xl font-bold text-custom-black mb-1 leading-none tracking-tight">Requests</h1>
                <p className="text-foreground text-sm">View and manage inventory transfer requests</p>
            </div>

                <Button 
                variant="default"
                onClick={() => navigate('/home/new-transfer')} 
                >
                    <Plus className="w-4 h-4"/> New Transfer
                </Button>
        </div>

        <div className="w-full justify-between items-center gap-3 mb-2 grid grid-cols-3">

            <Button
                variant={filter.direction === "INBOUND" ? "default" : "outline"}
                disabled={user.branchLocation === "WAREHOUSE"}
                onClick={() => handleChangeDirection("INBOUND")}
            >
                <ArrowDownLeft className="w-4 h-4" />
                    Inbound
            </Button>

            <Button
                variant={filter.direction === "OUTBOUND" ? "default" : "outline"}
                onClick={() => handleChangeDirection("OUTBOUND")}
            >
                <ArrowUpRight className="w-4 h-4" />
                Outbound
            </Button>

            <Button
                variant={filter.direction === "" ? "default" : "outline"}
                onClick={() => handleChangeDirection("")}
                className="flex items-center gap-2"
            >
                <ListFilter className="w-4 h-4" />
                All Requests
            </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="w-full sm:max-w-xl">
                <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <FilterDropDown 
                    filter={filter}
                    updateFilter={updateFilter}
                    filterOptions={filterOptions}
                />
            </div>

        </div>

            <DataTable 
                columns={requestColumns}
                data={requests}
                keyField="requestId"
                asyncState={asyncState}
                pagination={pagination}
                filter={filter}
                updateFilter={updateFilter}
                selectedItem={selectedRequest}
                onRowClick={handleRowClick}
                onRowDoubleClick={(row) => {
                    handleRowClick(row);
                    handleViewRequest(row);
                }}
            />
        <div className="flex justify-end">
            <Button
                variant={selectedRequest ? "default" : "ghost"}
                disabled={!selectedRequest}
                onClick={() => handleViewRequest(selectedRequest)}
                >
                <Eye className="h-8 w-8"/>
                View Request
            </Button>
        </div>

        {isRequestDetailsPageOpen && (
            <RequestDetailsPage 
                onClose={handleClose}
            />
        )};

        </div>
  );
};

export default RequestPage;