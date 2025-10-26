// frontend/src/pages/MobilePaymentPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { paymentAPI, salesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

type PaymentStatus = 'initiating' | 'pending' | 'successful' | 'failed';

const MobilePaymentPage = ({ onClearCart }: { onClearCart?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    order_id, 
    amount, 
    phone_number, 
    operator,
    cart_items,
    shipping_address,
  } = location.state || {};
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('initiating');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [ussdCode, setUssdCode] = useState<string>('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [isCreatingSale, setIsCreatingSale] = useState(false);

  useEffect(() => {
    if (!order_id || !amount || !phone_number || !operator || !cart_items) {
      toast.error('Invalid payment information');
      navigate('/checkout');
      return;
    }

    initiatePayment();
  }, []);

  useEffect(() => {
    if (paymentStatus === 'pending' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (countdown === 0 && paymentStatus === 'pending') {
      setPaymentStatus('failed');
      toast.error('Payment timeout. Please try again.');
    }
  }, [paymentStatus, countdown]);

  useEffect(() => {
    if (paymentStatus === 'pending' && paymentReference) {
      const interval = setInterval(() => {
        checkStatus();
      }, 5000); // Vérifier toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [paymentStatus, paymentReference]);

  const initiatePayment = async () => {
    try {
      setPaymentStatus('initiating');

      const response = await paymentAPI.initiateMobilePayment({
        order_id,
        phone_number,
        amount: parseInt(amount),
        operator
      });

      if (response.data.success) {
        setPaymentReference(response.data.reference);
        setUssdCode(response.data.ussd_code);
        setPaymentStatus('pending');
        
        toast.success('Payment initiated! Please check your phone.', {
          duration: 5000,
        });
      } else {
        setPaymentStatus('failed');
        toast.error(response.data.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('failed');
      
      const message = error.response?.data?.message || 'Failed to initiate payment';
      toast.error(message);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await paymentAPI.checkPaymentStatus(paymentReference);

      if (response.data.status === 'SUCCESSFUL') {
        setPaymentStatus('successful');
        toast.success('Payment successful! Creating your order...', {
          duration: 3000,
        });
        
        // ✅ CRÉER LA VENTE MAINTENANT QUE LE PAIEMENT EST CONFIRMÉ
        await createSaleAfterPayment();
        
      } else if (response.data.status === 'FAILED') {
        setPaymentStatus('failed');
        toast.error('Payment failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  // ✅ CRÉER LA VENTE APRÈS CONFIRMATION DU PAIEMENT
  const createSaleAfterPayment = async () => {
    try {
      setIsCreatingSale(true);

      console.log('✅ Payment confirmed, creating sale...');
      console.log('Cart items:', cart_items);

      const orderData = {
        items: cart_items,
        payment_method: 'mobile_money',
        shipping_address: shipping_address || '',
        payment_reference: paymentReference,
        order_id: order_id
      };

      const response = await salesAPI.createBulk(orderData);

      if (response.data.sales?.length > 0) {
        toast.success('Order created successfully! 🎉');
        
        // Vider le panier
        if (onClearCart) {
          onClearCart();
        }
        localStorage.removeItem('pendingCheckout');
        
        // Rediriger vers la page de succès
        setTimeout(() => {
          navigate('/order-success', {
            state: {
              sales: response.data.sales,
              totalAmount: amount,
              payment_reference: paymentReference
            }
          });
        }, 2000);
      } else {
        throw new Error('No sales created');
      }

    } catch (error: any) {
      console.error('Error creating sale after payment:', error);
      toast.error('Payment successful but order creation failed. Please contact support with reference: ' + paymentReference, {
        duration: 10000,
      });
      setPaymentStatus('failed');
    } finally {
      setIsCreatingSale(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOperatorLogo = () => {
    return operator === 'orange' 
      ? '🟠 Orange Money' 
      : '🟡 MTN Mobile Money';
  };

  return (
    <div className="bg-[#f3efe7] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <button 
          onClick={() => navigate('/checkout')} 
          className="flex items-center gap-2 text-gray-600 hover:text-[#2a363b] mb-6 font-serif transition"
          disabled={isCreatingSale}
        >
          <ArrowLeft size={18} />
          Back to Checkout
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-[#dcd6c9]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C06C54]/10 rounded-full mb-4">
              <Smartphone size={32} className="text-[#C06C54]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2a363b] mb-2">
              Mobile Money Payment
            </h1>
            <p className="text-gray-600">{getOperatorLogo()}</p>
          </div>

          {/* Status */}
          {paymentStatus === 'initiating' && (
            <div className="text-center py-8">
              <Loader className="animate-spin h-12 w-12 text-[#C06C54] mx-auto mb-4" />
              <p className="text-lg font-serif text-gray-700">Initiating payment...</p>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="space-y-6">
              {/* Amount */}
              <div className="bg-[#f3efe7] rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 font-serif mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-[#2a363b]">
                  {parseInt(amount).toLocaleString()} FCFA
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-serif font-semibold text-gray-900 mb-3">
                  📱 How to Complete Payment:
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Check your phone for a payment notification</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Or dial: <strong className="text-[#C06C54]">{ussdCode}</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Enter your Mobile Money PIN to confirm</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Wait for confirmation (do not close this page)</span>
                  </li>
                </ol>
              </div>

              {/* Payment Details */}
              <div className="border border-[#dcd6c9] rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Number:</span>
                  <span className="font-semibold">{phone_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-xs">{paymentReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Remaining:</span>
                  <span className="font-semibold text-[#C06C54]">{formatTime(countdown)}</span>
                </div>
              </div>

              {/* Loading Animation */}
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Loader className="animate-spin h-5 w-5" />
                  <span className="font-serif">Waiting for payment confirmation...</span>
                </div>
              </div>

              {/* Manual Check Button */}
              <button
                onClick={checkStatus}
                className="w-full py-2 border border-[#C06C54] text-[#C06C54] rounded-md hover:bg-[#C06C54]/10 transition font-serif"
              >
                Check Payment Status
              </button>
            </div>
          )}

          {paymentStatus === 'successful' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                {isCreatingSale ? 'Creating Your Order...' : 'Payment Successful! 🎉'}
              </h2>
              <p className="text-gray-600 mb-6">
                {isCreatingSale ? 'Please wait while we process your order.' : 'Your order has been confirmed.'}
              </p>
              {isCreatingSale && (
                <Loader className="animate-spin h-8 w-8 text-[#C06C54] mx-auto mb-4" />
              )}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-700">
                  <strong>Reference:</strong> {paymentReference}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Amount Paid:</strong> {parseInt(amount).toLocaleString()} FCFA
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <XCircle size={48} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6">
                The payment could not be processed. Please try again.
              </p>
              <div className="space-y-3">
                <button
                  onClick={initiatePayment}
                  className="w-full py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 border border-[#dcd6c9] text-gray-700 rounded-md hover:bg-gray-50 transition font-serif"
                >
                  Back to Checkout
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Security Note */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600">
            🔒 <strong>Secure Payment</strong> - Your payment is processed securely by CamPay
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobilePaymentPage;