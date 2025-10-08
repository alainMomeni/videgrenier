import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardNavConfig } from '../../config/dashboardNavConfig';
import { LogOut, User, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!auth || !auth.user) {
    return <div>Loading user data...</div>;
  }
     
  const { user, logout } = auth;
  const navLinks = dashboardNavConfig[user.role] || [];

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/');
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f3efe7] relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#fcfaf7] rounded-md border border-[#dcd6c9] shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#fcfaf7] border-r border-[#dcd6c9] 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="pt-2 pl-2 pr-2 text-center border-b border-[#dcd6c9]">
          <Link 
            to="/" 
            className="inline-block" 
            aria-label="Retour à la page d'accueil"
            onClick={closeSidebar}
          >
            <img src="/assets/logo.png" alt="Vide Grenier Kamer Logo" className="h-26 w-auto"/>
          </Link>
        </div>

        <nav className="flex-grow p-4 lg:p-6 overflow-y-auto">
          <h2 className="text-xs font-serif font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu</h2>
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 transition font-medium text-sm ${
                      isActive ? 'bg-[#e7e2d9] text-[#2a363b]' : 'hover:bg-[#e7e2d9]'
                    }`}
                  >
                    <link.icon size={18} /> 
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 lg:p-6 border-t border-[#dcd6c9]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e7e2d9] flex items-center justify-center flex-shrink-0">
              <User className="text-[#2a363b]" size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-[#2a363b] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>
             
      {/* Main Content */}
      <main className="flex-1 w-full lg:w-auto">
        <div className="p-4 sm:p-6 lg:p-10 pt-16 lg:pt-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;