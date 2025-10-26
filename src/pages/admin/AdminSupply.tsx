// src/pages/admin/AdminSupplies.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { supplyAPI, productAPI } from '../../services/api';
import toast from 'react-hot-toast';
import React from 'react';

// --- TYPES ---
type Product = { id_produit: number; nom_produit: string; };
type Supply = {
  id_supply: number;
  id_produit: number;
  id_user: number;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  date_approvisionnement: string;
  statut: string;
  notes: string;
  nom_produit: string;
  nom_user: string;
};

type SupplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  supply: Supply | null;
  products: Product[];
};

// --- MODAL SIMPLIFIÉ ---
const SupplyModal = ({ isOpen, onClose, onSave, supply, products }: SupplyModalProps) => {
  const [formData, setFormData] = useState({
    id_produit: '', quantite: '', prix_unitaire: '', notes: ''
  });

  useEffect(() => {
    if (supply) {
      setFormData({
        id_produit: supply.id_produit.toString(),
        quantite: supply.quantite.toString(),
        prix_unitaire: supply.prix_unitaire.toString(),
        notes: supply.notes || ''
      });
    } else {
      setFormData({
        id_produit: '', quantite: '', prix_unitaire: '', notes: ''
      });
    }
  }, [supply, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 border border-[#dcd6c9] my-8">
        <h2 className="text-xl sm:text-2xl font-serif text-[#2a363b] mb-6">{supply ? 'Edit Supply' : 'Add New Supply'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="id_produit" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Product</label>
            <select name="id_produit" id="id_produit" value={formData.id_produit} onChange={handleChange} required className={`${inputStyle} appearance-none`}>
              <option value="">-- Select a product --</option>
              {products.map(product => (
                <option key={product.id_produit} value={product.id_produit}>{product.nom_produit}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantite" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Quantity</label>
              <input type="number" name="quantite" id="quantite" value={formData.quantite} onChange={handleChange} required min="1" className={inputStyle}/>
            </div>
            <div>
              <label htmlFor="prix_unitaire" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Unit Price (FCFA)</label>
              <input type="number" name="prix_unitaire" id="prix_unitaire" value={formData.prix_unitaire} onChange={handleChange} required min="0" step="0.01" className={inputStyle}/>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Notes (Optional)</label>
            <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputStyle}/>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-[#dcd6c9]">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-serif text-gray-700 bg-white border border-[#dcd6c9] rounded-md hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition">{supply ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---
const AdminSupplies = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const [suppliesRes, productsRes] = await Promise.all([
        supplyAPI.getAll(user?.role === 'seller' ? user.id : undefined),
        productAPI.getAll(user?.role === 'seller' ? user.id : undefined)
      ]);
      
      setSupplies(suppliesRes.data);
      setProducts(productsRes.data);
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (supply?: Supply) => {
    setEditingSupply(supply || null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveSupply = async (formData: any) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const payload = {
        id_produit: parseInt(formData.id_produit),
        id_user: user?.id,
        quantite: parseInt(formData.quantite),
        prix_unitaire: parseFloat(formData.prix_unitaire),
        // --- MODIFICATION ICI : La date est définie automatiquement ---
        date_approvisionnement: new Date().toISOString().split('T')[0],
        notes: formData.notes
      };

      if (editingSupply) {
        // Pour une mise à jour, on conserve la date originale
        const updatePayload = { ...payload, date_approvisionnement: editingSupply.date_approvisionnement.split('T')[0] };
        await supplyAPI.update(editingSupply.id_supply, updatePayload);
        toast.success('Supply updated successfully!');
      } else {
        await supplyAPI.create(payload);
        toast.success('Supply created successfully!');
      }
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save supply');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this supply?')) return;
    try {
      await supplyAPI.delete(id);
      toast.success('Supply deleted successfully!');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to delete supply');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string; } = {
      pending: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b]"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Supply Management</h1>
          <p className="text-gray-600 mt-1">Track and manage product supplies and restocking.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif">
          <Plus size={18} /> Add Supply
        </button>
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#dcd6c9]">
            <thead className="bg-[#f3efe7]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Managed By</th>
                <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e7e2d9]">
              {supplies.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No supplies found.</td></tr>
              ) : (
                supplies.map((supply) => (
                  <tr key={supply.id_supply} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-900">{supply.nom_produit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supply.nom_user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">{supply.quantite}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-800">{supply.prix_total.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{new Date(supply.date_approvisionnement).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusBadge(supply.statut)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(supply)} className="p-2 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(supply.id_supply)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <SupplyModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveSupply} supply={editingSupply} products={products} />
    </motion.div>
  );
};

export default AdminSupplies;