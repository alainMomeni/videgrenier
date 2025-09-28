import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ConfirmDialog } from './ConfirmDialog';

type HeaderProps = {
  cartCount?: number;
};

const Header = ({ cartCount = 0 }: HeaderProps) => {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (logout) logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      setTimeout(() => handleClickOutside(e), 0);
    };
    
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const closeAllMenus = () => {
    setIsMainMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const ProfileMenu = () => (
    <div className="absolute right-0 mt-2 w-56 bg-[#fcfaf7] border border-[#dcd6c9] rounded-md shadow-lg z-50">
      <div className="py-1">
        <p className="px-4 pt-2 pb-1 text-xs text-gray-500 font-semibold truncate">
          Signed in as {user?.firstName}
        </p>
        <div className="border-t border-[#dcd6c9] my-1"></div>
        
        <Link 
          to="/profile" 
          onClick={(e) => {
            e.stopPropagation();
            closeAllMenus();
          }} 
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#e7e2d9] w-full"
        >
          <User size={16}/> Manage Profile
        </Link>
        
        {(user?.role === 'admin' || user?.role === 'seller') && (
          <Link 
            to="/admin" 
            onClick={(e) => {
              e.stopPropagation();
              closeAllMenus();
            }} 
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#e7e2d9] w-full"
          >
            <LayoutDashboard size={16}/> Dashboard
          </Link>
        )}
        
        <div className="border-t border-[#dcd6c9] my-1"></div>
        
        <button 
          onClick={(e) => { 
            e.stopPropagation();
            setIsConfirmOpen(true); 
            setIsProfileMenuOpen(false); 
          }} 
          className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-[#e7e2d9]"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="bg-[#f3efe7] border-b border-[#dcd6c9] sticky top-0 z-40">
        {/* CORRECTION: Ajout de padding horizontal plus important (px-8 lg:px-12 xl:px-16) */}
        <div className="container mx-auto px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex-shrink-0" aria-label="Logo Vide Grenier Kamer - Page d'accueil">
              <img src="/assets/logo.png" alt="Vide Grenier Kamer Logo" className="h-26 w-auto"/>
            </Link>
            
            <div className="hidden lg:flex items-center justify-end space-x-6 xl:space-x-8">
              <nav className="flex items-center space-x-6 xl:space-x-8" role="navigation">
                <Link to="/shop" className="text-gray-700 relative group">
                  <span>Shop All</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2a363b] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/about" className="text-gray-700 relative group">
                  <span>About Us</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2a363b] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/blog" className="text-gray-700 relative group">
                  <span>Blog</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2a363b] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/partner" className="text-gray-700 relative group">
                  <span>Become a Partner</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2a363b] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>
              
              <div className="flex items-center space-x-3 xl:space-x-4">
                <div className="relative items-center">
                  <input 
                    id="search" 
                    type="search" 
                    className="w-56 xl:w-72 2xl:w-80 bg-white border border-[#dcd6c9] rounded-md py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0b8a8]" 
                    placeholder="Rechercher..."
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative" ref={profileMenuRef}>
                  {user ? (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileMenuOpen(!isProfileMenuOpen);
                        }} 
                        className="flex items-center gap-2 p-2 text-gray-700 hover:text-black hover:bg-[#e7e2d9] rounded-full transition-all"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-serif text-sm">{user.firstName}</span>
                        <ChevronDown size={16} className={`transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isProfileMenuOpen && <ProfileMenu />}
                    </>
                  ) : (
                    <Link to="/login" className="text-gray-700 relative group whitespace-nowrap">
                      <span>Sign In</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2a363b] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  )}
                </div>

                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-700 hover:text-black hover:bg-[#e7e2d9] rounded-full transition-all" 
                  aria-label={`Panier (${cartCount} articles)`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            
            {/* Menu mobile */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="relative">
                {user ? (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileMenuOpen(!isProfileMenuOpen);
                      }} 
                      className="flex items-center gap-1 p-2 hover:bg-[#e7e2d9] rounded-full"
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <ChevronDown size={16} className={`text-gray-600 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 z-50">
                        <ProfileMenu />
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="p-2 hover:bg-[#e7e2d9] rounded-full">
                    <User className="w-5 h-5 text-gray-600" />
                  </Link>
                )}
              </div>
              
              <Link to="/cart" className="relative p-2 hover:bg-[#e7e2d9] rounded-full">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <button 
                onClick={() => setIsMainMenuOpen(!isMainMenuOpen)} 
                className="p-2 hover:bg-[#e7e2d9] rounded-full"
              >
                {isMainMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Menu mobile étendu */}
      {isMainMenuOpen && (
        <nav className="lg:hidden bg-[#f3efe7] border-t border-[#dcd6c9] shadow-sm">
          {/* CORRECTION: Ajout de padding cohérent */}
          <div className="px-8 py-4 space-y-4">
            <div className="relative">
              <input 
                id="search-mobile" 
                type="search" 
                className="w-full bg-white border border-[#dcd6c9] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0b8a8]" 
                placeholder="Rechercher..."
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <Link to="/shop" className="block text-gray-700 hover:text-black hover:bg-[#e7e2d9] px-3 py-2 rounded-md font-medium" onClick={closeAllMenus}>
              Shop All
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-black hover:bg-[#e7e2d9] px-3 py-2 rounded-md font-medium" onClick={closeAllMenus}>
              About Us
            </Link>
            <Link to="/blog" className="block text-gray-700 hover:text-black hover:bg-[#e7e2d9] px-3 py-2 rounded-md font-medium" onClick={closeAllMenus}>
              Blog
            </Link>
            <Link to="/partner" className="block text-gray-700 hover:text-black hover:bg-[#e7e2d9] px-3 py-2 rounded-md font-medium" onClick={closeAllMenus}>
              Become a Partner
            </Link>
          </div>
        </nav>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
      />
    </>
  );
};

export default Header;