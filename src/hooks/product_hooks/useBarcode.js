import {
    generateBarcode,
    getProductsForBarcode,
    printBarcode,
    saveBarcodePdf
} from "@/services/BarcodeService";
import { useCallback, useEffect, useRef, useState } from "react";

export const useBarcode = () => {
    const isFirstLoad = useRef(true);

    const [asyncState, setAsyncState] = useState({
        isLoading: true,
        isFetching: false,
        isGenerating: false,
        isPrinting: false,
        isSaving: false,
        error: null,
    });

    const [allProducts, setAllProducts] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalEntries: 0 });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [barcodeValue, setBarcodeValue] = useState(null);
    const [lastGenerated, setLastGenerated] = useState(null);
    const [printQty, setPrintQty] = useState(1);

    const fetchProducts = useCallback(async (search = "") => {
        if (isFirstLoad.current) {
            setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        } else {
            setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
        }

        try {
            const pageSize = 500;
            const result = await getProductsForBarcode({ pageSize, search });

            // Deduplicate by productId (same product can appear in multiple batches)
            const seen = new Set();
            const unique = (result.data || []).filter((p) => {
                if (seen.has(p.product_id)) return false;
                seen.add(p.product_id);
                return true;
            });

            isFirstLoad.current = false;
            setAllProducts(unique);
            setPagination({
                totalPages: 1,
                totalEntries: unique.length,
            });
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false, isFetching: false }));
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const selectProduct = useCallback(
        async (product) => {
            setSelectedProduct(product);
            setBarcodeValue(product.product_barcode || null);

            // TODO: replace with real getProductBarcode() call when backend is ready
            // const existing = await getProductBarcode(product.productId);
            // setBarcodeValue(existing ?? product.productBarcode ?? null);

            setLastGenerated(
                product.product_barcode_last_generated
                    ? new Date(product.product_barcode_last_generated).toLocaleDateString()
                    : null
            );
            setPrintQty(1);
        },
        []
    );

    const regenerateBarcode = useCallback(async () => {
        if (!selectedProduct) return;
        setAsyncState((prev) => ({ ...prev, isGenerating: true, error: null }));

        try {
            const newBarcode = await generateBarcode(selectedProduct.product_id);
            setBarcodeValue(newBarcode);
            setLastGenerated(new Date().toLocaleDateString());
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isGenerating: false }));
        }
    }, [selectedProduct]);

    const handlePrint = useCallback(async () => {
        if (!selectedProduct) return;
        setAsyncState((prev) => ({ ...prev, isPrinting: true, error: null }));

        try {
            await printBarcode({ productId: selectedProduct.product_id, quantity: printQty });
            // TODO: open print dialog or download blob when real endpoint is available
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isPrinting: false }));
        }
    }, [selectedProduct, printQty]);

    const handleSavePdf = useCallback(async () => {
        if (!selectedProduct) return;
        setAsyncState((prev) => ({ ...prev, isSaving: true, error: null }));

        try {
            const blob = await saveBarcodePdf({ productId: selectedProduct.product_id, quantity: printQty });
            // TODO: trigger download when real endpoint returns a blob
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `barcode_${selectedProduct.product_display_id}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isSaving: false }));
        }
    }, [selectedProduct, printQty]);

    const searchProducts = useCallback(
        (query) => {
            fetchProducts(query);
        },
        [fetchProducts]
    );

    return {
        allProducts,
        asyncState,
        pagination,
        selectedProduct,
        barcodeValue,
        lastGenerated,
        printQty,
        setPrintQty,
        selectProduct,
        setPrintQty,
        fetchProducts,
        searchProducts,
        regenerateBarcode,
        handlePrint,
        handleSavePdf,
    };
};
