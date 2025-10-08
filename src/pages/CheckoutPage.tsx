// frontend/src/pages/CheckoutPage.tsx

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Smartphone, DollarSign, ArrowLeft, ShoppingBag } from 'lucide-react';
import { salesAPI } from '../services/api';
import toast from 'react-hot-toast';
import React from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const CheckoutPage = ({ onClearCart }: { onClearCart: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cartItems || [];
  
  const [formData, setFormData] = useState({
    buyer_name: '', buyer_email: '', phone: '', shipping_address: '', payment_method: 'card' as 'card' | 'paypal' | 'mobile_money'
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    try {
      setIsProcessing(true);
      const orderData = { items: cartItems.map(item => ({ id_produit: item.id, quantity: item.quantity })), buyer_name: formData.buyer_name, buyer_email: formData.buyer_email, payment_method: formData.payment_method, shipping_address: formData.shipping_address };
      const response = await salesAPI.createBulk(orderData);

      if (response.data.errors?.length > 0) {
        const errorMessages = response.data.errors.map((err: any) => `${err.nom_produit || 'Product'}: ${err.error}`).join(', ');
        toast.error(`Some items failed: ${errorMessages}`, { duration: 5000 });
      }

      if (response.data.sales?.length > 0) {
        toast.success('Order placed successfully!');
        onClearCart();
        navigate('/order-success', { state: { sales: response.data.sales, totalAmount } });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to process order. Please try again.';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

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

  return (
    <div className="bg-[#f3efe7] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-600 hover:text-[#2a363b] mb-6 font-serif transition">
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#fcfaf7] rounded-lg border border-[#dcd6c9] shadow-sm">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="buyer_name" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Full Name *</label>
                    <input type="text" id="buyer_name" name="buyer_name" value={formData.buyer_name} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="buyer_email" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Email *</label>
                      <input type="email" id="buyer_email" name="buyer_email" value={formData.buyer_email} onChange={handleChange} className={inputStyle} required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Phone Number</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">Shipping Address</h2>
                <textarea id="shipping_address" name="shipping_address" value={formData.shipping_address} onChange={handleChange} rows={3} className={inputStyle} placeholder="123 Vintage Lane, Fashion City, 12345..." />
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, payment_method: 'card' }))} className={`flex items-center justify-center gap-2 p-4 border-2 rounded-md transition ${formData.payment_method === 'card' ? 'border-[#C06C54] bg-[#C06C54]/10' : 'border-[#dcd6c9] hover:border-[#c0b8a8]'}`}>
                    <CreditCard size={20} /> <span className="font-serif">Card</span>
                  </button>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, payment_method: 'paypal' }))} className={`flex items-center justify-center gap-2 p-4 border-2 rounded-md transition ${formData.payment_method === 'paypal' ? 'border-[#C06C54] bg-[#C06C54]/10' : 'border-[#dcd6c9] hover:border-[#c0b8a8]'}`}>
                    <DollarSign size={20} /> <span className="font-serif">PayPal</span>
                  </button>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, payment_method: 'mobile_money' }))} className={`flex items-center justify-center gap-2 p-4 border-2 rounded-md transition ${formData.payment_method === 'mobile_money' ? 'border-[#C06C54] bg-[#C06C54]/10' : 'border-[#dcd6c9] hover:border-[#c0b8a8]'}`}>
                    <Smartphone size={20} /> <span className="font-serif">Mobile Money</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#f3efe7] p-6 rounded-b-lg border-t border-[#dcd6c9]">
              <button type="submit" disabled={isProcessing} className="w-full py-3 bg-[#C06C54] text-white font-serif rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                {isProcessing ? 'Processing...' : `Place Order - $${totalAmount.toFixed(2)}`}
              </button>
            </div>
          </form>
          
          {/* Résumé commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#dcd6c9] p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#dcd6c9] mt-4 pt-4 font-serif">
                <div className="flex justify-between mb-2 text-sm"><span className="text-gray-600">Subtotal</span><span className="font-semibold">${totalAmount.toFixed(2)}</span></div>
                <div className="flex justify-between mb-4 text-sm"><span className="text-gray-600">Shipping</span><span className="font-semibold text-green-600">Free</span></div>
                <div className="flex justify-between text-lg border-t border-[#dcd6c9] pt-4"><span className="font-bold">Total</span><span className="font-bold text-[#2a363b]">${totalAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;