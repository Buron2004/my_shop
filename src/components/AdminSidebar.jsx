import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Package, BarChart3, Home, X } from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

function AdminSidebar({ mobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && <span className="font-bold text-white">Admin</span>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:block text-gray-400 hover:text-white text-sm"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '→' : '←'}
        </button>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-gray-400 hover:text-white"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm transition ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <link.icon size={17} />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <Link
          to="/"
          className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition"
        >
          <Home size={16} />
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex bg-gray-900 text-gray-300 h-screen sticky top-0 flex-col transition-all ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="relative bg-gray-900 text-gray-300 w-64 h-full flex flex-col shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;