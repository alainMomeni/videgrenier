// src/pages/ShopPage.js

import { useState, useMemo, type SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Données de vos Produits ---
import { allProducts } from '../data/products';

const PRODUCTS_PER_PAGE = 6;

// --- Types ---
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

// --- Composant ProductCard ---
const ProductCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`}>
    <motion.div 
      className="group text-left" // cursor-pointer est enlevé
      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
    >
      {/* Le reste de la carte ne change pas */}
      <div className="overflow-hidden rounded-md relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-80 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 bg-white/80 backdrop-blur-sm text-[#2a363b] font-serif py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <ShoppingBag size={18} />
          View Details
        </div>
      </div>
      <h3 className="text-lg font-serif text-[#2a363b] mt-4">{product.name}</h3>
      <p className="text-md text-gray-700">${product.price.toFixed(2)}</p>
    </motion.div>
  </Link>
);


// --- Composant Principal de la Page Shop ---
const ShopPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    // Filtrage
    if (activeCategory !== 'All') {
      products = products.filter(p => p.category === activeCategory);
    }

    // Tri
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return products;
  }, [activeCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7]"
    >
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-center text-4xl font-serif font-bold text-[#2a363b] mb-4">Shop All</h1>
        <p className="text-center text-gray-600 font-serif mb-12">Discover our curated collection of vintage and pre-loved items.</p>

        {/* Barre de Filtres et Tri */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button 
                key={category} 
                onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-serif rounded-full transition ${activeCategory === category ? 'bg-[#2a363b] text-white' : 'bg-[#fcfaf7] text-gray-700 hover:bg-[#e7e2d9]'}`}
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
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grille des Produits */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {/* Pagination */}
        <div className="flex justify-center mt-16">
          <nav className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 font-serif rounded-full transition ${currentPage === page ? 'bg-[#2a363b] text-white' : 'bg-[#fcfaf7] text-gray-700 hover:bg-[#e7e2d9]'}`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopPage;