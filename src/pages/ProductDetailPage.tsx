// frontend/src/pages/ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ChevronDown, AlertCircle, Package } from 'lucide-react';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import React from 'react';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#dcd6c9]">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="font-serif text-[#2a363b]">{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

type Product = {
  id_produit: number;
  nom_produit: string;
  prix: number;
  categorie: string;
  photo: string;
  description?: string;
  quantite: number;
  nom_createur?: string;
  date_creation?: string;
};

type ProductDetailPageProps = {
  onAddToCart: (product: any, quantity: number) => void;
};

const ProductDetailPage = ({ onAddToCart }: ProductDetailPageProps) => {
  const { productId } = useParams<{ productId: string }>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct(parseInt(productId));
    }
  }, [productId]);

  const fetchProduct = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      if (err.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to load product details');
        toast.error('Failed to load product');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (amount: number) => {
    if (!product) return;
    
    const newQuantity = quantity + amount;
    
    if (newQuantity < 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }
    
    if (newQuantity > product.quantite) {
      toast.error(`Only ${product.quantite} items available in stock`);
      return;
    }
    
    setQuantity(newQuantity);
  };

  const handleAddToCartClick = () => {
    if (!product) return;
    
    if (product.quantite === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    if (quantity > product.quantite) {
      toast.error(`Only ${product.quantite} items available`);
      return;
    }
    
    const cartProduct = {
      id: product.id_produit,
      name: product.nom_produit,
      price: product.prix,
      image: product.photo,
      category: product.categorie,
    };
    
    onAddToCart(cartProduct, quantity);
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setRefreshReviews(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="bg-[#f3efe7] min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
              <p className="mt-4 text-gray-600 font-serif">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#f3efe7] min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <AlertCircle className="mx-auto h-24 w-24 text-red-400" />
            <h2 className="mt-4 text-2xl font-serif text-gray-600">
              {error || 'Product not found'}
            </h2>
            <p className="mt-2 text-gray-500">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/shop" 
              className="mt-6 inline-block px-6 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.quantite === 0;
  const isLowStock = product.quantite > 0 && product.quantite <= 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7] py-20"
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 font-serif">
          <Link to="/shop" className="hover:text-[#2a363b]">Shop</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-[#2a363b]">{product.categorie}</Link>
          <span className="mx-2">/</span>
          <span className="text-[#2a363b]">{product.nom_produit}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image du produit */}
          <motion.div 
            className="rounded-lg overflow-hidden relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img 
              src={product.photo} 
              alt={product.nom_produit} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/placeholder-product.jpg';
              }}
            />
            
            {isOutOfStock && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Out of Stock
              </div>
            )}
            {isLowStock && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Only {product.quantite} left
              </div>
            )}
          </motion.div>
          
          {/* Détails du produit */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="font-serif text-sm text-gray-500 mb-2">{product.categorie}</p>
            <h1 className="text-4xl font-serif font-bold text-[#2a363b] mb-4">
              {product.nom_produit}
            </h1>
            
            <p className="text-3xl text-gray-800 font-serif mb-6">
              ${product.prix.toFixed(2)}
            </p>
            
            {product.description ? (
              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>
            ) : (
              <p className="text-gray-500 italic mb-8">
                No description available for this product.
              </p>
            )}

            <div className="mb-6 flex items-center gap-2 text-sm">
              <Package size={18} className="text-gray-500" />
              <span className={`font-semibold ${
                isOutOfStock ? 'text-red-600' : 
                isLowStock ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                {isOutOfStock ? 'Out of Stock' : 
                 isLowStock ? `Only ${product.quantite} left in stock` : 
                 'In Stock'}
              </span>
            </div>

            {product.nom_createur && (
              <p className="text-sm text-gray-600 mb-6">
                Sold by: <span className="font-semibold">{product.nom_createur}</span>
              </p>
            )}
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[#dcd6c9] rounded-md">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="p-3 hover:bg-[#e7e2d9] transition rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isOutOfStock || quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="p-3 hover:bg-[#e7e2d9] transition rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isOutOfStock || quantity >= product.quantite}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCartClick}
                disabled={isOutOfStock}
                className="flex-1 bg-[#C06C54] text-white font-serif py-3 px-6 rounded-md hover:bg-opacity-90 transition-transform transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {isLowStock && (
              <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-md flex items-start gap-3">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-orange-800 font-semibold">Limited Stock</p>
                  <p className="text-xs text-orange-700 mt-1">
                    Only {product.quantite} items left. Order soon to avoid missing out!
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <AccordionItem title="Materials & Care">
                <p>
                  This product is carefully curated. Please handle with care. 
                  For specific care instructions, refer to the item label or contact the seller.
                </p>
              </AccordionItem>
              
              <AccordionItem title="Shipping & Returns">
                <p>
                  Free standard shipping on all orders. Expedited shipping available at checkout. 
                  Returns are accepted within 30 days of purchase. Items must be in original condition. 
                  Please see our full return policy for details.
                </p>
              </AccordionItem>
              
              {product.date_creation && (
                <AccordionItem title="Product Information">
                  <p>
                    <strong>Category:</strong> {product.categorie}<br />
                    <strong>Product ID:</strong> {product.id_produit}<br />
                    <strong>Listed on:</strong> {new Date(product.date_creation).toLocaleDateString()}
                  </p>
                </AccordionItem>
              )}
            </div>
          </motion.div>
        </div>

        {/* Section Customer Reviews */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-6">
            Customer Reviews
          </h2>
          
          <div className="space-y-8">
            <ReviewsList key={refreshReviews} productId={product.id_produit} />
            
            <div>
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif"
                >
                  Write a Review
                </button>
              ) : (
                <div>
                  <ReviewForm 
                    productId={product.id_produit}
                    productName={product.nom_produit}
                    onSuccess={handleReviewSuccess}
                  />
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="mt-4 text-gray-600 hover:text-gray-900 text-sm font-serif"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section "More from category" */}
        <div className="mt-20">
          <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-8 text-center">
            More from {product.categorie}
          </h2>
          <div className="text-center">
            <Link 
              to={`/shop?category=${product.categorie}`}
              className="inline-block px-6 py-3 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif"
            >
              View More {product.categorie}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;