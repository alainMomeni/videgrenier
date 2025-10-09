// frontend/src/pages/SignupPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [error, setError] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!auth?.signup) {
      setError('Authentication service unavailable');
      return;
    }
    
    try {
      await auth.signup({ firstName, lastName, email, password, userType });
      setShowEmailSent(true);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as any).response;
        setError(response?.data?.message || 'Failed to sign up. Please try again.');
      } else {
        setError('Failed to sign up. Please try again.');
      }
    }
  };

  if (showEmailSent) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-[#f3efe7] py-12 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-lg p-8"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2a363b] mb-2">
              Check Your Email!
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to <strong>{email}</strong>.
            </p>
            
            {/* Avertissement pour vérifier les spams */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-sm text-yellow-800 font-semibold mb-2">
                📧 Email not in your inbox?
              </p>
              <p className="text-xs text-yellow-700">
                Please check your <strong>Spam/Junk</strong> folder. 
                If you find it there, mark it as "Not Spam" to receive future emails in your inbox.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="block px-6 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif"
              >
                Go to Login
              </Link>
              <button
                onClick={() => setShowEmailSent(false)}
                className="block w-full px-6 py-3 border border-[#dcd6c9] text-gray-700 rounded-md hover:bg-[#e7e2d9] transition font-serif"
              >
                Back to Signup
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-[#f3efe7] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-lg p-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-[#2a363b]">
              Create an Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-serif">
              Join our community of sustainable fashion lovers.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="rounded-md space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="first-name" className="sr-only">First name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                    <input 
                      id="first-name" 
                      name="first-name" 
                      type="text" 
                      autoComplete="given-name" 
                      required 
                      className="w-full bg-white border border-[#dcd6c9] rounded-md py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm" 
                      placeholder="First name" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="last-name" className="sr-only">Last name</label>
                  <input 
                    id="last-name" 
                    name="last-name" 
                    type="text" 
                    autoComplete="family-name" 
                    required 
                    className="w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm" 
                    placeholder="Last name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    className="w-full bg-white border border-[#dcd6c9] rounded-md py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm" 
                    placeholder="Email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="user-type" className="sr-only">I am a</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                  <select
                    id="user-type"
                    name="user-type"
                    required
                    className="w-full bg-white border border-[#dcd6c9] rounded-md py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm appearance-none"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="buyer">I am a Buyer</option>
                    <option value="seller">I am a Seller</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    autoComplete="new-password" 
                    required 
                    className="w-full bg-white border border-[#dcd6c9] rounded-md py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                  <input 
                    id="confirm-password" 
                    name="confirm-password" 
                    type="password" 
                    autoComplete="new-password" 
                    required 
                    className="w-full bg-white border border-[#dcd6c9] rounded-md py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] focus:border-transparent sm:text-sm" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600 text-center font-serif">{error}</p>
              </div>
            )}

            <div>
              <button 
                type="submit" 
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#C06C54] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C06C54] transition-transform transform hover:-translate-y-0.5"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-serif text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#2a363b] hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignupPage;