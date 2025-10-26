// frontend/src/pages/ProfilManager.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import React from 'react';

const ProfilManager = () => {
  const auth = useAuth();
  const user = auth?.user;
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Charger les données de l'utilisateur au montage
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error('User not found. Please log in again.');
      return;
    }

    // Validation
    if (!profileData.firstName.trim() || !profileData.lastName.trim() || !profileData.email.trim()) {
      toast.error('All fields are required');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast.error('Invalid email format');
      return;
    }

    setIsUpdatingProfile(true);

    try {
      console.log('📝 Updating profile...');

      const response = await userAPI.update(user.id, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        role: user.role,
      });

      console.log('✅ Profile updated successfully');

      // Mettre à jour le contexte utilisateur
      const updatedUser = {
        ...user,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (auth?.setUser) {
        auth.setUser(updatedUser);
      }

      toast.success('Profile updated successfully!', {
        duration: 3000,
        icon: '✅',
      });
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error('User not found. Please log in again.');
      return;
    }

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      console.log('🔐 Updating password...');

      await userAPI.updatePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      console.log('✅ Password updated successfully');

      // Réinitialiser le formulaire
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success('Password updated successfully!', {
        duration: 3000,
        icon: '🔐',
      });
    } catch (error: any) {
      console.error('❌ Error updating password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";

  return (
    <div className="bg-[#f3efe7] min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b]">
              Manage Your Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Keep your personal and security information up to date.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-10">
            {/* Section Informations Personnelles */}
            <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-[#dcd6c9]">
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#2a363b]">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your personal details below.
                </p>
              </div>
              <form onSubmit={handleProfileSubmit}>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          name="firstName" 
                          id="firstName" 
                          value={profileData.firstName} 
                          onChange={handleProfileChange} 
                          placeholder="John"
                          className={`${inputStyle} pl-10`}
                          disabled={isUpdatingProfile}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                        Last Name *
                      </label>
                      <input 
                        type="text" 
                        name="lastName" 
                        id="lastName" 
                        value={profileData.lastName} 
                        onChange={handleProfileChange} 
                        placeholder="Doe"
                        className={inputStyle}
                        disabled={isUpdatingProfile}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={profileData.email} 
                        onChange={handleProfileChange} 
                        placeholder="john.doe@example.com"
                        className={`${inputStyle} pl-10`}
                        disabled={isUpdatingProfile}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Info sur le rôle */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">
                          Account Role: <span className="font-semibold capitalize">{user?.role || 'N/A'}</span>
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Contact support to change your account role.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f3efe7] px-4 sm:px-6 py-3 sm:py-4 flex justify-end rounded-b-lg">
                  <button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                    className="px-4 sm:px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Section Changement de Mot de Passe */}
            <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-[#dcd6c9]">
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#2a363b]">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ensure your account is using a long, random password to stay secure.
                </p>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                      <input 
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword" 
                        id="currentPassword" 
                        value={passwordData.currentPassword} 
                        onChange={handlePasswordChange} 
                        placeholder="Enter current password"
                        className={`${inputStyle} pl-10 pr-10`}
                        disabled={isUpdatingPassword}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input 
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword" 
                        id="newPassword" 
                        value={passwordData.newPassword} 
                        onChange={handlePasswordChange} 
                        placeholder="Enter new password (min. 6 characters)"
                        className={`${inputStyle} pr-10`}
                        disabled={isUpdatingPassword}
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input 
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword" 
                        id="confirmPassword" 
                        value={passwordData.confirmPassword} 
                        onChange={handlePasswordChange} 
                        placeholder="Confirm new password"
                        className={`${inputStyle} pr-10`}
                        disabled={isUpdatingPassword}
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Info sécurité */}
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">
                          Password Security Tips
                        </p>
                        <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
                          <li>Use at least 6 characters</li>
                          <li>Mix uppercase and lowercase letters</li>
                          <li>Include numbers and special characters</li>
                          <li>Avoid common words or personal information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f3efe7] px-4 sm:px-6 py-3 sm:py-4 flex justify-end rounded-b-lg">
                  <button 
                    type="submit" 
                    disabled={isUpdatingPassword}
                    className="px-4 sm:px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilManager;