import { formatDateTimeForTable, formatLabel } from "@/utils/formattingUtils";

export const auditLogColumns = [
    {
        header: "Log ID",
        accessorKey: "logDisplayId"
    },
    {
        header: "Employee ID",
        accessorKey: "employeeDisplayId"
    },
    {
        header: "Branch",
        accessorKey: "branchLocation",
        render: (row) => formatLabel(row.branchLocation) || "N/A"
    },
    {
        header: "Module",
        accessorKey: "logModule"
    },
    {
        header: "Action",
        accessorKey: "logAction"
    },
    {
        header: "Timestamp",
        accessorKey: "logTimestamp",
        render: (row) => formatDateTimeForTable(row.logTimestamp) || "N/A"
    }
]