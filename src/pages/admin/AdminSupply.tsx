// frontend/src/pages/admin/AdminSupply.tsx
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import React from 'react';
import { supplyAPI, productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

type Product = {
  id_produit: number;
  nom_produit: string;
};

type Supplier = {
  id_fournisseur: number;
  nom_fournisseur: string;
};

type SupplyRecord = {
  id_supply: number;
  id_produit: number;
  id_fournisseur: number;
  id_user: number;
  nom_produit: string;
  nom_fournisseur: string;
  nom_user: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  date_approvisionnement: string;
  statut: 'pending' | 'delivered' | 'cancelled';
  notes?: string;
};

type SupplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supply: Omit<SupplyRecord, 'id_supply' | 'prix_total' | 'nom_produit' | 'nom_fournisseur' | 'nom_user'>) => void;
  supply: SupplyRecord | null;
  products: Product[];
  suppliers: Supplier[];
};

type SupplyFormData = {
  id_produit: number;
  id_fournisseur: number;
  id_user: number;
  quantite: number;
  prix_unitaire: number;
  date_approvisionnement: string;
  statut: 'pending' | 'delivered' | 'cancelled';
  notes: string;
};

const SupplyModal = ({ isOpen, onClose, onSave, supply, products, suppliers }: SupplyModalProps) => {
  const auth = useAuth();
  const user = auth?.user;
  
  const [formData, setFormData] = useState<SupplyFormData>({
    id_produit: 0,
    id_fournisseur: 0,
    id_user: user?.id || 0,
    quantite: 0,
    prix_unitaire: 0,
    date_approvisionnement: new Date().toISOString().split('T')[0],
    statut: 'pending',
    notes: ''
  });

  useEffect(() => {
    if (supply) {
      setFormData({
        id_produit: supply.id_produit,
        id_fournisseur: supply.id_fournisseur,
        id_user: supply.id_user,
        quantite: supply.quantite,
        prix_unitaire: supply.prix_unitaire,
        date_approvisionnement: supply.date_approvisionnement,
        statut: supply.statut,
        notes: supply.notes || ''
      });
    } else {
      setFormData({
        id_produit: 0,
        id_fournisseur: 0,
        id_user: user?.id || 0,
        quantite: 0,
        prix_unitaire: 0,
        date_approvisionnement: new Date().toISOString().split('T')[0],
        statut: 'pending',
        notes: ''
      });
    }
  }, [supply, isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['quantite', 'prix_unitaire', 'id_produit', 'id_fournisseur', 'id_user'].includes(name) 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  const calculatedTotal = (formData.quantite * formData.prix_unitaire).toFixed(2);

  if (!isOpen) return null;

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-3xl p-6 sm:p-8 border border-[#dcd6c9] my-8"
      >
        <h2 className="text-xl sm:text-2xl font-serif text-[#2a363b] mb-6">
          {supply ? 'Edit Supply Record' : 'Add New Supply'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-[#e7e2d9]">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Product Information</h3>
            <div>
              <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                Select Product *
              </label>
              <div className="relative">
                <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <select
                  name="id_produit"
                  value={formData.id_produit}
                  onChange={handleChange}
                  className={`${inputStyle} pl-10 appearance-none`}
                  required
                >
                  <option value={0}>-- Select a product --</option>
                  {products.map(product => (
                    <option key={product.id_produit} value={product.id_produit}>
                      {product.nom_produit} (ID: {product.id_produit})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#e7e2d9]">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Supplier</h3>
            <div>
              <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                Supplier *
              </label>
              <select
                name="id_fournisseur"
                value={formData.id_fournisseur}
                onChange={handleChange}
                className={`${inputStyle} appearance-none`}
                required
              >
                <option value={0}>-- Select a supplier --</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id_fournisseur} value={supplier.id_fournisseur}>
                    {supplier.nom_fournisseur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#e7e2d9]">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Supply Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantite"
                  value={formData.quantite}
                  onChange={handleChange}
                  min="1"
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Unit Price ($) *
                </label>
                <input
                  type="number"
                  name="prix_unitaire"
                  value={formData.prix_unitaire}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Total Price
                </label>
                <input
                  type="text"
                  value={`$${calculatedTotal}`}
                  disabled
                  className={`${inputStyle} bg-gray-100 font-semibold`}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Supply Date *
                </label>
                <input
                  type="date"
                  name="date_approvisionnement"
                  value={formData.date_approvisionnement}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Status *
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className={`${inputStyle} appearance-none`}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes..."
              className={inputStyle}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-[#dcd6c9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 text-sm font-serif text-gray-700 bg-white border border-[#dcd6c9] rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition"
            >
              {supply ? 'Update Supply' : 'Add Supply'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const SUPPLIES_PER_PAGE = 10;

const AdminSupply = ({ isSellerView = false }) => {
  const auth = useAuth();
  const user = auth?.user;

  const [supplies, setSupplies] = useState<SupplyRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<SupplyRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [isSellerView, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Charger les produits
      const productsResponse = isSellerView && user 
        ? await productAPI.getAll(user.id)
        : await productAPI.getAll();
      setProducts(productsResponse.data);
      
      // Charger les fournisseurs
      const suppliersResponse = await supplyAPI.getSuppliers();
      setSuppliers(suppliersResponse.data);
      
      // Charger les approvisionnements
      const suppliesResponse = isSellerView && user
        ? await supplyAPI.getAll(user.id)
        : await supplyAPI.getAll();
      setSupplies(suppliesResponse.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load supplies');
    } finally {
      setLoading(false);
    }
  };

  const filteredSupplies = useMemo(() => 
    supplies.filter(supply => 
      supply.nom_produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.nom_fournisseur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.nom_user?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [supplies, searchTerm]);

  const totalPages = Math.ceil(filteredSupplies.length / SUPPLIES_PER_PAGE);
  const paginatedSupplies = useMemo(() => 
    filteredSupplies.slice(
      (currentPage - 1) * SUPPLIES_PER_PAGE,
      currentPage * SUPPLIES_PER_PAGE
    ), [filteredSupplies, currentPage]);

  const handleSaveSupply = async (supplyData: any) => {
    try {
      if (editingSupply) {
        await supplyAPI.update(editingSupply.id_supply, supplyData);
        toast.success('Supply updated successfully');
      } else {
        await supplyAPI.create(supplyData);
        toast.success('Supply created successfully');
      }
      
      setIsModalOpen(false);
      setEditingSupply(null);
      fetchData();
    } catch (error) {
      console.error('Error saving supply:', error);
      toast.error('Failed to save supply');
    }
  };

  const handleDeleteSupply = async (supplyId: number) => {
    if (window.confirm('Are you sure you want to delete this supply record?')) {
      try {
        await supplyAPI.delete(supplyId);
        toast.success('Supply deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting supply:', error);
        toast.error('Failed to delete supply');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading supplies...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">
            {isSellerView ? 'My Supplies' : 'Supply Management'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {isSellerView 
              ? 'Track and manage your product restocking.' 
              : 'Track and manage product supplies and inventory restocking.'}
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingSupply(null);
            setIsModalOpen(true);
          }} 
          className="flex items-center gap-2 px-4 py-2 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif text-sm"
        >
          <Plus size={18} /> Add Supply
        </button>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="search-supplies" className="sr-only">Search Supplies</label>
        <input 
          id="search-supplies"
          type="text"
          placeholder="Search by product, supplier, or user..."
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
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase">
                  Product Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase">
                  Supplier
                </th>
                {!isSellerView && (
                  <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase hidden sm:table-cell">
                    Managed By
                  </th>
                )}
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase hidden md:table-cell">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e7e2d9]">
              {paginatedSupplies.map(supply => (
                <tr key={supply.id_supply} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{supply.nom_produit}</div>
                      {supply.notes && (
                        <div className="text-xs text-gray-600 mt-1">Note: {supply.notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700">{supply.nom_fournisseur}</div>
                  </td>
                  {!isSellerView && (
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div>
                        <div className="text-sm text-gray-700">{supply.nom_user}</div>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium">{supply.quantite}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className="text-sm">${Number(supply.prix_unitaire).toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-semibold text-[#2a363b]">
                      ${Number(supply.prix_total).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="text-sm text-gray-600">
                      {new Date(supply.date_approvisionnement).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(supply.statut)}`}>
                      {supply.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => {
                          setEditingSupply(supply);
                          setIsModalOpen(true);
                        }} 
                        className="p-1.5 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"
                      >
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDeleteSupply(supply.id_supply)} 
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </span>

            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      )}

      <SupplyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveSupply} 
        supply={editingSupply}
        products={products}
        suppliers={suppliers}
      />
    </motion.div>
  );
};

export default AdminSupply;