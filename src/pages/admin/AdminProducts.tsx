// frontend/src/pages/admin/AdminProducts.tsx
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, UploadCloud, ChevronLeft, ChevronRight, Package, Coins, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productAPI, uploadProductImage } from '../../services/api';
import { PRODUCT_CATEGORIES } from '../../config/categories';
import toast from 'react-hot-toast';
import React from 'react';

// ✅ PRIX MINIMUM POUR LES PRODUITS
const MINIMUM_PRODUCT_PRICE = 150; // 150 FCFA minimum

type Product = {
  id_produit: number;
  id_user: number;
  nom_produit: string;
  nom_createur: string;
  categorie: string;
  prix: number;
  quantite: number;
  photo: string;
  description?: string;
  date_creation?: string;
};

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id_produit' | 'nom_createur' | 'date_creation'>, imageFile: File | null) => void;
  product: Product | null;
  isSaving: boolean; // ✅ NOUVEAU
};

const ProductModal = ({ isOpen, onClose, onSave, product, isSaving }: ProductModalProps) => {
  const auth = useAuth();
  const user = auth?.user;
  
  const [formData, setFormData] = useState<Omit<Product, 'id_produit' | 'nom_createur' | 'date_creation'>>({ 
    id_user: user?.id || 0, 
    nom_produit: '', 
    categorie: '', 
    prix: MINIMUM_PRODUCT_PRICE,
    quantite: 0, 
    photo: '', 
    description: '' 
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        id_user: product.id_user,
        nom_produit: product.nom_produit,
        categorie: product.categorie,
        prix: product.prix,
        quantite: product.quantite,
        photo: product.photo,
        description: product.description || ''
      });
      setImagePreview(product.photo);
    } else {
      setFormData({ 
        id_user: user?.id || 0, 
        nom_produit: '', 
        categorie: '', 
        prix: MINIMUM_PRODUCT_PRICE,
        quantite: 0, 
        photo: '', 
        description: '' 
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'prix' || name === 'quantite' || name === 'id_user' ? Number(value) : value 
    }));
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
    
    // ✅ VALIDATION DU PRIX MINIMUM
    if (formData.prix < MINIMUM_PRODUCT_PRICE) {
      toast.error(
        `Minimum product price is ${MINIMUM_PRODUCT_PRICE} FCFA (required for Mobile Money payment)`,
        {
          duration: 5000,
          icon: '⚠️',
        }
      );
      return;
    }

    onSave(formData, imageFile);
  };

  if (!isOpen) return null;

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent text-sm";
  const isPriceInvalid = formData.prix > 0 && formData.prix < MINIMUM_PRODUCT_PRICE;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-2xl p-6 sm:p-8 border border-[#dcd6c9] my-8"
      >
        <h2 className="text-xl sm:text-2xl font-serif text-[#2a363b] mb-6">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>

        {/* ✅ LOADER OVERLAY */}
        {isSaving && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-lg z-10">
            <Loader className="animate-spin h-12 w-12 text-[#2a363b] mb-4" />
            <p className="text-lg font-serif text-[#2a363b] mb-2">
              {imageFile ? 'Uploading image...' : 'Saving product...'}
            </p>
            <p className="text-sm text-gray-600">Please wait, this may take a moment</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-serif font-medium text-[#2a363b] mb-2">
              Product Photo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-24 w-24 rounded-md overflow-hidden bg-[#e7e2d9] flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    <UploadCloud size={24} />
                  </div>
                )}
              </div>
              <label 
                htmlFor="file-upload" 
                className={`cursor-pointer bg-white py-2 px-4 border border-[#dcd6c9] rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-[#e7e2d9] transition ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>Upload Photo</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  onChange={handleImageChange} 
                  accept="image/*"
                  disabled={isSaving}
                />
              </label>
            </div>
          </div>

          {/* Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="nom_produit" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                Product Name *
              </label>
              <input 
                type="text" 
                name="nom_produit" 
                id="nom_produit" 
                value={formData.nom_produit} 
                onChange={handleChange} 
                placeholder="Enter product name"
                className={inputStyle} 
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label htmlFor="categorie" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                Category *
              </label>
              <select 
                name="categorie" 
                id="categorie" 
                value={formData.categorie} 
                onChange={handleChange} 
                className={inputStyle} 
                required
                disabled={isSaving}
              >
                <option value="">-- Select a category --</option>
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="prix" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                Price (FCFA) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Coins size={16} />
                </span>
                <input 
                  type="number" 
                  name="prix" 
                  id="prix" 
                  value={formData.prix} 
                  onChange={handleChange} 
                  step="1" 
                  min={MINIMUM_PRODUCT_PRICE}
                  placeholder={`Min: ${MINIMUM_PRODUCT_PRICE}`}
                  className={`${inputStyle} pl-10 ${isPriceInvalid ? 'border-red-500' : ''}`}
                  required
                  disabled={isSaving}
                />
              </div>
              {isPriceInvalid && (
                <div className="mt-2 flex items-start gap-2 text-red-600">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs">
                    Price must be at least <strong>{MINIMUM_PRODUCT_PRICE} FCFA</strong> (required for Mobile Money)
                  </p>
                </div>
              )}
              {!isPriceInvalid && (
                <p className="mt-1 text-xs text-gray-500">
                  💡 Minimum: {MINIMUM_PRODUCT_PRICE} FCFA (for Mobile Money payment)
                </p>
              )}
            </div>
            <div>
              <label htmlFor="quantite" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                {product ? 'Current Quantity (Read-only)' : 'Initial Quantity *'}
              </label>
              {product ? (
                <div>
                  <input 
                    type="number" 
                    name="quantite" 
                    id="quantite" 
                    value={formData.quantite} 
                    className={`${inputStyle} bg-gray-100 cursor-not-allowed`} 
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Quantity is managed via Sales and Supplies only
                  </p>
                </div>
              ) : (
                <div>
                  <input 
                    type="number" 
                    name="quantite" 
                    id="quantite" 
                    value={formData.quantite} 
                    onChange={handleChange} 
                    min="0"
                    placeholder="0"
                    className={inputStyle} 
                    required
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Initial stock quantity
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
              Description (Optional)
            </label>
            <textarea 
              name="description" 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              placeholder="Describe your product..."
              className={inputStyle}
              disabled={isSaving}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-[#dcd6c9]">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 sm:px-6 py-2 text-sm font-serif text-gray-700 bg-white border border-[#dcd6c9] rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isPriceInvalid || isSaving}
              className="px-4 sm:px-6 py-2 text-sm font-serif text-white bg-[#2a363b] border border-transparent rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{product ? 'Update Product' : 'Save Product'}</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const PRODUCTS_PER_PAGE = 10;

const AdminProducts = ({ isSellerView = false }) => {
  const auth = useAuth();
  const user = auth?.user;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false); // ✅ NOUVEAU

  useEffect(() => {
    fetchProducts();
  }, [isSellerView, user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const response = isSellerView && user 
        ? await productAPI.getAll(user.id) 
        : await productAPI.getAll();
      
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => 
    products.filter(product => 
      product.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (!isSellerView && product.nom_createur?.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [products, searchTerm, isSellerView]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => 
    filteredProducts.slice(
      (currentPage - 1) * PRODUCTS_PER_PAGE,
      currentPage * PRODUCTS_PER_PAGE
    ), [filteredProducts, currentPage]);
  
  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id_produit' | 'nom_createur' | 'date_creation'>, imageFile: File | null) => {
    try {
      // ✅ VALIDATION DU PRIX MINIMUM
      if (productData.prix < MINIMUM_PRODUCT_PRICE) {
        toast.error(
          `Product price must be at least ${MINIMUM_PRODUCT_PRICE} FCFA`,
          {
            duration: 5000,
            icon: '⚠️',
          }
        );
        return;
      }

      setIsSaving(true); // ✅ Activer le loader

      let imageUrl = productData.photo;
      
      if (imageFile) {
        console.log('📸 Uploading new image to Cloudinary...');
        imageUrl = await uploadProductImage(imageFile);
        console.log('✅ Image URL received from Cloudinary:', imageUrl);
        // ❌ RETIRÉ : toast.success('Image uploaded successfully to Cloudinary');
      }
     
      const dataToSend = {
        ...productData,
        photo: imageUrl,
        nom_createur: user ? `${user.firstName} ${user.lastName}` : 'Unknown'
      };
      
      if (editingProduct) {
        await productAPI.update(editingProduct.id_produit, dataToSend);
        toast.success('Product updated successfully! 🎉');
      } else {
        await productAPI.create(dataToSend);
        toast.success('Product created successfully! 🎉');
      }
      
      handleCloseModal(); // ✅ Fermer le modal
      fetchProducts(); // ✅ Recharger les produits
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false); // ✅ Désactiver le loader
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error: any) {
        console.error('Error deleting product:', error);
        
        if (error.response?.data?.message) {
          const message = error.response.data.message;
          
          toast.error(message, {
            duration: 8000,
            style: {
              maxWidth: '600px',
              whiteSpace: 'pre-line',
            },
            icon: '🚫',
          });
          
          if (error.response.data.dependencies) {
            console.log('📋 Product dependencies:', error.response.data.dependencies);
          }
        } else {
          toast.error('Failed to delete product');
        }
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const firstItemIndex = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const lastItemIndex = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">
            {isSellerView ? 'My Products' : 'Manage All Products'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {isSellerView 
              ? 'Add, edit, or remove your products from the catalog.' 
              : 'Manage all products from all sellers.'}
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif text-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="search-products" className="sr-only">Search Products</label>
        <input 
          id="search-products"
          type="text"
          placeholder={isSellerView ? "Search your products..." : "Search by name, category, or seller..."}
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
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                  Photo & Name
                </th>
                {!isSellerView && (
                  <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider hidden sm:table-cell">
                    Created By
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider hidden lg:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e7e2d9]">
              {paginatedProducts.map(product => (
                <tr key={product.id_produit} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={product.photo} 
                          alt={product.nom_produit} 
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-semibold text-gray-900">
                          {product.nom_produit}
                        </div>
                        {isSellerView && (
                          <div className="text-xs text-gray-500 sm:hidden">
                            {product.nom_createur}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {!isSellerView && (
                    <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        <Package size={14} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{product.nom_createur}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {product.categorie}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <div className="flex items-center justify-center">
                      <Package size={14} className="text-gray-400 mr-1" />
                      <span className="font-medium">{product.quantite}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-800">
                    {product.prix.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenModal(product)} 
                        className="p-1.5 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"
                        title="Edit product"
                      >
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id_produit)} 
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition"
                        title="Delete product"
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

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{currentPage}</span> of{' '}
              <span className="font-semibold">{totalPages}</span>
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveProduct} 
        product={editingProduct}
        isSaving={isSaving} // ✅ Passer l'état du loader
      />
    </motion.div>
  );
};

export default AdminProducts;