import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';
import React from 'react';

const ProfilManager = () => {
  const auth = useAuth();
  
  // Dans une vraie application, les données initiales viendraient de l'utilisateur connecté
  const [profileData, setProfileData] = useState({
    firstName: auth?.user?.firstName || '',
    lastName: auth?.user?.lastName || '',
    email: auth?.user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour mettre à jour le profil (appel API)
    console.log('Updating profile:', profileData);
    // Afficher une notification de succès
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Afficher une erreur
      console.error("New passwords don't match");
      return;
    }
    // Logique pour changer le mot de passe (appel API)
    console.log('Changing password...');
  };

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        {/* Section Informations Personnelles */}
        <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-[#dcd6c9]">
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#2a363b]">Personal Information</h2>
            <p className="text-sm text-gray-500 mt-1">Update your personal details here.</p>
          </div>
          <form onSubmit={handleProfileSubmit}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="firstName" 
                      id="firstName" 
                      value={profileData.firstName} 
                      onChange={handleProfileChange} 
                      className={`${inputStyle} pl-10`} 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    name="lastName" 
                    id="lastName" 
                    value={profileData.lastName} 
                    onChange={handleProfileChange} 
                    className={inputStyle} 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={profileData.email} 
                    onChange={handleProfileChange} 
                    className={`${inputStyle} pl-10`} 
                  />
                </div>
              </div>
            </div>
            <div className="bg-[#f3efe7] px-4 sm:px-6 py-3 sm:py-4 flex justify-end rounded-b-lg">
              <button 
                type="submit" 
                className="px-4 sm:px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Section Changement de Mot de Passe */}
        <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-[#dcd6c9]">
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#2a363b]">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    name="currentPassword" 
                    id="currentPassword" 
                    value={passwordData.currentPassword} 
                    onChange={handlePasswordChange} 
                    className={`${inputStyle} pl-10`} 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  New Password
                </label>
                <input 
                  type="password" 
                  name="newPassword" 
                  id="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                  className={inputStyle} 
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange} 
                  className={inputStyle} 
                />
              </div>
            </div>
            <div className="bg-[#f3efe7] px-4 sm:px-6 py-3 sm:py-4 flex justify-end rounded-b-lg">
              <button 
                type="submit" 
                className="px-4 sm:px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilManager;