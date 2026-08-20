const STATUS_STYLES = {
  'PENDING': 'bg-amber-100 text-amber-800 border-amber-300',
  'FOR DISPATCH': 'bg-purple-100 text-purple-800 border-purple-300',
  'IN TRANSIT': 'bg-blue-100 text-blue-800 border-blue-300',
  'APPROVED': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'COMPLETED': 'bg-green-100 text-green-800 border-green-300',
  'REJECTED': 'bg-rose-100 text-rose-800 border-rose-300',
};

const STAGE_STYLES = {
  'DESTINATION BRANCH MANAGER': 'bg-sky-100 text-sky-800 border-sky-300',
  'SOURCE BRANCH MANAGER': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'OWNER': 'bg-violet-100 text-violet-800 border-violet-300',
};

export const requestColumns = [
    {
        header: "Request ID",
        accessorKey: "requestDisplayId"
    },
    {
        id: 'route',
        header: 'From → To',
        render: (row) => {
            const { requestedFrom, deliveredTo } = row || {};
            return `${requestedFrom} → ${deliveredTo}`
        }
    },
    {
        id: 'status',
        header: 'Status',
        render: (row) => {
            const status = row?.requestStatus || "N/A";
            const style = STATUS_STYLES[status] 
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
                    {status}
                </span>
            );
        }
    },
    {
        header: 'Item Count',
        accessorKey: 'itemCount'
    },
    {
        header: "Stage",
        render: (row) => {
            const stage = row?.requestStage || "N/A";
            const style = STAGE_STYLES[stage];
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
                    {stage}
                </span>
            )
        }
    },
]