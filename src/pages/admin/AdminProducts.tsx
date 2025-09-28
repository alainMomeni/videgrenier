// src/pages/admin/AdminProducts.tsx

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, UploadCloud, DollarSign } from 'lucide-react';
import { allProducts as initialProductsRaw } from '../../data/products';
import React from 'react';

// Le type Product est simplifié, on enlève 'soldToday' car il n'est plus géré ici
type Product = {
  id?: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
};

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product, imageFile: File | null) => void;
  product: Product | null;
};

// Le modal reste complet car l'admin doit pouvoir définir le stock initial ici
const ProductModal = ({ isOpen, onClose, onSave, product }: ProductModalProps) => {
  const [formData, setFormData] = useState<Product>({ name: '', category: '', price: 0, image: '', description: '', stock: 0 });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.image);
    } else {
      setFormData({ name: '', category: '', price: 0, image: '', description: '', stock: 0 });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData, imageFile);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-2xl p-8 border border-[#dcd6c9] my-8">
        <h2 className="text-2xl font-serif text-[#2a363b] mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Product Image</label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-24 w-24 rounded-md overflow-hidden bg-[#e7e2d9] flex-shrink-0">
                {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-gray-500"><UploadCloud /></div>}
              </div>
              <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-[#dcd6c9] rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-[#e7e2d9] transition">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyle} required/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Category</label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className={inputStyle} required/>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Current Stock</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} className={inputStyle} required/>
            </div>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Price</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><DollarSign size={16} /></span>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="0.01" className={`${inputStyle} pl-10`} required/>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className={inputStyle} required></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-[#dcd6c9]">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-serif text-gray-700 bg-white border border-[#dcd6c9] rounded-md hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-serif text-white bg-[#2a363b] border border-transparent rounded-md hover:bg-opacity-90 transition">Save Product</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProductsRaw);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => 
    products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]);
  
  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = (productData: Product, imageFile: File | null) => {
    let imageUrl = productData.image;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData, image: imageUrl } : p));
    } else {
      setProducts([...products, { ...productData, id: Date.now(), image: imageUrl }]);
    }
  };

  const handleDeleteProduct = (productId?: number) => {
    if (productId && window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Manage Products</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove products from your store catalog.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="search-products" className="sr-only">Search Products</label>
        <input 
          id="search-products"
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-[#dcd6c9]">
          <thead className="bg-[#f3efe7]">
            {/* --- TABLEAU SIMPLIFIÉ --- */}
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e7e2d9]">
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-11 w-11">
                      <img className="h-11 w-11 rounded-md object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 font-medium">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"><Edit size={16}/></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* La pagination et le modal sont conservés, mais ne sont pas affichés ici pour la clarté */}
      {/* N'oubliez pas d'ajouter la pagination si vous le souhaitez */}
      
      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveProduct} product={editingProduct}/>
    </motion.div>
  );
};

export default AdminProducts;