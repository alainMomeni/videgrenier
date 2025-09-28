// src/pages/CartPage.tsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

// Définir les types des props pour la page
type CartPageProps = {
  cartItems: any[]; // Idéalement, définir un type plus précis pour les articles
  onUpdateQuantity: (id: number, amount: number) => void;
  onRemoveItem: (id: number) => void;
};

const CartPage = ({ cartItems, onUpdateQuantity, onRemoveItem }: CartPageProps) => {
  // Les fonctions appellent maintenant directement les props
  const handleQuantityChange = (id: number, amount: number) => {
    onUpdateQuantity(id, amount);
  };

  const handleRemoveItem = (id: number) => {
    onRemoveItem(id);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7] min-h-[calc(100vh-128px)]"
    >
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-center text-[#2a363b] mb-12">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
            <p className="mt-4 font-serif text-xl text-gray-600">Your cart is empty.</p>
            <Link to="/shop" className="mt-6 inline-block px-8 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition-transform transform hover:-translate-y-0.5">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                  className="flex items-center gap-6 bg-[#fcfaf7] p-4 border border-[#dcd6c9] rounded-lg"
                >
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-grow">
                    <Link to={`/product/${item.id}`} className="font-serif text-lg text-[#2a363b] hover:underline">{item.name}</Link>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center border border-[#dcd6c9] rounded-md">
                    <button onClick={() => handleQuantityChange(item.id, -1)} className="p-2 hover:bg-[#e7e2d9] transition rounded-l-md"><Minus size={16} /></button>
                    <span className="px-4 font-semibold">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)} className="p-2 hover:bg-[#e7e2d9] transition rounded-r-md"><Plus size={16} /></button>
                  </div>
                  <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition">
                    <X size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-[#fcfaf7] p-8 border border-[#dcd6c9] rounded-lg sticky top-24">
                <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-6">Order Summary</h2>
                <div className="flex justify-between font-serif text-gray-700 mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif text-gray-700 mb-6">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-xl text-[#2a363b] pt-4 border-t border-[#dcd6c9]">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button className="w-full mt-8 bg-[#C06C54] text-white font-serif py-3 rounded-md hover:bg-opacity-90 transition-transform transform hover:-translate-y-0.5">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;