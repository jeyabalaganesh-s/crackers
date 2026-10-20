import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Phone,
  MapPin,
  CalendarDays,
  Download,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const ORDERS_PER_PAGE = 10;

type OrderItem = {
  product?: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  content?: string;
};

type Customer = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

type Order = {
  _id: string;
  orderNumber?: string;
  customer?: Customer;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  status: string;
  paymentStatus?: string;
  createdAt?: string;
};

const statusOptions = [
  "pending",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function getStatusClass(status: string) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-purple-100 text-purple-700";

    case "completed":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [editingSummary, setEditingSummary] =
    useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token =
        sessionStorage.getItem("raja_admin_token");

      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders."
        );
      }

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
          ? data.orders
          : [];

      setOrders(orderList);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // --------------------------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------------------------

  const updateOrderStatus = async (
    order: Order,
    status: string
  ) => {
    const confirmed = window.confirm(
      `Change order ${
        order.orderNumber || order._id
      } to "${status}"?`
    );

    if (!confirmed) return;

    setUpdatingId(order._id);
    setError("");

    try {
      const token =
        sessionStorage.getItem("raja_admin_token");

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${order._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Status update failed. Check your backend status-update route."
        );
      }

      const updatedOrder = data.order;

      setOrders((previous) =>
        previous.map((item) =>
          item._id === order._id
            ? {
                ...item,
                ...(updatedOrder || {}),
                status,
              }
            : item
        )
      );

      setSelectedOrder((previous) =>
        previous?._id === order._id
          ? {
              ...previous,
              ...(updatedOrder || {}),
              status,
            }
          : previous
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------------------------
  // DOWNLOAD ORDER SUMMARY
  // --------------------------------------------------

  const downloadOrderSummary = () => {
    if (!selectedOrder || !summaryRef.current) {
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      setError(
        "Please allow pop-ups to download the order summary."
      );
      return;
    }

    const summaryHtml =
      summaryRef.current.innerHTML;

    const orderLabel =
      selectedOrder.orderNumber ||
      selectedOrder._id.slice(-8);

    printWindow.document.open();

    printWindow.document.write(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />

  <title>
    Order Summary - ${orderLabel}
  </title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      color: #292524;
      padding: 28px;
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    h1 {
      color: #991b1b;
      margin-bottom: 4px;
    }

    .brand {
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #991b1b;
      font-weight: bold;
    }

    .muted {
      color: #78716c;
      font-size: 12px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin: 24px 0;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }

    th,
    td {
      padding: 10px;
      border-bottom: 1px solid #e7e5e4;
      text-align: left;
    }

    th {
      background: #f5f5f4;
      font-size: 11px;
      text-transform: uppercase;
    }

    .text-right {
      text-align: right;
    }

    button,
    select {
      display: none !important;
    }

    [contenteditable="true"] {
      outline: none;
    }

    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>

<body>

  <div class="brand">
    Raja Agencies
  </div>

  <h1>
    Order Summary
  </h1>

  <p class="muted">
    Order ${orderLabel} · Generated ${new Date().toLocaleString(
      "en-IN"
    )}
  </p>

  ${summaryHtml}

  <script>
    window.onload = () => {
      window.focus();
      window.print();
    };
  </script>

</body>
</html>
`);

    printWindow.document.close();
  };

  // --------------------------------------------------
  // FILTER ORDERS
  // --------------------------------------------------

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = order.customer || {};

      const searchable = [
        order.orderNumber,
        customer.name,
        customer.phone,
        customer.email,
        order.customerName,
        order.customerPhone,
        order.customerEmail,
        order._id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchable.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        order.status?.toLowerCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.ceil(
    filteredOrders.length / ORDERS_PER_PAGE
  );

  const paginatedOrders = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ORDERS_PER_PAGE;

    return filteredOrders.slice(
      startIndex,
      startIndex + ORDERS_PER_PAGE
    );
  }, [filteredOrders, currentPage]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Prevent invalid page after filtering
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startOrder =
    filteredOrders.length === 0
      ? 0
      : (currentPage - 1) *
          ORDERS_PER_PAGE +
        1;

  const endOrder = Math.min(
    currentPage * ORDERS_PER_PAGE,
    filteredOrders.length
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const pendingCount = orders.filter(
    (order) =>
      order.status?.toLowerCase() ===
      "pending"
  ).length;

  const confirmedCount = orders.filter(
    (order) =>
      order.status?.toLowerCase() ===
      "confirmed"
  ).length;

  const completedCount = orders.filter(
    (order) =>
      order.status?.toLowerCase() ===
      "completed"
  ).length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
              Order Enquiries
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Review customer orders and manage their status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchOrders()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              label: "Total Enquiries",
              value: orders.length,
              icon: Package,
              color:
                "text-stone-700 bg-stone-100",
            },
            {
              label: "Pending",
              value: pendingCount,
              icon: Clock,
              color:
                "text-amber-700 bg-amber-100",
            },
            {
              label: "Confirmed",
              value: confirmedCount,
              icon: CheckCircle,
              color:
                "text-blue-700 bg-blue-100",
            },
            {
              label: "Completed",
              value: completedCount,
              icon: CheckCircle,
              color:
                "text-green-700 bg-green-100",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <p className="text-sm text-stone-500">
                    {stat.label}
                  </p>

                  <span
                    className={`rounded-xl p-3 ${stat.color}`}
                  >
                    <Icon size={19} />
                  </span>

                </div>

                <p className="mt-4 text-3xl font-bold text-stone-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ORDERS */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

          {/* SEARCH + FILTER */}
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
                placeholder="Search order number, customer or phone..."
                className="w-full rounded-xl border border-stone-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-700"
            >
              <option value="all">
                All statuses
              </option>

              {statusOptions.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="p-12 text-center text-sm text-stone-500">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">

              <Package
                size={36}
                className="mx-auto text-stone-300"
              />

              <p className="mt-3 font-semibold text-stone-800">
                No orders found
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Try changing your search or status filter.
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
                        Order
                      </th>

                      <th className="px-5 py-4">
                        Customer
                      </th>

                      <th className="px-5 py-4">
                        Items
                      </th>

                      <th className="px-5 py-4">
                        Total
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4">
                        Action
                      </th>
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-stone-100">

                    {paginatedOrders.map((order) => {
                      const customer =
                        order.customer || {};

                      return (
                        <tr
                          key={order._id}
                          className="hover:bg-stone-50"
                        >

                          {/* ORDER */}
                          <td className="px-5 py-4 font-semibold text-stone-900">
                            {order.orderNumber ||
                              order._id.slice(-8)}
                          </td>

                          {/* CUSTOMER */}
                          <td className="px-5 py-4">

                            <p className="font-medium text-stone-800">
                              {customer.name ||
                                order.customerName ||
                                "Customer"}
                            </p>

                            <p className="mt-1 text-xs text-stone-500">
                              {customer.phone ||
                                order.customerPhone ||
                                "No phone"}
                            </p>

                          </td>

                          {/* ITEMS */}
                          <td className="px-5 py-4 text-stone-600">
                            {order.items?.reduce(
                              (total, item) =>
                                total +
                                item.quantity,
                              0
                            ) || 0}{" "}
                            units
                          </td>

                          {/* TOTAL */}
                          <td className="px-5 py-4 font-semibold text-stone-900">
                            {formatCurrency(
                              order.subtotal
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">

                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {order.status ||
                                "pending"}
                            </span>

                          </td>

                          {/* DATE */}
                          <td className="px-5 py-4 text-stone-500">

                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}

                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4">

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(
                                  order
                                );

                                setEditingSummary(
                                  false
                                );
                              }}
                              className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 font-medium text-stone-700 hover:border-red-200 hover:bg-red-50 hover:text-red-800"
                            >
                              <Eye size={15} />

                              View
                            </button>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="border-t border-stone-100 px-5 py-4">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* RESULT COUNT */}
                  <p className="text-xs text-stone-500">

                    Showing{" "}

                    <span className="font-semibold text-stone-700">
                      {startOrder}
                    </span>

                    {" "}to{" "}

                    <span className="font-semibold text-stone-700">
                      {endOrder}
                    </span>

                    {" "}of{" "}

                    <span className="font-semibold text-stone-700">
                      {filteredOrders.length}
                    </span>

                    {" "}orders

                  </p>

                  {/* PAGINATION CONTROLS */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">

                      {/* PREVIOUS */}
                      <button
                        type="button"
                        disabled={
                          currentPage === 1
                        }
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.max(
                                1,
                                page - 1
                              )
                          )
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft
                          size={16}
                        />

                        <span className="hidden sm:inline">
                          Previous
                        </span>
                      </button>

                      {/* PAGE NUMBERS */}
                      <div className="flex items-center gap-1">

                        {pageNumbers.map(
                          (page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() =>
                                setCurrentPage(
                                  page
                                )
                              }
                              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                                currentPage ===
                                page
                                  ? "bg-red-800 text-white"
                                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}

                      </div>

                      {/* NEXT */}
                      <button
                        type="button"
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.min(
                                totalPages,
                                page + 1
                              )
                          )
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="hidden sm:inline">
                          Next
                        </span>

                        <ChevronRight
                          size={16}
                        />
                      </button>

                    </div>
                  )}

                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-dialog-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-stone-100 p-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-widest text-red-800">
                  Order details
                </p>

                <h2
                  id="order-dialog-title"
                  className="mt-1 text-xl font-bold text-stone-900"
                >
                  {selectedOrder.orderNumber ||
                    selectedOrder._id}
                </h2>

              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditingSummary(
                      (value) => !value
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                  title="Edit the visible order summary"
                >
                  <Pencil size={15} />

                  {editingSummary
                    ? "Finish editing"
                    : "Edit summary"}
                </button>

                <button
                  type="button"
                  onClick={
                    downloadOrderSummary
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900"
                  title="Print or save the order summary as PDF"
                >
                  <Download size={15} />

                  Download
                </button>

                <button
                  type="button"
                  aria-label="Close order details"
                  onClick={() => {
                    setSelectedOrder(
                      null
                    );

                    setEditingSummary(
                      false
                    );
                  }}
                  className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
                >
                  <X size={20} />
                </button>

              </div>
            </div>

            {/* SUMMARY */}
            <div
              ref={summaryRef}
              className={`space-y-6 p-5 ${
                editingSummary
                  ? "rounded-lg outline outline-2 outline-dashed outline-amber-300"
                  : ""
              }`}
              contentEditable={editingSummary}
              suppressContentEditableWarning
              spellCheck={editingSummary}
            >

              {/* CUSTOMER INFORMATION */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <p className="mb-2 text-xs font-semibold uppercase text-stone-400">
                    Customer
                  </p>

                  <p className="font-semibold text-stone-900">
                    {selectedOrder.customer
                      ?.name ||
                      selectedOrder.customerName ||
                      "Customer"}
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    {selectedOrder.customer
                      ?.email ||
                      selectedOrder.customerEmail ||
                      "No email"}
                  </p>

                </div>

                <div>

                  <p className="mb-2 text-xs font-semibold uppercase text-stone-400">
                    Contact
                  </p>

                  <p className="flex items-center gap-2 text-sm text-stone-700">

                    <Phone size={15} />

                    {selectedOrder.customer
                      ?.phone ||
                      selectedOrder.customerPhone ||
                      "No phone"}

                  </p>

                  <p className="mt-2 flex items-start gap-2 text-sm text-stone-700">

                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0"
                    />

                    {selectedOrder.customer
                      ?.address ||
                      selectedOrder.customerAddress ||
                      "No address"}

                  </p>

                </div>

              </div>

              {/* ORDER ITEMS */}
              <div>

                <p className="mb-3 text-xs font-semibold uppercase text-stone-400">
                  Items ordered
                </p>

                <div className="overflow-x-auto rounded-xl border border-stone-200">

                  <table className="w-full min-w-[350px] text-sm">

                    <thead className="bg-stone-50 text-stone-500">

                      <tr>

                        <th className="px-3 py-3 text-left">
                          Product
                        </th>

                        <th className="px-3 py-3 text-center">
                          Qty
                        </th>

                        <th className="px-3 py-3 text-right">
                          Price
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-stone-100">

                      {(selectedOrder.items ||
                        []
                      ).map(
                        (item, index) => (
                          <tr
                            key={`${item.product || item.name}-${index}`}
                          >

                            <td className="px-3 py-3">

                              <p className="font-medium text-stone-800">
                                {item.name}
                              </p>

                              {item.content && (
                                <p className="mt-1 text-xs text-stone-500">
                                  {item.content}
                                </p>
                              )}

                            </td>

                            <td className="px-3 py-3 text-center">
                              {item.quantity}
                            </td>

                            <td className="px-3 py-3 text-right">
                              {formatCurrency(
                                item.price *
                                  item.quantity
                              )}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>
                  </table>

                </div>

                <div className="mt-4 flex justify-between text-sm">

                  <span className="text-stone-500">
                    Enquiry total
                  </span>

                  <span className="text-lg font-bold text-stone-900">
                    {formatCurrency(
                      selectedOrder.subtotal
                    )}
                  </span>

                </div>

                <p className="mt-1 text-xs text-stone-400">
                  This is the enquiry total, not confirmed revenue.
                </p>

              </div>

              {/* STATUS UPDATE */}
              <div className="rounded-xl bg-stone-50 p-4">

                <label
                  htmlFor="order-status"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Update order status
                </label>

                <select
                  id="order-status"
                  value={
                    selectedOrder.status ||
                    "pending"
                  }
                  disabled={
                    updatingId ===
                    selectedOrder._id
                  }
                  onChange={(event) =>
                    void updateOrderStatus(
                      selectedOrder,
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm capitalize outline-none focus:border-red-700 disabled:opacity-50"
                >

                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status.charAt(0).toUpperCase() +
                          status.slice(1)}
                      </option>
                    )
                  )}

                </select>

                {updatingId ===
                  selectedOrder._id && (
                  <p className="mt-2 text-xs text-stone-500">
                    Updating status...
                  </p>
                )}

              </div>

              {/* CREATED DATE */}
              <div className="flex items-center gap-2 text-xs text-stone-400">

                <CalendarDays size={14} />

                Placed{" "}

                {selectedOrder.createdAt
                  ? new Date(
                      selectedOrder.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )
                  : "date unavailable"}

              </div>

            </div>
          </section>
        </div>
      )}

    </div>
  );
}