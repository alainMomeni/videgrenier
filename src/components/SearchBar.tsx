// frontend/src/components/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';

type Product = {
  id_produit: number;
  nom_produit: string;
  prix: number;
  categorie: string;
  photo: string;
  quantite: number;
};

type SearchBarProps = {
  onClose?: () => void;
  isMobile?: boolean;
};

const SearchBar = ({ onClose, isMobile = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Charger tous les produits au montage
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Filtrer les produits en temps réel
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = allProducts
        .filter(product => 
          product.nom_produit.toLowerCase().includes(query.toLowerCase()) ||
          product.categorie.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limiter à 5 suggestions
      
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, allProducts]);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectProduct(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.id_produit}`);
    setQuery('');
    setIsOpen(false);
    onClose?.();
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && suggestions.length > 0 && setIsOpen(true)}
            className={`${
              isMobile 
                ? 'w-full' 
                : 'w-56 xl:w-72 2xl:w-80'
            } bg-white border border-[#dcd6c9] rounded-md py-1.5 pl-4 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0b8a8]`}
            placeholder="Search products..."
            autoComplete="off"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="p-1 text-gray-400 hover:text-gray-600 transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Dropdown des suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#dcd6c9] rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {suggestions.map((product, index) => (
              <button
                key={product.id_produit}
                onClick={() => handleSelectProduct(product)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#f3efe7] transition text-left ${
                  index === selectedIndex ? 'bg-[#f3efe7]' : ''
                }`}
              >
                <img
                  src={product.photo}
                  alt={product.nom_produit}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/placeholder-product.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {product.nom_produit}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 font-semibold">
                      ${product.prix.toFixed(2)}
                    </p>
                    <span className="text-xs text-gray-500">{product.categorie}</span>
                  </div>
                  {product.quantite === 0 && (
                    <span className="text-xs text-red-600 font-medium">Out of stock</span>
                  )}
                </div>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            ))}
          </div>
          
          {/* Option "View all results" */}
          {query.trim() && (
            <div className="border-t border-[#dcd6c9] px-4 py-3">
              <button
                onClick={handleSearch}
                className="w-full text-left text-sm text-[#C06C54] hover:text-[#a05543] font-semibold flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Message si aucun résultat */}
      {isOpen && query.trim() && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#dcd6c9] rounded-md shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-gray-600">No products found for "{query}"</p>
          <button
            onClick={handleSearch}
            className="mt-2 text-sm text-[#C06C54] hover:text-[#a05543] font-semibold"
          >
            Search in all products
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;