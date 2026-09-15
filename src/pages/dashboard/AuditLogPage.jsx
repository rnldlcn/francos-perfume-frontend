import { auditLogColumns } from "@/components/features/auditlogs_components/AuditLogColumns";
import DataTable from "@/components/shared/DataTable";
import { useAuditLog } from "@/hooks/audit_hooks/useAuditLog.js";
import { Loader2 } from "lucide-react"; // ADDED: Import for the loading spinner

const AuditLogPage = () => {
  const { auditLogs, asyncState, pagination, filter,  updateFilter } = useAuditLog();

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat pb-8">
      {/* FIXED: Replaced border-muted with standard border-border */}
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Audit Logs</h1>
        {/* FIXED: Replaced text-gray-400 with text-muted-foreground */}
        <p className="text-muted-foreground text-sm">
          A comprehensive record of all system activities, inventory changes, and account modifications.
        </p>
      </header>
      
      <div className="flex flex-col gap-12">
        {/* ADDED: Initial loading animation guard for when the logs are first being fetched */}
        {asyncState?.isLoading && (!auditLogs || auditLogs.length === 0) ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Loading audit logs...</p>
          </div>
        ) : (
          <DataTable
            columns={auditLogColumns}
            data={auditLogs}
            keyField="logId"
            asyncState={asyncState}
            pagination={pagination}
            filter={filter}
            updateFilter={updateFilter}
          />
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;