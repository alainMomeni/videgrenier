// frontend/src/pages/ShopPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { PRODUCT_CATEGORIES } from '../config/categories';
import toast from 'react-hot-toast';

const PRODUCTS_PER_PAGE = 6;

// Types
type Product = {
  id_produit: number;
  nom_produit: string;
  prix: number;
  categorie: string;
  photo: string;
  description?: string;
  quantite: number;
};

// Composant ProductCard
const ProductCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id_produit}`}>
    <motion.div 
      className="group text-left"
      variants={{ 
        hidden: { y: 20, opacity: 0 }, 
        visible: { 
          y: 0, 
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut" as const
          }
        } 
      }}
    >
      <div className="overflow-hidden rounded-md relative">
        <img 
          src={product.photo} 
          alt={product.nom_produit} 
          className="w-full h-80 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/placeholder-product.jpg';
          }}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 bg-white/80 backdrop-blur-sm text-[#2a363b] font-serif py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <ShoppingBag size={18} />
          View Details
        </div>
        
        {/* Badge de stock */}
        {product.quantite === 0 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
        {product.quantite > 0 && product.quantite <= 5 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Only {product.quantite} left
          </div>
        )}
      </div>
      <h3 className="text-lg font-serif text-[#2a363b] mt-4">{product.nom_produit}</h3>
      <div className="flex items-center justify-between mt-1">
        <p className="text-md text-gray-700 font-semibold">
          {product.prix.toLocaleString('fr-FR')} FCFA
        </p>
        <span className="text-xs text-gray-500">{product.categorie}</span>
      </div>
    </motion.div>
  </Link>
);

// Composant Principal
const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Charger les produits depuis l'API
  useEffect(() => {
    fetchProducts();
  }, []);

  // Gérer la catégorie depuis l'URL
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== activeCategory) {
      setActiveCategory(categoryFromUrl);
      setCurrentPage(1);
    }
  }, [categoryFromUrl]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Extraire les catégories uniques depuis les produits
  const categories = useMemo(() => {
    const productCategories = new Set(products.map(p => p.categorie));
    // Filtrer PRODUCT_CATEGORIES pour ne garder que celles qui ont des produits
    const usedCategories = PRODUCT_CATEGORIES.filter(cat => productCategories.has(cat));
    return ['All', ...usedCategories];
  }, [products]);

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = [...products];

    // Filtrage par catégorie
    if (activeCategory !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.categorie === activeCategory);
    }

    // Tri
    switch (sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.prix - a.prix);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.nom_produit.localeCompare(b.nom_produit));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.nom_produit.localeCompare(a.nom_produit));
        break;
      default:
        break;
    }

    return filteredProducts;
  }, [products, activeCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    
    // Mettre à jour l'URL
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="bg-[#f3efe7] min-h-screen">
        <div className="container mx-auto px-8 lg:px-12 xl:px-16 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
              <p className="mt-4 text-gray-600 font-serif">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Aucun produit
  if (products.length === 0) {
    return (
      <div className="bg-[#f3efe7] min-h-screen">
        <div className="container mx-auto px-8 lg:px-12 xl:px-16 py-16">
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-4 text-2xl font-serif text-gray-600">No products available</h2>
            <p className="mt-2 text-gray-500">Check back later for new items!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7]"
    >
      <div className="container mx-auto px-8 lg:px-12 xl:px-16 py-16">
        <h1 className="text-center text-4xl font-serif font-bold text-[#2a363b] mb-4">Shop All</h1>
        <p className="text-center text-gray-600 font-serif mb-12">
          Discover our curated collection of vintage and pre-loved items.
        </p>

        {/* Barre de Filtres et Tri */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button 
                key={category} 
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-sm font-serif rounded-full transition ${
                  activeCategory === category 
                    ? 'bg-[#2a363b] text-white' 
                    : 'bg-[#fcfaf7] text-gray-700 hover:bg-[#e7e2d9]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-serif text-gray-700">Sort by:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#c0b8a8]"
            >
              <option value="default">Featured</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Message si aucun produit dans la catégorie */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 font-serif text-lg">
              No products found in the "{activeCategory}" category.
            </p>
            <button 
              onClick={() => handleCategoryChange('All')}
              className="mt-4 px-6 py-2 bg-[#2a363b] text-white rounded-full hover:bg-opacity-90 transition font-serif"
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            {/* Grille des Produits */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentProducts.map(product => (
                <ProductCard key={product.id_produit} product={product} />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <nav className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page} 
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 font-serif rounded-full transition ${
                        currentPage === page 
                          ? 'bg-[#2a363b] text-white' 
                          : 'bg-[#fcfaf7] text-gray-700 hover:bg-[#e7e2d9]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Stats des produits */}
            <div className="mt-8 text-center text-sm text-gray-600 font-serif">
              Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredAndSortedProducts.length)} of{' '}
              {filteredAndSortedProducts.length} products
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ShopPage;