export const discountColumns = [
    {
        header: 'Prefix',
        accessorKey: 'discountPrefix'
    },
    {
        header: 'Discount Name',
        accessorKey: 'discountName'
    },
    {
        header: 'Type',
        accessorKey: 'discountType'
    },
    {
        id: 'discountValue',
        header: 'Value',
        render: (row) => {
            const { discountPercent, discountAmount, discountType } = row || {};
            if (discountType?.toUpperCase() === 'PERCENTAGE') {
                const percentValue = discountPercent < 1 ? discountPercent * 100 : discountPercent;
                return `${percentValue}%`
            }
            return `₱${Number(discountAmount || 0)}`;
        }
    },
    {
        header: 'Status',
        accessorKey: 'discountStatus'
    }
]