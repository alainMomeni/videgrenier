// src/pages/admin/AdminLayout.tsx

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardNavConfig } from '../../config/dashboardNavConfig';
import { LogOut, User } from 'lucide-react';

const AdminLayout = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!auth || !auth.user) {
    return <div>Loading user data...</div>;
  }
  
  const { user, logout } = auth;
  
  const navLinks = dashboardNavConfig[user.role] || [];

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/'); // Redirige vers la page d'accueil après déconnexion
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3efe7]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#fcfaf7] border-r border-[#dcd6c9] flex flex-col">
        <div className="pt-2 pl-2 pr-2 text-center border-b border-[#dcd6c9]">
          <Link to="/" className="inline-block" aria-label="Retour à la page d'accueil">
             <img src="/assets/logo.png" alt="Vide Grenier Kamer Logo" className="h-26 w-auto"/>
          </Link>
        </div>

        <nav className="flex-grow p-6">
          <h2 className="text-xs font-serif font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu</h2>
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 transition font-medium text-sm ${isActive ? 'bg-[#e7e2d9] text-[#2a363b]' : 'hover:bg-[#e7e2d9]'}`}
                  >
                    <link.icon size={18} /> {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-6 border-t border-[#dcd6c9]">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#e7e2d9] flex items-center justify-center">
               <User className="text-[#2a363b]" />
             </div>
             <div>
               <p className="font-semibold text-sm text-[#2a363b]">{user.firstName} {user.lastName}</p>
               <p className="text-xs text-gray-500 capitalize">{user.role}</p>
             </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition"
           >
             <LogOut size={16} /> Log Out
           </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;