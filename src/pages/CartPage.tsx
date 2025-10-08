// frontend/src/pages/CartPage.tsx
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  [key: string]: any;
};

type CartPageProps = {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string | number, amount: number) => void;
  onRemoveItem: (productId: string | number) => void;
};

const CartPage = ({ cartItems, onUpdateQuantity, onRemoveItem }: CartPageProps) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        cartItems: cartItems.map(item => ({
          id: Number(item.id),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      } 
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#f3efe7] min-h-screen py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
          <h2 className="text-3xl font-serif font-bold text-[#2a363b] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#f3efe7] min-h-screen py-12"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold text-[#2a363b] mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-[#dcd6c9] p-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-serif font-semibold text-[#2a363b] mb-1">
                    {item.name}
                  </h3>
                  {item.category && (
                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                  )}
                  <p className="text-lg font-semibold text-[#2a363b]">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center gap-2 border border-[#dcd6c9] rounded-md">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-2 hover:bg-[#e7e2d9] transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-2 hover:bg-[#e7e2d9] transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#dcd6c9] p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-[#dcd6c9] pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-[#2a363b]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#C06C54] text-white py-3 rounded-md hover:bg-opacity-90 transition font-serif flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
              <Link
                to="/shop"
                className="block text-center mt-4 text-gray-600 hover:text-[#2a363b] transition font-serif text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;