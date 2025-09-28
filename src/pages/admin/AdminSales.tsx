import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ShoppingCart, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';


type SaleRecord = {
  id: number;
  orderId: string;
  productName: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string;
  status: 'completed' | 'pending' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'mobile_money';
};

type SaleDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleRecord | null;
};

// Modal pour voir les détails d'une vente
const SaleDetailsModal = ({ isOpen, onClose, sale }: SaleDetailsModalProps) => {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-2xl p-8 border border-[#dcd6c9]"
      >
        <h2 className="text-2xl font-serif text-[#2a363b] mb-6">Sale Details</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-serif">Order ID</p>
              <p className="font-semibold text-[#2a363b]">{sale.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-serif">Sale Date</p>
              <p className="font-semibold text-[#2a363b]">{new Date(sale.saleDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border-t border-[#dcd6c9] pt-4">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Product Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-serif">Product Name</p>
                <p className="font-medium">{sale.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-serif">Quantity</p>
                <p className="font-medium">{sale.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-serif">Unit Price</p>
                <p className="font-medium">${sale.unitPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-serif">Total Amount</p>
                <p className="font-semibold text-lg text-[#2a363b]">${sale.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#dcd6c9] pt-4">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Seller Information</h3>
            <p className="text-gray-700">{sale.sellerName}</p>
          </div>

          <div className="border-t border-[#dcd6c9] pt-4">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Buyer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-serif">Name</p>
                <p className="font-medium">{sale.buyerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-serif">Email</p>
                <p className="font-medium">{sale.buyerEmail}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#dcd6c9] pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-serif">Payment Method</p>
                <p className="font-medium capitalize">{sale.paymentMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-serif">Status</p>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                  sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {sale.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-[#dcd6c9]">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SALES_PER_PAGE = 10;

const AdminSales = () => {
  // Données factices de ventes
  const [sales] = useState<SaleRecord[]>([
    {
      id: 1,
      orderId: 'ORD-2024-001',
      productName: 'Sac Classique Cuir Blanc',
      sellerName: 'Sarah Martinez',
      buyerName: 'Jean Dupont',
      buyerEmail: 'jean.dupont@email.com',
      quantity: 1,
      unitPrice: 220,
      totalAmount: 220,
      saleDate: '2024-01-25',
      status: 'completed',
      paymentMethod: 'card'
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      productName: 'Sneakers Montantes Bleues',
      sellerName: 'James Chen',
      buyerName: 'Marie Lambert',
      buyerEmail: 'marie.lambert@email.com',
      quantity: 2,
      unitPrice: 130,
      totalAmount: 260,
      saleDate: '2024-01-26',
      status: 'pending',
      paymentMethod: 'paypal'
    },
    {
      id: 3,
      orderId: 'ORD-2024-003',
      productName: 'T-shirt Uni Bleu Marine',
      sellerName: 'Sarah Martinez',
      buyerName: 'Paul Martin',
      buyerEmail: 'paul.martin@email.com',
      quantity: 3,
      unitPrice: 45,
      totalAmount: 135,
      saleDate: '2024-01-27',
      status: 'completed',
      paymentMethod: 'mobile_money'
    },
  ]);

  const [salesList] = useState<SaleRecord[]>(sales);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredSales = useMemo(() => {
    let filtered = salesList.filter(sale => 
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    return filtered;
  }, [salesList, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredSales.length / SALES_PER_PAGE);
  const paginatedSales = useMemo(() => 
    filteredSales.slice(
      (currentPage - 1) * SALES_PER_PAGE,
      currentPage * SALES_PER_PAGE
    ), [filteredSales, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  const handleExportCSV = () => {
    // Logique pour exporter en CSV
    console.log('Exporting sales data to CSV...');
  };

  const totalRevenue = filteredSales
    .filter(s => s.status === 'completed')
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Sales Analytics</h1>
          <p className="text-gray-600 mt-1">View and analyze all sales transactions.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#70816B] text-white rounded-md hover:bg-opacity-90 transition font-serif"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm">
          <p className="text-sm text-gray-500 font-serif">Total Sales</p>
          <p className="text-3xl font-bold text-[#2a363b] mt-1">{filteredSales.length}</p>
        </div>
        <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm">
          <p className="text-sm text-gray-500 font-serif">Total Revenue</p>
          <p className="text-3xl font-bold text-[#2a363b] mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm">
          <p className="text-sm text-gray-500 font-serif">Avg Order Value</p>
          <p className="text-3xl font-bold text-[#2a363b] mt-1">
            ${filteredSales.length > 0 ? (totalRevenue / filteredSales.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <label htmlFor="search-sales" className="sr-only">Search Sales</label>
          <input 
            id="search-sales"
            type="text"
            placeholder="Search by order ID, product, seller, or buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-[#dcd6c9] rounded-md py-2 pl-10 pr-8 focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-[#dcd6c9]">
          <thead className="bg-[#f3efe7]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Buyer
              </th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e7e2d9]">
            {paginatedSales.map(sale => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ShoppingCart size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm font-semibold text-gray-900">{sale.orderId}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {sale.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {sale.sellerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{sale.buyerName}</div>
                    <div className="text-xs text-gray-500">{sale.buyerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-800">
                  ${sale.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                  {new Date(sale.saleDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewDetails(sale)}
                    className="p-2 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"
                  >
                    <Eye size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
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
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      )}

      <SaleDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sale={selectedSale}
      />
    </motion.div>
  );
};

export default AdminSales;