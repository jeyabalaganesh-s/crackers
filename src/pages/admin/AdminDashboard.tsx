import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Clock3,
  IndianRupee,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Boxes,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  stockStatus?: string;
  isActive?: boolean;
};

type Order = {
  _id: string;
  orderNumber: string;
  customer?: {
    name?: string;
    phone?: string;
  };
  customerName?: string;
  items?: {
    name?: string;
    quantity: number;
  }[];
  subtotal: number;
  status: string;
  createdAt?: string;
};

type DashboardData = {
  products: Product[];
  orders: Order[];
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    products: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function fetchDashboard(isRefresh = false) {
    setError("");

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = sessionStorage.getItem("raja_admin_token");

      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const [productsResponse, ordersResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`, { headers }),
        fetch(`${API_BASE_URL}/api/orders`, { headers }),
      ]);

      if (!productsResponse.ok || !ordersResponse.ok) {
        throw new Error(
          "Unable to load dashboard data. Check your backend API routes and admin permissions.",
        );
      }

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();

      const products: Product[] = Array.isArray(productsData)
        ? productsData
        : Array.isArray(productsData.products)
          ? productsData.products
          : [];

      const orders: Order[] = Array.isArray(ordersData)
        ? ordersData
        : Array.isArray(ordersData.orders)
          ? ordersData.orders
          : [];

      setData({ products, orders });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void fetchDashboard();
  }, []);

  const activeProducts = data.products.filter(
    (product) => product.isActive !== false,
  ).length;

  const pendingOrders = data.orders.filter((order) =>
    ["pending", "pending confirmation", "new"].includes(
      order.status?.toLowerCase() || "",
    ),
  ).length;

  const confirmedOrders = data.orders.filter((order) =>
    ["confirmed", "completed", "delivered"].includes(
      order.status?.toLowerCase() || "",
    ),
  ).length;

  const totalEnquiryValue = data.orders.reduce(
    (sum, order) => sum + (Number(order.subtotal) || 0),
    0,
  );

  const recentOrders = [...data.orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Active Products",
      value: activeProducts,
      icon: Package,
      note: `${data.products.length} total records`,
      color: "bg-amber-50 text-amber-800",
    },
    {
      label: "Order Enquiries",
      value: data.orders.length,
      icon: ShoppingBag,
      note: "All submitted enquiries",
      color: "bg-rose-50 text-rose-800",
    },
    {
      label: "Pending Enquiries",
      value: pendingOrders,
      icon: Clock3,
      note: "Awaiting review",
      color: "bg-orange-50 text-orange-800",
    },
    {
      label: "Confirmed Orders",
      value: confirmedOrders,
      icon: Boxes,
      note: "Confirmed or completed",
      color: "bg-emerald-50 text-emerald-800",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#a36d1c]">
            OVERVIEW
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your catalogue and review customer enquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void fetchDashboard(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold transition hover:bg-[#fffaf2] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a1018] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#641722]"
          >
            <Plus size={17} />
            Add Product
          </Link>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Dashboard data unavailable</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs">
              Your backend must expose product and order list endpoints.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchDashboard(true)}
            className="shrink-0 font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-black">
                    {loading ? "—" : stat.value.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">{stat.note}</p>
            </article>
          );
        })}
      </section>

      {/* Enquiry value and quick actions */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="relative overflow-hidden rounded-2xl bg-[#4a1018] p-6 text-white sm:p-8">
          <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-6 h-36 w-36 rounded-full border border-white/10" />

          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
              <IndianRupee size={17} />
              Listed Enquiry Value
            </div>

            <p className="mt-4 text-3xl font-black sm:text-4xl">
              {loading ? "—" : money(totalEnquiryValue)}
            </p>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
              Combined listed subtotal of recorded enquiries. This is not
              collected revenue or confirmed sales.
            </p>

            <Link
              to="/admin/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#4a1018] hover:bg-[#fffaf2]"
            >
              Review enquiries
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </article>

        <article className="rounded-2xl border border-[#eadfce] bg-white p-6 sm:p-8">
          <h2 className="text-lg font-black">Quick actions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Common store management tasks.
          </p>

          <div className="mt-5 space-y-3">
            <Link
              to="/admin/products"
              className="group flex items-center gap-4 rounded-xl border border-[#eadfce] p-4 transition hover:border-[#4a1018]/30 hover:bg-[#fffaf2]"
            >
              <div className="rounded-xl bg-[#f7eee5] p-3 text-[#4a1018]">
                <Package size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-bold">Manage products</p>
                <p className="mt-1 text-xs text-gray-500">
                  Update prices, photos and availability
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#4a1018]"
              />
            </Link>

            <Link
              to="/admin/orders"
              className="group flex items-center gap-4 rounded-xl border border-[#eadfce] p-4 transition hover:border-[#4a1018]/30 hover:bg-[#fffaf2]"
            >
              <div className="rounded-xl bg-rose-50 p-3 text-rose-800">
                <ShoppingBag size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-bold">View order enquiries</p>
                <p className="mt-1 text-xs text-gray-500">
                  Review customer orders and status
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#4a1018]"
              />
            </Link>
          </div>
        </article>
      </section>

      {/* Recent enquiries */}
      <section className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eadfce] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-lg font-black">Recent Order Enquiries</h2>
            <p className="mt-1 text-sm text-gray-500">
              The latest customer submissions.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#4a1018] hover:underline"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-500">
            <RefreshCw size={18} className="animate-spin" />
            Loading enquiries...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fffaf2] text-[#a36d1c]">
              <ShoppingBag size={26} />
            </div>
            <h3 className="mt-4 font-bold">No enquiries yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Customer submissions will appear here when orders are received.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[#fffaf2] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-bold">Order</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Listed subtotal</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0e8dd]">
                {recentOrders.map((order) => {
                  const status = order.status || "Pending confirmation";
                  const normalizedStatus = status.toLowerCase();

                  const badgeClass = [
                    "confirmed",
                    "completed",
                    "delivered",
                  ].includes(normalizedStatus)
                    ? "bg-emerald-50 text-emerald-700"
                    : ["cancelled", "rejected"].includes(normalizedStatus)
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-800";

                  return (
                    <tr key={order._id} className="hover:bg-[#fffaf2]/70">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#4a1018]">
                          {order.orderNumber || order._id}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.items?.length ?? 0} product types
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold">
                          {order.customer?.name ||
                            order.customerName ||
                            "Customer"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.customer?.phone || "No phone listed"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-4 font-bold">
                        {money(Number(order.subtotal) || 0)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${badgeClass}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="pb-2 text-center text-xs text-gray-400">
        Raja Agencies · Store Administration
      </p>
    </div>
  );
}
