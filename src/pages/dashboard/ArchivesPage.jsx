import { archivedAccountColumns, archivedProductColumns } from "@/components/features/archive_components/ArchiveColumns";
import DataTable from "@/components/shared/DataTable";
import { useAccountArchive } from "@/hooks/archive_hooks/useAccountArchive";
import { useProductArchive } from "@/hooks/archive_hooks/useProductArchive";

const ArchivesPage = () => {
  const { 
    archivedProducts, 
    asyncState: productAsyncState, 
    pagination: productPagination, 
    filter: productFilter, 
    updateFilter: updateProductFilter 
  } = useProductArchive();

  // 2. Rename 'filter' and 'updateFilter' for accounts
  const { 
    archivedAccounts, 
    asyncState: accountAsyncState, 
    pagination: accountPagination, 
    filter: accountFilter, 
    updateFilter: updateAccountFilter 
  } = useAccountArchive();

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat pb-8">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-[32px] font-bold text-[#333] mb-2 tracking-tight">Archives</h1>
        <p className="text-gray-400 text-sm">
          A list of all archived items. Items stored for more than 30 days will be automatically deleted.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Accounts Archives</h2>
        <DataTable 
            columns={archivedAccountColumns}
            data={archivedAccounts}
            keyField="accountArchiveId"
            asyncState={accountAsyncState}
            pagination={accountPagination}
            filter={accountFilter}
            updateFilter={updateAccountFilter}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Products Archives</h2>
          <DataTable 
            columns={archivedProductColumns}
            data={archivedProducts}
            keyField="productArchiveId"
            asyncState={productAsyncState}
            pagination={productPagination}
            filter={productFilter}
            updateFilter={updateProductFilter}
          />
      </section>

      

      
      {/* to be removed */}
      {/* AccountArchiveId */}

    </div>
  );
};

export default ArchivesPage;