// src/pages/admin/AdminSales.tsx

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ShoppingCart, ChevronLeft, ChevronRight, Download, Filter, Package, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { salesAPI } from '../../services/api';
import toast from 'react-hot-toast';

type SupplyStatus = 'completed' | 'pending' | 'refunded';
type PaymentMethod = 'card' | 'paypal' | 'mobile_money';

type SaleRecord = {
  id_sale: number;
  order_id: string;
  id_produit: number;
  nom_produit: string;
  seller_name: string;
  id_seller: number;
  buyer_name: string;
  buyer_email: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  sale_date: string;
  status: SupplyStatus;
  payment_method: PaymentMethod;
};

type SaleDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleRecord | null;
};

const SaleDetailsModal = ({ isOpen, onClose, sale }: SaleDetailsModalProps) => {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-2xl p-6 sm:p-8 border border-[#dcd6c9] my-8"
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#a9b1a8] rounded-lg">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#2a363b]">Order Details</h2>
              <p className="text-sm text-gray-500 font-mono">ID: {sale.order_id}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
             <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${
              sale.status === 'completed' ? 'bg-green-100 text-green-800' :
              sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {sale.status === 'completed' ? 'COMPLETED' : sale.status.toUpperCase()}
            </span>
            <p className="text-xs text-gray-500">{new Date(sale.sale_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        
        <div className="space-y-5 border-t border-[#dcd6c9] pt-6">
          <div className="bg-white p-5 rounded-lg border border-[#e7e2d9]">
            <div className="flex items-center gap-3 mb-4">
              <Package size={18} className="text-gray-500" />
              <h3 className="font-serif font-semibold text-[#2a363b]">Product Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-serif">Product Name</p>
                <p className="font-semibold text-lg text-gray-900">{sale.nom_produit}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-serif">Quantity</p>
                  <p className="text-lg font-bold text-[#2a363b]">{sale.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-serif">Unit Price</p>
                  <p className="text-lg font-bold text-gray-700">${sale.unit_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-serif">Total</p>
                  <p className="text-lg font-bold text-[#2a363b]">${sale.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-[#f0f5ff] p-5 rounded-lg border border-[#e0eaff]">
              <div className="flex items-center gap-3 mb-3">
                <User size={18} className="text-blue-600" />
                <h3 className="font-serif font-semibold text-[#2a363b]">Seller</h3>
              </div>
              <p className="font-medium text-gray-900">{sale.seller_name}</p>
            </div>
            <div className="bg-[#f9f0ff] p-5 rounded-lg border border-[#f3e8ff]">
              <div className="flex items-center gap-3 mb-3">
                <User size={18} className="text-purple-600" />
                <h3 className="font-serif font-semibold text-[#2a363b]">Buyer</h3>
              </div>
              <p className="font-medium text-gray-900">{sale.buyer_name}</p>
              <p className="text-sm text-gray-600 mt-1 break-words">{sale.buyer_email}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-[#e7e2d9]">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              <h3 className="font-serif font-semibold text-[#2a363b]">Payment Details</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500 font-serif">Payment Method</p>
                <p className="font-medium text-gray-900 capitalize">{sale.payment_method.replace('_', ' ')}</p>
              </div>
              <div className="text-right px-4 py-2 bg-[#f3efe7] rounded-lg">
                <p className="text-xs text-gray-500 font-serif">Total Paid</p>
                <p className="text-2xl font-bold text-[#2a363b]">${sale.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button onClick={onClose} className="px-6 py-2 text-sm font-serif font-medium text-white bg-[#2a363b] rounded-lg hover:bg-opacity-90 transition-all">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SALES_PER_PAGE = 10;

const AdminSales = ({ isSellerView = false }) => {
  const auth = useAuth();
  const user = auth?.user;

  const [salesList, setSalesList] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Charger les ventes depuis l'API
  useEffect(() => {
    fetchSales();
  }, [isSellerView, user]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = isSellerView && user 
        ? await salesAPI.getAll(user.id) 
        : await salesAPI.getAll();
      
      setSalesList(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = useMemo(() => {
    let filtered = salesList.filter(sale => 
      sale.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (!isSellerView && sale.seller_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sale.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }
    return filtered;
  }, [salesList, searchTerm, statusFilter, isSellerView]);

  const totalPages = Math.ceil(filteredSales.length / SALES_PER_PAGE);
  const paginatedSales = useMemo(() => 
    filteredSales.slice((currentPage - 1) * SALES_PER_PAGE, currentPage * SALES_PER_PAGE), 
    [filteredSales, currentPage]
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewDetails = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  // CORRECTION ICI : toast.info() n'existe pas, utiliser toast() ou toast.success()
  const handleExportCSV = () => { 
    toast('Export feature coming soon!', {
      icon: '📊',
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">
            {isSellerView ? 'My Sales' : 'Sales Analytics'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {isSellerView ? 'View and analyze your sales transactions.' : 'View and analyze all sales transactions.'}
          </p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-[#70816B] text-white rounded-md hover:bg-opacity-90 transition font-serif text-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input id="search-sales" type="text" placeholder={isSellerView ? "Search by order, product, or buyer..." : "Search by order, product, seller, or buyer..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none text-sm"/>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto appearance-none bg-white border border-[#dcd6c9] rounded-md py-2 pl-10 pr-8 focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none text-sm">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#dcd6c9]">
            <thead className="bg-[#f3efe7]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Order & Product</th>
                {!isSellerView && (
                  <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider hidden md:table-cell">Seller</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider hidden lg:table-cell">Buyer</th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e7e2d9]">
              {paginatedSales.map(sale => (
                <tr key={sale.id_sale} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center mb-1"><ShoppingCart size={14} className="text-gray-400 mr-2 flex-shrink-0" /><div className="text-sm text-gray-700">{sale.nom_produit}</div></div>
                      {!isSellerView && <div className="text-xs text-gray-500 mt-1 md:hidden">Seller: {sale.seller_name}</div>}
                      <div className="text-xs text-gray-500 lg:hidden">Buyer: {sale.buyer_name}</div>
                      <div className="text-xs text-gray-500 sm:hidden mt-1">{new Date(sale.sale_date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  {!isSellerView && (<td className="px-4 py-3 hidden md:table-cell"><div className="text-sm text-gray-700">{sale.seller_name}</div></td>)}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div>
                      <div className="text-sm text-gray-900">{sale.buyer_name}</div>
                      <div className="text-xs text-gray-500">{sale.buyer_email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center"><span className="text-sm font-semibold text-gray-800">${sale.total_amount.toFixed(2)}</span></td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 hidden sm:table-cell">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{sale.status}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => handleViewDetails(sale)} className="p-1.5 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"><Eye size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"><ChevronLeft size={20} /></button>
            <span className="text-sm text-gray-700">Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span></span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"><ChevronRight size={20} /></button>
          </nav>
        </div>
      )}

      <SaleDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} sale={selectedSale}/>
    </motion.div>
  );
};

export default AdminSales;