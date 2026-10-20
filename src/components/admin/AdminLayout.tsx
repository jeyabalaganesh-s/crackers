import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Store,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("raja_admin_token");
    navigate("/admin/login", { replace: true });
  }

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#fffaf2] text-[#251714]">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col bg-[#4a1018] text-white transition-all duration-300 ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className="flex h-20 items-center justify-between gap-2 border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Store size={22} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate font-black tracking-wide">
                  RAJA AGENCIES
                </h1>
                <p className="text-xs text-white/60">Admin Portal</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:block"
          >
            {collapsed ? (
              <PanelLeft size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          {!collapsed && (
            <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-white/40">
              Workspace
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-[#4a1018] shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <NavLink
            to="/"
            title={collapsed ? "View Store" : undefined}
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white"
          >
            <Store size={20} className="shrink-0" />
            {!collapsed && <span>View Store</span>}
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/75 transition hover:bg-red-500/20 hover:text-white"
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main admin content */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-[#eadfce] bg-white/95 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Raja Agencies
            </p>
            <h2 className="text-lg font-black">Administration</h2>
          </div>

          <span className="rounded-full border border-[#eadfce] bg-[#fffaf2] px-3 py-2 text-xs font-bold text-[#4a1018]">
            Admin Panel
          </span>
        </header>

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
