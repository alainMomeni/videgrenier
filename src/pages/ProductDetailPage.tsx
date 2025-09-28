// src/pages/ProductDetailPage.tsx

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import { allProducts } from '../data/products';
import React from 'react';

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#dcd6c9]">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
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

type ProductDetailPageProps = {
  onAddToCart: (product: any, quantity: number) => void;
};

const ProductDetailPage = ({ onAddToCart }: ProductDetailPageProps) => {
  const { productId } = useParams<{ productId: string }>();
  const product = allProducts.find(p => p.id === parseInt(productId ?? '0'));
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="text-center py-20 font-serif text-2xl">
        Product not found. <Link to="/shop" className="underline">Return to shop</Link>
      </div>
    );
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    // Appelle la fonction de App.js en passant l'objet produit et la quantité
    onAddToCart(product, quantity);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div 
            className="rounded-lg overflow-hidden"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="font-serif text-sm text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-4xl font-serif font-bold text-[#2a363b] mb-4">{product.name}</h1>
            <p className="text-3xl text-gray-800 font-serif mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[#dcd6c9] rounded-md">
                <button onClick={() => handleQuantityChange(-1)} className="p-3 hover:bg-[#e7e2d9] transition rounded-l-md"><Minus size={16} /></button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-3 hover:bg-[#e7e2d9] transition rounded-r-md"><Plus size={16} /></button>
              </div>
              
              <button 
                onClick={handleAddToCartClick}
                className="flex-1 bg-[#C06C54] text-white font-serif py-3 px-6 rounded-md hover:bg-opacity-90 transition-transform transform hover:-translate-y-0.5"
              >
                Add to Cart
              </button>
            </div>

            <div className="space-y-2">
              <AccordionItem title="Materials & Care">
                <p>Made from 100% genuine leather. To clean, wipe gently with a damp cloth. Avoid direct sunlight and moisture.</p>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p>Free standard shipping on all orders. Expedited shipping available. Returns are accepted within 30 days of purchase. Please see our full policy for details.</p>
              </AccordionItem>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;