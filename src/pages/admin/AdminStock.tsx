// src/pages/admin/AdminStock.tsx

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { stockAPI } from '../../services/api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type StockRecordWithUser = {
  id_stock: number;
  date: string;
  id_produit: number;
  id_user?: number;
  nom_produit: string;
  quantite_ouverture_mois: number;
  quantite_vendu_mois: number;
  stock_actuel: number;
  quantite_approvisionner: number;
  valeur_stock: number;
  prix_unitaire?: number;
};

const StockIndicator = ({ stock }: { stock: number }) => {
  let bgColor = 'bg-green-500';
  let textColor = 'text-green-700';
  if (stock <= 0) {
    bgColor = 'bg-gray-400';
    textColor = 'text-gray-600';
  } else if (stock < 10) {
    bgColor = 'bg-red-500';
    textColor = 'text-red-700';
  } else if (stock < 25) {
    bgColor = 'bg-yellow-500';
    textColor = 'text-yellow-700';
  }
  
  return (
    <div className="flex items-center justify-center gap-2">
      <span className={`inline-block w-3 h-3 ${bgColor} rounded-full`} />
      <span className={`font-semibold ${textColor}`}>{stock}</span>
    </div>
  );
};

const STOCK_ITEMS_PER_PAGE = 10;

const AdminStock = ({ isSellerView = false }) => {
  const auth = useAuth();
  const user = auth?.user;

  const [stocks, setStocks] = useState<StockRecordWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchStockRecords();
  }, [selectedDate, isSellerView, user]);

  const fetchStockRecords = async () => {
    try {
      setLoading(true);
      const params = {
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        ...(isSellerView && user ? { userId: user.id } : {})
      };
      
      const response = await stockAPI.getAll(params);
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stock records:', error);
      toast.error('Failed to load stock records');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndJoinedData = useMemo(() => {
    if (searchTerm) {
      return stocks.filter(stock => 
        stock.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.id_produit.toString().includes(searchTerm)
      );
    }
    return stocks;
  }, [stocks, searchTerm]);
  
  const totalPages = Math.ceil(filteredAndJoinedData.length / STOCK_ITEMS_PER_PAGE);
  const paginatedStocks = useMemo(() => 
    filteredAndJoinedData.slice(
      (currentPage - 1) * STOCK_ITEMS_PER_PAGE,
      currentPage * STOCK_ITEMS_PER_PAGE
    ), [filteredAndJoinedData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStockUpdate = async (stockId: number, newStock: number) => {
    try {
      const updatedStock = Math.max(0, newStock);
      const stockRecord = stocks.find(s => s.id_stock === stockId);
      
      await stockAPI.updateStock(stockId, {
        stock_actuel: updatedStock,
        prix_unitaire: stockRecord?.prix_unitaire
      });
      
      toast.success('Stock updated successfully');
      fetchStockRecords();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };
  
  const firstItemIndex = (currentPage - 1) * STOCK_ITEMS_PER_PAGE + 1;
  const lastItemIndex = Math.min(currentPage * STOCK_ITEMS_PER_PAGE, filteredAndJoinedData.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stock records...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">
            {isSellerView ? 'My Stock' : 'Stock Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isSellerView ? 'View and update your product inventory levels.' : 'View historical and current inventory levels by month.'}
          </p>
        </div>
        <div className="relative">
           <label htmlFor="month-picker" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Select Month</label>
           <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => date && setSelectedDate(date)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
           </div>
        </div>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="search-stock" className="sr-only">Search Stock</label>
        <input 
          id="search-stock"
          type="text"
          placeholder="Search product by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#dcd6c9]">
            <thead className="bg-[#f3efe7]">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase">Product</th>
                <th className="px-3 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase hidden sm:table-cell">Opening</th>
                <th className="px-3 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase">Sold</th>
                <th className="px-3 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase hidden lg:table-cell">Restocked</th>
                <th className="px-3 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase">Current Stock</th>
                <th className="px-3 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase hidden md:table-cell">Stock Value</th>
                <th className="px-3 py-3 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase">Quick Update</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e7e2d9]">
              {paginatedStocks.map(stock => (
                <tr key={stock.id_stock} className="hover:bg-gray-50">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{stock.nom_produit}</div>
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-gray-600 hidden sm:table-cell">{stock.quantite_ouverture_mois}</td>
                  <td className="px-3 py-3 text-center"><span className="text-sm font-medium text-orange-600">{stock.quantite_vendu_mois}</span></td>
                  <td className="px-3 py-3 text-center text-sm text-green-600 font-medium hidden lg:table-cell">{stock.quantite_approvisionner > 0 ? `+${stock.quantite_approvisionner}` : '-'}</td>
                  <td className="px-3 py-3 text-center"><StockIndicator stock={stock.stock_actuel} /></td>
                  <td className="px-3 py-3 text-center font-semibold text-gray-800 hidden md:table-cell">${Number(stock.valeur_stock).toLocaleString()}</td>
                  <td className="px-3 py-3 text-right">
                    <input
                      type="number"
                      defaultValue={stock.stock_actuel}
                      onBlur={(e) => handleStockUpdate(stock.id_stock, parseInt(e.target.value, 10))}
                      className="w-20 text-center border border-[#dcd6c9] rounded-md py-1 px-2 focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredAndJoinedData.length > 0 ? firstItemIndex : 0}</span>-
          <span className="font-semibold">{lastItemIndex}</span> of{' '}
          <span className="font-semibold">{filteredAndJoinedData.length}</span> items
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