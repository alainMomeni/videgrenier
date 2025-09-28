// src/pages/admin/AdminUsers.tsx

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { allUsers as initialUsers, type User } from '../../data/users';
import React from 'react';

// Le modal reste nécessaire pour ajouter/éditer, vous pouvez garder son code ici
type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
  user: User | null;
};

const UserModal = ({ isOpen, onClose, onSave, user }: UserModalProps) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: 'buyer' });

  useEffect(() => {
    if (user) {
      setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
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
    onSave(formData as any);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8]";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-lg p-8 border border-[#dcd6c9]">
        <h2 className="text-2xl font-serif text-[#2a363b] mb-6">{user ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">First Name</label>
              <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} className={inputStyle} required/>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Last Name</label>
              <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className={inputStyle} required/>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputStyle} required/>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Role</label>
            <select name="role" id="role" value={formData.role} onChange={handleChange} className={inputStyle + " appearance-none"} required>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-[#dcd6c9]">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-serif text-gray-700 bg-white border border-[#dcd6c9] rounded-md hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition">Save User</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};


const USERS_PER_PAGE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSaveUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
    } else {
      const newUser: User = { ...userData, id: Date.now(), createdAt: new Date().toISOString() };
      setUsers([...users, newUser]);
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const firstItemIndex = (currentPage - 1) * USERS_PER_PAGE + 1;
  const lastItemIndex = Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length);
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Manage Users</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove users from your platform.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-[#2a363b] text-white rounded-md hover:bg-opacity-90 transition font-serif">
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="search-users" className="sr-only">Search Users</label>
        <input id="search-users" type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"/>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-[#dcd6c9]">
          <thead className="bg-[#f3efe7]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Date Joined</th>
              <th className="px-6 py-4 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e7e2d9]">
            {paginatedUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-[#e7e2d9] rounded-full flex items-center justify-center">
                      <UserIcon size={20} className="text-[#2a363b]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'seller' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(user)} className="p-2 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"><Edit size={16}/></button>
                    {user.role !== 'admin' && (
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition"><Trash2 size={16}/></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredUsers.length > 0 ? firstItemIndex : 0}</span>-
          <span className="font-semibold">{lastItemIndex}</span> of{' '}
          <span className="font-semibold">{filteredUsers.length}</span> users
        </p>
        
        {totalPages > 1 && (
          <nav className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"><ChevronLeft size={20} /></button>
            <span className="text-sm text-gray-700">Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span></span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"><ChevronRight size={20} /></button>
          </nav>
        )}
      </div>

      <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} user={editingUser} />
    </motion.div>
  );
};

export default AdminUsers;