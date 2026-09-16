import apiClient from "./ApiClient";

const PATH = "/Barcode";

// ─── TODO (Backend) ────────────────────────────────────────────────────────────
// Replace these stub functions with real endpoints once BarcodeController
// is implemented in the backend. Expected endpoints:
//   POST /api/Barcode/generate    → generate a barcode for a product
//   POST /api/Barcode/print      → return printable label data (PDF/blob)
//   POST /api/Barcode/savePdf     → save barcode label as PDF
//   GET  /api/Barcode/byProduct/{productId} → get existing barcode for a product
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all products that may have (or need) barcodes.
 * Currently proxies to /Inventory/displayAll — replace with a dedicated
 * /Barcode/products endpoint when available.
 * @param {object} filter
 * @returns {Promise<object>} { data: Product[] }
 */
export const getProductsForBarcode = async (filter = {}) => {
    const response = await apiClient.get("/Inventory/displayAll", { params: filter });
    return response.data;
};

/**
 * Generate (or regenerate) a barcode for a given product.
 * Stub — backend endpoint not yet implemented.
 * @param {number} productId
 * @returns {Promise<string>} The generated barcode string
 */
export const generateBarcode = async (productId) => {
    // TODO: replace with POST /api/Barcode/generate
    console.warn("[BarcodeService] generateBarcode — backend not implemented, returning mock data");
    await new Promise((r) => setTimeout(r, 500)); // simulate network
    // Return a random EAN-13-like string for demo
    const mock = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join("");
    return mock;
};

/**
 * Print barcode labels for a product.
 * Stub — backend endpoint not yet implemented.
 * @param {{ productId: number, quantity: number }} dto
 * @returns {Promise<void>}
 */
export const printBarcode = async ({ productId, quantity }) => {
    // TODO: replace with POST /api/Barcode/print
    console.warn("[BarcodeService] printBarcode — backend not implemented", { productId, quantity });
    await new Promise((r) => setTimeout(r, 500));
};

/**
 * Save barcode label as PDF.
 * Stub — backend endpoint not yet implemented.
 * @param {{ productId: number, quantity: number }} dto
 * @returns {Promise<void>}
 */
export const saveBarcodePdf = async ({ productId, quantity }) => {
    // TODO: replace with POST /api/Barcode/savePdf
    console.warn("[BarcodeService] saveBarcodePdf — backend not implemented", { productId, quantity });
    await new Promise((r) => setTimeout(r, 500));
};

/**
 * Get the last-generated barcode for a product (for display purposes).
 * Stub — backend endpoint not yet implemented.
 * @param {number} productId
 * @returns {Promise<string|null>}
 */
export const getProductBarcode = async (productId) => {
    // TODO: replace with GET /api/Barcode/byProduct/{productId}
    console.warn("[BarcodeService] getProductBarcode — backend not implemented");
    await new Promise((r) => setTimeout(r, 200));
    return null;
};
