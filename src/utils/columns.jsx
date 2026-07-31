import { formatDateTimeForTable } from "./dateFormatUtils";

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
        accessorKey: "branchLocation"
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

export const transactionColumns = [
    {
        header: "Date Received",
        accessorKey: "transactionDate"
    },
    {
        header: "Sales Order ID",
        accessorKey: "salesOrderId"
    },
    {
        header: "Perfume Sold",
        render: (transaction) => {
            const products = transaction.productList;
            return Array.isArray(products) && products.length > 0
                ? products.map((product) => product.productName).join(', ')
                : 'No products'
        },
    },
    {
        header: "Amount",
        render: (row) => {
            return (
                <span className="text-custom-green">
                    ₱ {Math.abs(row.amount ?? 0).toLocaleString()}
                </span>
            )
        }
    },
    {
        header: "Processed By",
        accessorKey: "processedBy"
    },
    {
        header: "Payment Method",
        accessorKey: "paymentMethod"
    },
    
]

export const archivedAccountColumns = [
    {
        header: "Employee ID",
        accessorKey: "employeeDisplayId"
    },
    {
        header: "Branch",
        accessorKey: "branchId"
    },
    {
        header: "Email",
        accessorKey: "email"
    },
    {
        header: "Role",
        accessorKey: "employeeRole" 
    },
    {
        header: "Date Archived",
        accessorKey: "dateArchived",
        render: (row) => formatDateTimeForTable(row.dateArchived) || "N/A"
    },
    {
        header: "Archived By",
        accessorKey: "archivedBy"
    }
]

export const archivedProductColumns = [
    {
        header: "Product ID",
        accessorKey: "productDisplayId"
    },
    {
        header: "Product Name",
        accessorKey: "productName"
    },
    {
        header: "Date Archived",
        accessorKey: "dateArchived",
        render: (row) => formatDateTimeForTable(row.dateArchived) || "N/A"
    },
    {
        header: "Archived By",
        accessorKey: "archivedBy"
    }
]

export const accountColumns = [
    {
        header: "Employee ID",
        accessorKey: "employeeDisplayId"
    },
    {
        header: "Email",
        accessorKey: "email"
    },
    {
        header: "Name",
        render: (row) => `${row.lastName}, ${row.firstName}`
    },
    {
        header: "Branch",
        accessorKey: "branchLocation"
    },
    {
        header: "Role",
        accessorKey: "employeeRole"
    },
    {
        header: "Status",
        accessorKey: "status"
    }
]