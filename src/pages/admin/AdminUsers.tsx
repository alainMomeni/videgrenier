// frontend/src/pages/admin/AdminUsers.tsx
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, User as UserIcon, ChevronLeft, ChevronRight, Ban, ShieldCheck } from 'lucide-react';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';
import React from 'react';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string;
  isBlocked?: boolean;
};

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
  user: User | null;
};

const UserModal = ({ isOpen, onClose, onSave, user }: UserModalProps) => {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    role: 'buyer' as 'buyer' | 'seller' | 'admin'
  });

  useEffect(() => {
    if (user) {
      setFormData({ 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        role: user.role 
      });
    } else {
      setFormData({ firstName: '', lastName: '', email: '', role: 'buyer' });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 border border-[#dcd6c9] my-8"
      >
        <h2 className="text-xl sm:text-2xl font-serif text-[#2a363b] mb-6">
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                First Name
              </label>
              <input 
                type="text" 
                name="firstName" 
                id="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                className={inputStyle} 
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
                Last Name
              </label>
              <input 
                type="text" 
                name="lastName" 
                id="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                className={inputStyle} 
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
              Email
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={inputStyle} 
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">
              Role
            </label>
            <select 
              name="role" 
              id="role" 
              value={formData.role} 
              onChange={handleChange} 
              className={inputStyle + " appearance-none"} 
              required
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-[#dcd6c9]">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 sm:px-6 py-2 text-sm font-serif text-gray-700 bg-white border border-[#dcd6c9] rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 sm:px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition"
            >
              Save User
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const USERS_PER_PAGE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]);
  
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = useMemo(() => 
    filteredUsers.slice(
      (currentPage - 1) * USERS_PER_PAGE,
      currentPage * USERS_PER_PAGE
    ), [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      if (editingUser) {
        // Mise à jour
        await userAPI.update(editingUser.id, {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          role: userData.role
        });
        toast.success('User updated successfully');
      } else {
        // Note: La création d'utilisateur passe normalement par /api/auth/register
        // Vous pouvez soit ajouter une route spéciale pour les admins, soit rediriger vers signup
        toast.error('User creation not implemented. Please use the signup page.');
        return;
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      try {
        await userAPI.delete(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await userAPI.toggleBlock(userId);
      const updatedUser = response.data;
      
      toast.success(
        updatedUser.isBlocked 
          ? 'User blocked successfully' 
          : 'User unblocked successfully'
      );
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error toggling user block:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user status';
      toast.error(errorMessage);
    }
  };

  const firstItemIndex = (currentPage - 1) * USERS_PER_PAGE + 1;
  const lastItemIndex = Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Manage Users</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View, edit, or remove users from your platform.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif text-sm"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="search-users" className="sr-only">Search Users</label>
        <input 
          id="search-users" 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#dcd6c9]">
            <thead className="bg-[#f3efe7]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider hidden sm:table-cell">
                  Date Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e7e2d9]">
              {paginatedUsers.map(user => (
                <tr key={user.id} className={`hover:bg-gray-50 ${user.isBlocked ? 'opacity-60 bg-red-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        user.isBlocked ? 'bg-red-100' : 'bg-[#e7e2d9]'
                      }`}>
                        {user.isBlocked ? (
                          <Ban size={20} className="text-red-600" />
                        ) : (
                          <UserIcon size={20} className="text-[#2a363b]" />
                        )}
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.isBlocked && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                              Blocked
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-500 sm:hidden mt-1">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'seller' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenModal(user)} 
                        className="p-1.5 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"
                        title="Edit user"
                      >
                        <Edit size={16}/>
                      </button>
                      {user.role !== 'admin' && (
                        <>
                          <button 
                            onClick={() => handleBlockUser(user.id)} 
                            className={`p-1.5 rounded-md transition ${
                              user.isBlocked 
                                ? 'text-green-600 hover:bg-green-100' 
                                : 'text-orange-600 hover:bg-orange-100'
                            }`}
                            title={user.isBlocked ? 'Unblock user' : 'Block user'}
                          >
                            {user.isBlocked ? <ShieldCheck size={16}/> : <Ban size={16}/>}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)} 
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition"
                            title="Delete user"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredUsers.length > 0 ? firstItemIndex : 0}</span>-
          <span className="font-semibold">{lastItemIndex}</span> of{' '}
          <span className="font-semibold">{filteredUsers.length}</span> users
        </p>
        
        {totalPages > 1 && (
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        )}
      </div>

      <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} user={editingUser} />
    </motion.div>
  );
};

export default AdminUsers;