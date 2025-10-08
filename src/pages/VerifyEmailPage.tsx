// frontend/src/pages/VerifyEmailPage.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../services/api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      setStatus('success');
      setMessage(response.data.message);
      setUserName(response.data.user?.firstName || '');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe7] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-lg p-8"
      >
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader className="animate-spin h-16 w-16 text-[#C06C54] mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-2">
                Verifying your email...
              </h2>
              <p className="text-gray-600">Please wait a moment</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-6">
                {userName && `Welcome, ${userName}! `}
                Your email has been successfully verified.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif"
              >
                Sign In Now
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="block px-6 py-3 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif"
                >
                  Create New Account
                </Link>
                <Link
                  to="/login"
                  className="block px-6 py-3 border border-[#dcd6c9] text-gray-700 rounded-md hover:bg-[#e7e2d9] transition font-serif"
                >
                  Back to Login
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