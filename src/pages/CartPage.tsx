// frontend/src/pages/CartPage.tsx
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
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

// ✅ MONTANT MINIMUM POUR MOBILE MONEY
const MINIMUM_PAYMENT_AMOUNT = 150; // 150 FCFA

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

  // ✅ VÉRIFIER SI LE MONTANT EST SOUS LE MINIMUM
  const isBelowMinimum = total < MINIMUM_PAYMENT_AMOUNT;
  const amountNeeded = MINIMUM_PAYMENT_AMOUNT - total;

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#f3efe7] min-h-[calc(100vh-128px)] flex items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="mx-auto h-20 w-20 sm:h-24 sm:w-24 text-gray-400 mb-6" />
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our collection to find something you'll love.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
      className="bg-[#f3efe7] min-h-screen py-12 sm:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-[#dcd6c9] p-4 flex flex-col sm:flex-row gap-4"
              >
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-md"
                  />
                </Link>
                <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-lg font-serif font-semibold text-[#2a363b] hover:underline mb-1">
                        {item.name}
                      </h3>
                    </Link>
                    {item.category && (
                      <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                    )}
                    <p className="text-lg font-semibold text-[#2a363b] sm:hidden">
                      {item.price.toFixed(0)} FCFA
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-normal sm:items-start sm:flex-col sm:gap-2">
                    <p className="hidden sm:block text-lg font-semibold text-right text-[#2a363b]">
                      {(item.price * item.quantity).toFixed(0)} FCFA
                    </p>
                    <div className="flex items-center gap-2 border border-[#dcd6c9] rounded-md">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-2 hover:bg-[#e7e2d9] transition rounded-l-md" aria-label="Decrease quantity"><Minus size={16} /></button>
                      <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-2 hover:bg-[#e7e2d9] transition rounded-r-md" aria-label="Increase quantity"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
                <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition self-start sm:self-center" aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#dcd6c9] p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-serif">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(0)} FCFA</span>
                </div>
                <div className="flex justify-between font-serif">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-[#dcd6c9] pt-4 mt-4">
                  <div className="flex justify-between text-lg font-serif">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-[#2a363b]">{total.toFixed(0)} FCFA</span>
                  </div>
                </div>
              </div>

              {/* ✅ AVERTISSEMENT SI MONTANT INSUFFISANT */}
              {isBelowMinimum && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">
                        Minimum Order for Mobile Money
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Minimum: <strong>{MINIMUM_PAYMENT_AMOUNT} FCFA</strong>
                        <br />
                        Current: <strong>{total.toFixed(0)} FCFA</strong>
                        <br />
                        <span className="text-yellow-800">
                          Add <strong>{amountNeeded.toFixed(0)} FCFA</strong> more to checkout with Mobile Money.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handleCheckout} 
                className="w-full bg-[#C06C54] text-white py-3 rounded-md hover:bg-opacity-90 transition font-serif flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              {isBelowMinimum && (
                <p className="text-xs text-center text-gray-600 mt-2">
                  * Card and PayPal available for any amount
                </p>
              )}

              <Link to="/shop" className="block text-center mt-4 text-gray-600 hover:text-[#2a363b] transition font-serif text-sm hover:underline">
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