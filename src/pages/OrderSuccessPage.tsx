// frontend/src/pages/OrderSuccessPage.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sales, totalAmount } = location.state || {};

  useEffect(() => {
    if (!sales || sales.length === 0) {
      navigate('/');
    }
  }, [sales, navigate]);

  if (!sales) return null;

  return (
    <div className="bg-[#f3efe7] min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg border border-[#dcd6c9] p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>

          <h1 className="text-3xl font-serif font-bold text-[#2a363b] mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>

          <div className="bg-[#f3efe7] rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="text-[#2a363b]" size={24} />
              <h2 className="text-xl font-serif font-bold text-[#2a363b]">
                Order Details
              </h2>
            </div>

            <div className="space-y-2">
              {sales.map((sale: any, index: number) => (
                <div key={index} className="text-sm">
                  <p className="font-semibold">Order #{sale.order_id}</p>
                </div>
              ))}
              <div className="border-t border-[#dcd6c9] pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span>${totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-[#dcd6c9] text-gray-700 rounded-md hover:bg-[#e7e2d9] transition font-serif"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;