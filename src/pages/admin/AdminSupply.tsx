// src/pages/admin/AdminSupply.tsx

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

type SupplyStatus = 'pending' | 'delivered' | 'cancelled';

type SupplyRecord = {
  id: number;
  productId: number;
  productName: string;
  supplierName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplyDate: string;
  status: SupplyStatus;
};

type SupplyFormData = Omit<SupplyRecord, 'id' | 'totalPrice'>;

type SupplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supply: SupplyFormData) => void;
  supply: SupplyRecord | null;
};

// Modal pour ajouter/éditer un approvisionnement
const SupplyModal = ({ isOpen, onClose, onSave, supply }: SupplyModalProps) => {
  const [formData, setFormData] = useState<SupplyFormData>({
    productId: 0,
    productName: '',
    supplierName: '',
    quantity: 0,
    unitPrice: 0,
    supplyDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  useEffect(() => {
    if (supply) {
      setFormData({
        productId: supply.productId,
        productName: supply.productName,
        supplierName: supply.supplierName,
        quantity: supply.quantity,
        unitPrice: supply.unitPrice,
        supplyDate: supply.supplyDate,
        status: supply.status
      });
    } else {
      setFormData({
        productId: 0,
        productName: '',
        supplierName: '',
        quantity: 0,
        unitPrice: 0,
        supplyDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
    }
  }, [supply, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' || name === 'productId' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-2xl p-8 border border-[#dcd6c9] my-8"
      >
        <h2 className="text-2xl font-serif text-[#2a363b] mb-6">
          {supply ? 'Edit Supply Record' : 'Add New Supply'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Product Name</label>
              <input type="text" name="productName" id="productName" value={formData.productName} onChange={handleChange} className={inputStyle} required/>
            </div>
            <div>
              <label htmlFor="supplierName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Supplier Name</label>
              <input type="text" name="supplierName" id="supplierName" value={formData.supplierName} onChange={handleChange} className={inputStyle} required/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Quantity</label>
              <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} min="1" className={inputStyle} required/>
            </div>
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Unit Price ($)</label>
              <input type="number" name="unitPrice" id="unitPrice" value={formData.unitPrice} onChange={handleChange} step="0.01" min="0" className={inputStyle} required/>
            </div>
            <div>
              <label htmlFor="supplyDate" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Supply Date</label>
              <input type="date" name="supplyDate" id="supplyDate" value={formData.supplyDate} onChange={handleChange} className={inputStyle} required/>
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyle + " appearance-none"} required>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-[#dcd6c9]">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-serif text-gray-700 bg-white border border-[#dcd6c9] rounded-md hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-serif text-white bg-[#2a363b] border border-transparent rounded-md hover:bg-opacity-90 transition">Save Supply</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const SUPPLIES_PER_PAGE = 10;

const AdminSupply = () => {
  const [supplies] = useState<SupplyRecord[]>([
    { id: 1, productId: 1, productName: 'Sac Classique Cuir Blanc', supplierName: 'Premium Leather Co.', quantity: 50, unitPrice: 150, totalPrice: 7500, supplyDate: '2024-01-15', status: 'delivered' },
    { id: 2, productId: 2, productName: 'Sneakers Blanches', supplierName: 'SportStyle Suppliers', quantity: 100, unitPrice: 75, totalPrice: 7500, supplyDate: '2024-01-20', status: 'pending' },
    // Ajoutez d'autres données factices ici
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<SupplyRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [supplyList, setSupplyList] = useState<SupplyRecord[]>(supplies);

  const filteredSupplies = useMemo(() => 
    supplyList.filter(supply => 
      supply.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    ), [supplyList, searchTerm]);

  const totalPages = Math.ceil(filteredSupplies.length / SUPPLIES_PER_PAGE);
  const paginatedSupplies = useMemo(() => 
    filteredSupplies.slice((currentPage - 1) * SUPPLIES_PER_PAGE, currentPage * SUPPLIES_PER_PAGE), 
    [filteredSupplies, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (supply: SupplyRecord | null = null) => {
    setEditingSupply(supply);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingSupply(null);
    setIsModalOpen(false);
  };

  const handleSaveSupply = (supplyData: SupplyFormData) => {
    const totalPrice = supplyData.quantity * supplyData.unitPrice;
    if (editingSupply) {
      setSupplyList(supplyList.map(s => s.id === editingSupply.id ? { ...editingSupply, ...supplyData, totalPrice } : s));
    } else {
      const newSupply: SupplyRecord = { ...supplyData, id: Date.now(), totalPrice };
      setSupplyList([...supplyList, newSupply]);
    }
  };

  const handleDeleteSupply = (supplyId: number) => {
    if (window.confirm('Are you sure you want to delete this supply record?')) {
      setSupplyList(supplyList.filter(s => s.id !== supplyId));
    }
  };

  const getStatusBadgeClass = (status: SupplyStatus) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Supply Management</h1>
          <p className="text-gray-600 mt-1">Track and manage product supplies and inventory restocking.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif">
          <Plus size={18} /> Add Supply
        </button>
      </div>
      <div className="mb-6 relative">
        <label htmlFor="search-supplies" className="sr-only">Search Supplies</label>
        <input id="search-supplies" type="text" placeholder="Search by product or supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"/>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-[#dcd6c9]">
          <thead className="bg-[#f3efe7]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e7e2d9]">
            {paginatedSupplies.map(supply => (
              <tr key={supply.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package size={20} className="text-gray-400 mr-3 flex-shrink-0" />
                    <div className="text-sm font-semibold text-gray-900">{supply.productName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supply.supplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">{supply.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-800">${supply.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{new Date(supply.supplyDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(supply.status)}`}>{supply.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(supply)} className="p-2 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"><Edit size={16}/></button>
                    <button onClick={() => handleDeleteSupply(supply.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <SupplyModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveSupply} supply={editingSupply}/>
    </motion.div>
  );
};

export default AdminSupply;