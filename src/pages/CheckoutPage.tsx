// frontend/src/pages/CheckoutPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import React from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type MobileOperator = 'orange' | 'mtn' | null;

// ✅ MONTANT MINIMUM POUR MOBILE MONEY
const MINIMUM_PAYMENT_AMOUNT = 150; // 150 FCFA

const CheckoutPage = ({ }: { onClearCart: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cartItems || [];
  
  const [formData, setFormData] = useState({
    phone: '', 
    shipping_address: ''
  });
  
  const [mobileOperator, setMobileOperator] = useState<MobileOperator>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      toast.error('Please login to checkout', {
        duration: 4000,
        icon: '🔒',
      });
      
      if (cartItems.length > 0) {
        localStorage.setItem('pendingCheckout', JSON.stringify(cartItems));
      }
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            from: '/checkout',
            message: 'Please login to complete your purchase'
          } 
        });
      }, 1500);
      
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserInfo(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate, cartItems]);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePayment = () => {
    // ✅ VÉRIFIER LE MONTANT MINIMUM
    if (totalAmount < MINIMUM_PAYMENT_AMOUNT) {
      toast.error(
        `Minimum payment is ${MINIMUM_PAYMENT_AMOUNT} FCFA. Your cart total is ${totalAmount.toFixed(0)} FCFA.`,
        {
          duration: 6000,
          icon: '⚠️',
        }
      );
      return false;
    }

    if (!mobileOperator) {
      toast.error('Please select Orange Money or MTN Mobile Money');
      return false;
    }

    if (!formData.phone) {
      toast.error('Please enter your phone number');
      return false;
    }

    const cleanPhone = formData.phone.replace(/\s/g, '');
    const isValidOrange = mobileOperator === 'orange' && /^6[5-9]\d{7}$/.test(cleanPhone);
    const isValidMTN = mobileOperator === 'mtn' && /^6[7|5][0-9]\d{6}$/.test(cleanPhone);

    if (!isValidOrange && !isValidMTN) {
      toast.error(`Invalid ${mobileOperator === 'orange' ? 'Orange Money' : 'MTN'} phone number format`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !userInfo) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!validatePayment()) {
      return;
    }

    try {
      setIsProcessing(true);

      // Générer un order_id unique
      const order_id = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      
      // Formater le numéro au format CamPay (237XXXXXXXXX)
      const cleanPhone = formData.phone.replace(/\s/g, '');
      const fullPhone = `237${cleanPhone}`;

      // Rediriger vers la page de paiement mobile avec TOUTES les infos
      navigate('/mobile-payment', {
        state: {
          order_id,
          amount: totalAmount,
          phone_number: fullPhone,
          operator: mobileOperator,
          cart_items: cartItems.map(item => ({ 
            id_produit: item.id, 
            quantity: item.quantity,
            nom_produit: item.name,
            prix: item.price
          })),
          shipping_address: formData.shipping_address,
          buyer_id: userInfo.id,
          buyer_email: userInfo.email
        }
      });

    } catch (error: any) {
      console.error('Checkout error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      const message = error.response?.data?.message || 'Failed to process order. Please try again.';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#f3efe7] min-h-[calc(100vh-128px)] flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C06C54] mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="bg-[#f3efe7] min-h-[calc(100vh-128px)] flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
          <h1 className="text-3xl font-serif text-gray-700 mb-4">Your cart is empty</h1>
          <button 
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif shadow-sm hover:shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";
  const isBelowMinimum = totalAmount < MINIMUM_PAYMENT_AMOUNT;

  return (
    <div className="bg-[#f3efe7] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <button 
          onClick={() => navigate('/cart')} 
          className="flex items-center gap-2 text-gray-600 hover:text-[#2a363b] mb-6 font-serif transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-2">
          Checkout
        </h1>
        <p className="text-gray-600 mb-8">
          💳 Payment via Mobile Money (Orange Money & MTN Mobile Money)
        </p>

        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#fcfaf7] rounded-lg border border-[#dcd6c9] shadow-sm">
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {userInfo?.firstName?.charAt(0)}{userInfo?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {userInfo?.firstName} {userInfo?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{userInfo?.email}</p>
                  </div>
                </div>
                <p className="text-xs text-green-700">✓ Logged in</p>
              </div>

              {/* ✅ AVERTISSEMENT SI MONTANT INSUFFISANT */}
              {isBelowMinimum && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-red-800 font-semibold">⚠️ Minimum Amount Required</p>
                    <p className="text-xs text-red-700 mt-1">
                      Minimum payment is <strong>{MINIMUM_PAYMENT_AMOUNT} FCFA</strong>. 
                      Your cart total is <strong>{totalAmount.toFixed(0)} FCFA</strong>. 
                      Please add <strong>{(MINIMUM_PAYMENT_AMOUNT - totalAmount).toFixed(0)} FCFA</strong> more to proceed.
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Money Operators */}
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">
                  Select Your Mobile Money Operator
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setMobileOperator('orange')}
                    disabled={isBelowMinimum}
                    className={`p-6 border-2 rounded-lg transition text-center ${
                      mobileOperator === 'orange'
                        ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                        : 'border-gray-300 hover:border-orange-300 bg-white'
                    } ${isBelowMinimum ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                  >
                    <div className="text-4xl mb-3">🟠</div>
                    <p className="font-serif font-bold text-gray-900 text-lg">Orange Money</p>
                    <p className="text-xs text-gray-600 mt-2">Format: 6XXXXXXXX</p>
                    {mobileOperator === 'orange' && (
                      <p className="text-xs text-orange-600 font-semibold mt-2">✓ Selected</p>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileOperator('mtn')}
                    disabled={isBelowMinimum}
                    className={`p-6 border-2 rounded-lg transition text-center ${
                      mobileOperator === 'mtn'
                        ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200'
                        : 'border-gray-300 hover:border-yellow-300 bg-white'
                    } ${isBelowMinimum ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                  >
                    <div className="text-4xl mb-3">🟡</div>
                    <p className="font-serif font-bold text-gray-900 text-lg">MTN MoMo</p>
                    <p className="text-xs text-gray-600 mt-2">Format: 67XXXXXXX</p>
                    {mobileOperator === 'mtn' && (
                      <p className="text-xs text-yellow-600 font-semibold mt-2">✓ Selected</p>
                    )}
                  </button>
                </div>
              </div>

              {/* Phone Number Input */}
              {mobileOperator && !isBelowMinimum && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label htmlFor="phone" className="block text-sm font-serif font-medium text-[#2a363b] mb-2">
                    {mobileOperator === 'orange' ? '🟠 Orange Money' : '🟡 MTN Mobile Money'} Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm font-semibold">
                      +237
                    </span>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder={mobileOperator === 'orange' ? "6XXXXXXXX" : "67XXXXXXX"}
                      className={`${inputStyle} pl-16 font-mono`}
                      maxLength={9}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Enter your {mobileOperator === 'orange' ? 'Orange Money' : 'MTN Mobile Money'} number without country code (+237)
                  </p>
                </div>
              )}

              {/* Delivery Information */}
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">
                  Delivery Information
                </h2>
                <div>
                  <label htmlFor="shipping_address" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                    Shipping Address (Optional)
                  </label>
                  <textarea 
                    id="shipping_address" 
                    name="shipping_address" 
                    value={formData.shipping_address} 
                    onChange={handleChange} 
                    rows={3} 
                    className={inputStyle} 
                    placeholder="Enter your delivery address: Street, City, Neighborhood..." 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 You can also arrange delivery details after payment
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#f3efe7] p-6 rounded-b-lg border-t border-[#dcd6c9]">
              <button 
                type="submit" 
                disabled={isProcessing || !mobileOperator || isBelowMinimum} 
                className="w-full py-3 bg-[#C06C54] text-white font-serif rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                {isProcessing ? 'Processing...' : 
                 isBelowMinimum ? `⚠️ Minimum ${MINIMUM_PAYMENT_AMOUNT} FCFA Required` :
                 !mobileOperator ? '📱 Select Mobile Money Operator' :
                 `Proceed to Payment - ${totalAmount.toFixed(0)} FCFA`}
              </button>
              {mobileOperator && !isBelowMinimum && (
                <p className="text-xs text-center text-gray-600 mt-3">
                  🔒 Secure payment via {mobileOperator === 'orange' ? 'Orange Money' : 'MTN Mobile Money'}
                </p>
              )}
            </div>
          </form>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#dcd6c9] p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">
                Order Summary
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {(item.price * item.quantity).toFixed(0)} FCFA
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#dcd6c9] mt-4 pt-4 font-serif">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{totalAmount.toFixed(0)} FCFA</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg border-t border-[#dcd6c9] pt-4">
                  <span className="font-bold">Total</span>
                  <span className={`font-bold ${isBelowMinimum ? 'text-red-600' : 'text-[#2a363b]'}`}>
                    {totalAmount.toFixed(0)} FCFA
                  </span>
                </div>
                {isBelowMinimum && (
                  <p className="text-xs text-red-600 text-center mt-2">
                    ⚠️ Minimum: {MINIMUM_PAYMENT_AMOUNT} FCFA
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;