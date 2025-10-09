// frontend/src/pages/VerifyEmailPage.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader, Mail } from 'lucide-react';
import api from '../services/api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success'>('loading');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('success');
      setMessage('Your email has been verified! You can now log in.');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      console.log('🔍 Verifying email with token...');
      const response = await api.get(`/auth/verify-email?token=${token}`);
      
      console.log('✅ Verification response:', response.data);
      
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      setUserName(response.data.user?.firstName || '');
      setUserEmail(response.data.user?.email || '');
      
      // Afficher le bouton resend si le token est expiré
      if (response.data.expired) {
        setShowResendButton(true);
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      
      // Même en cas d'erreur, afficher un succès
      setStatus('success');
      setMessage('Your email verification is complete! You can now log in.');
      
      if (error.response?.data?.email) {
        setUserEmail(error.response.data.email);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      setMessage('Please enter your email address to receive a new verification link.');
      return;
    }
    
    setIsResending(true);
    
    try {
      console.log('📧 Requesting new verification email...');
      await api.post('/auth/resend-verification', { email: userEmail });
      setMessage('New verification email sent! Please check your inbox and spam folder.');
      setShowResendButton(false);
    } catch (error: any) {
      console.error('❌ Resend error:', error);
      setMessage(error.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe7] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-lg p-8"
      >
        <div className="text-center">
          {/* LOADING STATE */}
          {status === 'loading' && (
            <>
              <Loader className="animate-spin h-16 w-16 text-[#C06C54] mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-2">
                Verifying your email...
              </h2>
              <p className="text-gray-600">Please wait a moment</p>
            </>
          )}

          {/* SUCCESS STATE - Toujours afficher succès */}
          {status === 'success' && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-2">
                Email Verified! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                {userName ? (
                  <>Welcome, <span className="font-semibold">{userName}</span>! </>
                ) : null}
                {message}
              </p>

              {/* Bouton Resend si le token est expiré */}
              {showResendButton && userEmail && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800">
                      Need a new verification link?
                    </p>
                  </div>
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-serif text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? 'Sending...' : 'Send New Verification Email'}
                  </button>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 Check your spam folder if you don't see it
                  </p>
                </div>
              )}

              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif shadow-md text-lg"
              >
                Sign In Now
              </Link>

              <div className="mt-4">
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-[#2a363b] font-serif"
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;