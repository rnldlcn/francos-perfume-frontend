import { formatLabel } from "@/utils/formattingUtils";

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
        accessorKey: "paymentMethod",
         render: (row) => formatLabel(row.paymentMethod) || "N/A"
    },
    
]