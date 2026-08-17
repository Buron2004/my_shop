import { useLocation, Link } from 'react-router-dom';
import { Bell, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  analytics: 'Analytics',
};

function AdminTopNav({ onOpenMobile }) {
  const { user } = useAuth();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);
  const currentPage = segments[segments.length - 1];
  const pageLabel = PAGE_LABELS[currentPage] || 'Dashboard';

  return (
    <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="lg:hidden text-gray-600 hover:text-gray-900 shrink-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-sm shrink-0">
          <Link to="/admin/dashboard" className="text-gray-400 hover:text-gray-700 transition">
            Admin
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-900 font-medium">{pageLabel}</span>
        </nav>

        <div className="hidden lg:block w-px h-5 bg-gray-200 mx-2" />

        <input
          type="text"
          placeholder="Search..."
          className="hidden lg:block border border-gray-200 rounded px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-green-600"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <button className="text-gray-500 hover:text-gray-800" aria-label="Notifications">
          <Bell size={19} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-sm text-gray-700">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}

export default AdminTopNav;