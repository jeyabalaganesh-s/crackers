import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Package,
  Image as ImageIcon,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const PRODUCTS_PER_PAGE = 10;

type Product = {
  _id: string;
  productCode: string;
  name: string;
  category: string;
  content: string;
  price: number;
  stockStatus: "available" | "sold_out";
  image: string;
  isActive: boolean;
};

type ProductForm = {
  productCode: string;
  name: string;
  category: string;
  content: string;
  price: string;
  stockStatus: "available" | "sold_out";
  image: string;
  isActive: boolean;
};

type Pagination = {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const emptyForm: ProductForm = {
  productCode: "",
  name: "",
  category: "",
  content: "",
  price: "",
  stockStatus: "available",
  image: "",
  isActive: true,
};

function currency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // ----------------------------------------
  // Server-side filters
  // ----------------------------------------
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ----------------------------------------
  // Server-side pagination
  // ----------------------------------------
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: PRODUCTS_PER_PAGE,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ----------------------------------------
  // Modal
  // ----------------------------------------
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  // ----------------------------------------
  // Headers
  // ----------------------------------------
  const getHeaders = () => {
    const token = sessionStorage.getItem("raja_admin_token");

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  // ----------------------------------------
  // Fetch products
  // Server-side pagination + filtering
  // ----------------------------------------
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("raja_admin_token");

      if (!token) {
        throw new Error(
          "Admin session expired. Please log in again."
        );
      }

      const params = new URLSearchParams();

      params.set("page", String(currentPage));
      params.set("limit", String(PRODUCTS_PER_PAGE));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (categoryFilter !== "all") {
        params.set("category", categoryFilter);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/products/admin/all?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem("raja_admin_token");

          throw new Error(
            data.message ||
              "Your admin session has expired. Please log in again."
          );
        }

        throw new Error(
          data.message || "Unable to load products."
        );
      }

      // ----------------------------------------
      // Products
      // ----------------------------------------
      const list = Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(list);

      // ----------------------------------------
      // Pagination metadata
      // ----------------------------------------
      if (data.pagination) {
        setPagination({
          currentPage:
            Number(data.pagination.currentPage) || currentPage,

          limit:
            Number(data.pagination.limit) ||
            PRODUCTS_PER_PAGE,

          totalProducts:
            Number(data.pagination.totalProducts) || 0,

          totalPages:
            Number(data.pagination.totalPages) || 0,

          hasNextPage:
            Boolean(data.pagination.hasNextPage),

          hasPreviousPage:
            Boolean(data.pagination.hasPreviousPage),
        });
      } else {
        // Fallback if backend does not send pagination
        setPagination({
          currentPage,
          limit: PRODUCTS_PER_PAGE,
          totalProducts: list.length,
          totalPages:
            list.length > 0
              ? Math.ceil(list.length / PRODUCTS_PER_PAGE)
              : 0,
          hasNextPage: false,
          hasPreviousPage: currentPage > 1,
        });
      }

      // ----------------------------------------
      // Categories
      //
      // If backend sends categories, use them.
      // Otherwise keep the existing categories.
      // ----------------------------------------
      if (Array.isArray(data.categories)) {
        setCategories(
          data.categories.filter(
            (category: unknown): category is string =>
              typeof category === "string" &&
              category.trim().length > 0
          )
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, categoryFilter]);

  // ----------------------------------------
  // Fetch whenever page/filter changes
  // ----------------------------------------
  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // ----------------------------------------
  // Reset page when search/category changes
  // ----------------------------------------
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  // ----------------------------------------
  // Keep current page valid
  // ----------------------------------------
  useEffect(() => {
    if (
      pagination.totalPages > 0 &&
      currentPage > pagination.totalPages
    ) {
      setCurrentPage(pagination.totalPages);
    }

    if (
      pagination.totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [pagination.totalPages, currentPage]);

  // ----------------------------------------
  // Add product
  // ----------------------------------------
  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  // ----------------------------------------
  // Edit product
  // ----------------------------------------
  const openEditModal = (product: Product) => {
    setEditingProduct(product);

    setForm({
      productCode: product.productCode || "",
      name: product.name || "",
      category: product.category || "",
      content: product.content || "",
      price: String(product.price ?? ""),
      stockStatus: product.stockStatus || "available",
      image: product.image || "",
      isActive: product.isActive ?? true,
    });

    setError("");
    setNotice("");
    setModalOpen(true);
  };

  // ----------------------------------------
  // Save product
  // ----------------------------------------
  const handleSave = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid, non-negative price.");
      setSaving(false);
      return;
    }

    try {
      const isEditing = Boolean(editingProduct);

      const url = isEditing
        ? `${API_BASE_URL}/api/products/${editingProduct!._id}`
        : `${API_BASE_URL}/api/products`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          ...form,
          price,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not save product. Check that your backend route is implemented."
        );
      }

      setModalOpen(false);

      setNotice(
        isEditing
          ? "Product updated successfully."
          : "Product added successfully."
      );

      await fetchProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // Delete product
  // ----------------------------------------
  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action may not be reversible.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete product."
        );
      }

      setNotice("Product deleted successfully.");

      // Refetch from server so pagination/count stays correct
      await fetchProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete the product."
      );
    }
  };

  // ----------------------------------------
  // Update form field
  // ----------------------------------------
  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // ----------------------------------------
  // Pagination numbers
  // ----------------------------------------
  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, index) => index + 1
  );

  // ----------------------------------------
  // Result range
  // ----------------------------------------
  const startItem =
    pagination.totalProducts === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const endItem =
    pagination.totalProducts === 0
      ? 0
      : Math.min(
          currentPage * PRODUCTS_PER_PAGE,
          pagination.totalProducts
        );

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className="min-h-screen bg-stone-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-800">
              Raja Agencies
            </p>

            <h1 className="mt-1 text-3xl font-bold text-stone-900">
              Products
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage your catalogue, prices, images and stock availability.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void fetchProducts()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-red-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-900"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {notice && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {notice}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Products",
              value: pagination.totalProducts,
            },
            {
              label: "Available",
              value: products.filter(
                (p) => p.stockStatus === "available"
              ).length,
            },
            {
              label: "Sold Out",
              value: products.filter(
                (p) => p.stockStatus === "sold_out"
              ).length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-red-50 p-3 text-red-800">
                  <Package size={20} />
                </span>

                <div>
                  <p className="text-sm text-stone-500">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-stone-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PRODUCTS TABLE */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

          {/* SEARCH */}
          <div className="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, code or category..."
                className="w-full rounded-xl border border-stone-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-700"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-700"
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE CONTENT */}
          {loading ? (
            <div className="p-12 text-center text-sm text-stone-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package
                size={36}
                className="mx-auto text-stone-300"
              />

              <p className="mt-3 font-semibold text-stone-800">
                No products found
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Try another search or add your first product.
              </p>
            </div>
          ) : (
            <>
              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                    <tr>
                      <th className="px-5 py-4">
                        Product
                      </th>

                      <th className="px-5 py-4">
                        Code
                      </th>

                      <th className="px-5 py-4">
                        Category
                      </th>

                      <th className="px-5 py-4">
                        Price
                      </th>

                      <th className="px-5 py-4">
                        Stock
                      </th>

                      <th className="px-5 py-4">
                        Visibility
                      </th>

                      <th className="px-5 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-stone-50"
                      >
                        {/* PRODUCT */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-100">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  loading="lazy"
                                  className="h-full w-full object-contain"
                                  onError={(event) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <ImageIcon
                                  size={22}
                                  className="text-stone-400"
                                />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-stone-900">
                                {product.name}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs text-stone-500">
                                {product.content}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CODE */}
                        <td className="px-5 py-4 text-stone-600">
                          {product.productCode || "—"}
                        </td>

                        {/* CATEGORY */}
                        <td className="px-5 py-4 text-stone-600">
                          {product.category || "—"}
                        </td>

                        {/* PRICE */}
                        <td className="px-5 py-4 font-semibold text-stone-900">
                          {currency(product.price)}
                        </td>

                        {/* STOCK */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              product.stockStatus ===
                              "available"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.stockStatus ===
                            "available"
                              ? "Available"
                              : "Sold Out"}
                          </span>
                        </td>

                        {/* VISIBILITY */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              product.isActive
                                ? "bg-blue-100 text-blue-700"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {product.isActive
                              ? "Active"
                              : "Hidden"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Edit ${product.name}`}
                              onClick={() =>
                                openEditModal(product)
                              }
                              className="rounded-lg border border-stone-200 p-2 text-stone-600 hover:bg-amber-50 hover:text-amber-800"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              aria-label={`Delete ${product.name}`}
                              onClick={() =>
                                void handleDelete(product)
                              }
                              className="rounded-lg border border-stone-200 p-2 text-stone-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {pagination.totalPages > 0 && (
                <div className="flex flex-col gap-4 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* RESULT COUNT */}
                  <p className="text-xs text-stone-500">
                    Showing{" "}
                    <span className="font-semibold text-stone-700">
                      {startItem}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-stone-700">
                      {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-stone-700">
                      {pagination.totalProducts}
                    </span>{" "}
                    products
                  </p>

                  {/* PAGINATION CONTROLS */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-1">

                      {/* PREVIOUS */}
                      <button
                        type="button"
                        disabled={
                          !pagination.hasPreviousPage ||
                          loading
                        }
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.max(1, page - 1)
                          )
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />

                        <span className="hidden sm:inline">
                          Previous
                        </span>
                      </button>

                      {/* PAGE NUMBERS */}
                      <div className="flex items-center gap-1">
                        {pageNumbers.map((page) => (
                          <button
                            key={page}
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              setCurrentPage(page)
                            }
                            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                              currentPage === page
                                ? "bg-red-800 text-white"
                                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      {/* NEXT */}
                      <button
                        type="button"
                        disabled={
                          !pagination.hasNextPage ||
                          loading
                        }
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(
                              pagination.totalPages,
                              page + 1
                            )
                          )
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="hidden sm:inline">
                          Next
                        </span>

                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* FOOTER WHEN ONLY ONE PAGE */}
              {!loading &&
                pagination.totalProducts > 0 &&
                pagination.totalPages <= 1 && (
                  <div className="border-t border-stone-100 px-5 py-4 text-xs text-stone-500">
                    Showing {pagination.totalProducts}{" "}
                    product
                    {pagination.totalProducts === 1
                      ? ""
                      : "s"}
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-stone-100 p-5">
              <div>
                <h2
                  id="product-dialog-title"
                  className="text-xl font-bold text-stone-900"
                >
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Enter product details for the store catalogue.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close form"
                onClick={() =>
                  setModalOpen(false)
                }
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-5 p-5"
            >
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-stone-700">
                  Product code

                  <input
                    required
                    value={form.productCode}
                    onChange={(e) =>
                      updateField(
                        "productCode",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 outline-none focus:border-red-700"
                    placeholder="e.g. RA001"
                  />
                </label>

                <label className="text-sm font-medium text-stone-700">
                  Product name

                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      updateField(
                        "name",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 outline-none focus:border-red-700"
                    placeholder="Product name"
                  />
                </label>

                <label className="text-sm font-medium text-stone-700">
                  Category

                  <input
                    required
                    value={form.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 outline-none focus:border-red-700"
                    placeholder="e.g. Sparklers"
                  />
                </label>

                <label className="text-sm font-medium text-stone-700">
                  Price (₹)

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      updateField(
                        "price",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 outline-none focus:border-red-700"
                    placeholder="0.00"
                  />
                </label>

                <label className="text-sm font-medium text-stone-700">
                  Stock status

                  <select
                    value={form.stockStatus}
                    onChange={(e) =>
                      updateField(
                        "stockStatus",
                        e.target.value as ProductForm["stockStatus"]
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 outline-none focus:border-red-700"
                  >
                    <option value="available">
                      Available
                    </option>

                    <option value="sold_out">
                      Sold Out
                    </option>
                  </select>
                </label>

                <label className="text-sm font-medium text-stone-700">
                  Visibility

                  <select
                    value={String(form.isActive)}
                    onChange={(e) =>
                      updateField(
                        "isActive",
                        e.target.value === "true"
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 outline-none focus:border-red-700"
                  >
                    <option value="true">
                      Active on store
                    </option>

                    <option value="false">
                      Hidden from store
                    </option>
                  </select>
                </label>
              </div>

              <label className="block text-sm font-medium text-stone-700">
                Product description / content

                <textarea
                  rows={3}
                  value={form.content}
                  onChange={(e) =>
                    updateField(
                      "content",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 outline-none focus:border-red-700"
                  placeholder="Pack size, contents and other details"
                />
              </label>

              <label className="block text-sm font-medium text-stone-700">
                Product image URL

                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    updateField(
                      "image",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 outline-none focus:border-red-700"
                  placeholder="https://example.com/product-image.jpg"
                />

                <span className="mt-2 block text-xs font-normal text-stone-500">
                  Use a publicly accessible image URL. This
                  field does not upload a file.
                </span>
              </label>

              {form.image && (
                <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-3">
                  <img
                    src={form.image}
                    alt="Product preview"
                    className="h-20 w-20 rounded-lg bg-white object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <p className="text-sm text-stone-600">
                    Image preview
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                  className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-red-800 px-5 py-3 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}