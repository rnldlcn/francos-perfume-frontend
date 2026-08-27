export const requestedProductsColumns = (onApproveChange, onQtyChange) => [
    {
        accessorKey: "productId",
        header: "ID",
        cell: (row) => row.productId,
    },
    {
        accessorKey: "perfumeName",
        header: "Perfume Name",
        cell: (row) => row.perfumeName,
    },
    {
        accessorKey: "availableQty",
        header: "Available",
        cell: (row) => row.availableQty,
    },
    {
        accessorKey: "requestedQty",
        header: "Requested",
        cell: (row) => row.requestedQty,
    },
    {
        accessorKey: "isApproved",
        header: "Approve?",
        cell: (row) => (
            <input 
                type="checkbox"
                checked={row.isApproved}
                onChange={(e) => onApproveChange(row.productId, e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 accent-custom-black cursor-pointer"
            />
        ),
    },
    {
        accessorKey: "approvedQty",
        header: "Approved Qty",
        cell: (row) => (
            <input 
                type="number"
                disabled={!row.isApproved}
                value={row.approvedQty}
                onChange={(e) => onQtyChange(row.productId, e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100"
            />
        ),
    },
];