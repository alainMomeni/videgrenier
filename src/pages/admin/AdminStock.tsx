import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { allProducts as initialProductsRaw } from '../../data/products';

type ProductStock = {
  id: number;
  name: string;
  image: string;
  stock: number;
  soldToday: number; // FIX: Retirer le ? pour forcer une valeur
};

// Composant pour l'indicateur de stock visuel
const StockIndicator = ({ stock }: { stock: number }) => {
  let bgColor = 'bg-green-500';
  if (stock <= 0) bgColor = 'bg-gray-400';
  else if (stock < 10) bgColor = 'bg-red-500';
  else if (stock < 25) bgColor = 'bg-yellow-500';
  return <span className={`inline-block w-3 h-3 ${bgColor} rounded-full`} title={`Stock: ${stock}`}></span>;
};

const STOCK_ITEMS_PER_PAGE = 10;

const AdminStock = () => {
  // FIX: Ajouter soldToday avec une valeur par défaut de 0 pour chaque produit
  const initialProducts = useMemo(() => 
    initialProductsRaw.map(p => ({ 
      id: p.id,
      name: p.name,
      image: p.image,
      stock: p.stock,
      soldToday: 0 // Valeur par défaut car elle n'existe pas dans products.ts
    })), 
    []
  );

  const [products, setProducts] = useState<ProductStock[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => 
    products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]);
  
  const totalPages = Math.ceil(filteredProducts.length / STOCK_ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => 
    filteredProducts.slice(
      (currentPage - 1) * STOCK_ITEMS_PER_PAGE,
      currentPage * STOCK_ITEMS_PER_PAGE
    ), [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStockUpdate = (productId: number, newStock: number) => {
    // Dans une vraie app, on ferait un appel API pour mettre à jour la BDD
    const updatedStock = Math.max(0, newStock); // Empêcher les stocks négatifs
    setProducts(products.map(p => p.id === productId ? { ...p, stock: updatedStock } : p));
  };
  
  const firstItemIndex = (currentPage - 1) * STOCK_ITEMS_PER_PAGE + 1;
  const lastItemIndex = Math.min(currentPage * STOCK_ITEMS_PER_PAGE, filteredProducts.length);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Stock Management</h1>
        <p className="text-gray-600 mt-1">View and update product inventory levels.</p>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="search-stock" className="sr-only">Search Stock</label>
        <input 
          id="search-stock"
          type="text"
          placeholder="Search product by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-[#dcd6c9]">
          <thead className="bg-[#f3efe7]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Opening Stock</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Sold Today</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-4 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Quick Update</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e7e2d9]">
            {paginatedProducts.map(product => {
              const openingStock = product.stock + product.soldToday;
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-11 w-11">
                        <img className="h-11 w-11 rounded-md object-cover" src={product.image} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{openingStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{product.soldToday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <StockIndicator stock={product.stock} />
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end">
                      <input
                        type="number"
                        defaultValue={product.stock}
                        onBlur={(e) => handleStockUpdate(product.id, parseInt(e.target.value, 10))}
                        className="w-20 text-center border border-[#dcd6c9] rounded-md py-1 focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredProducts.length > 0 ? firstItemIndex : 0}</span>-
          <span className="font-semibold">{lastItemIndex}</span> of{' '}
          <span className="font-semibold">{filteredProducts.length}</span> products
        </p>
        
        {totalPages > 1 && (
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
              aria-label="Previous Page"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </span>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
              aria-label="Next Page"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        )}
      </div>
    </motion.div>
  );
};

export default AdminStock;