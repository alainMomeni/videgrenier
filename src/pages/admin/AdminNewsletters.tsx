// frontend/src/pages/admin/AdminNewsletters.tsx
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Mail, RefreshCw, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { newsletterAPI } from '../../services/api';
import toast from 'react-hot-toast';

type Newsletter = {
  id_newsletter: number;
  email: string;
  subscribedAt: string;
  isActive: boolean;
};

const NEWSLETTERS_PER_PAGE = 15;

const AdminNewsletters = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [stats, setStats] = useState({ total: 0, lastMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchNewsletters();
    fetchStats();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getAll();
      setNewsletters(response.data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast.error('Failed to load newsletter subscribers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await newsletterAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredNewsletters = useMemo(() => {
    let filtered = newsletters.filter(newsletter => 
      newsletter.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter === 'active') {
      filtered = filtered.filter(n => n.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(n => !n.isActive);
    }

    return filtered;
  }, [newsletters, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredNewsletters.length / NEWSLETTERS_PER_PAGE);
  const paginatedNewsletters = useMemo(() => 
    filteredNewsletters.slice(
      (currentPage - 1) * NEWSLETTERS_PER_PAGE,
      currentPage * NEWSLETTERS_PER_PAGE
    ), [filteredNewsletters, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleDelete = async (id: number, permanent: boolean = false) => {
    const message = permanent 
      ? 'Are you sure you want to permanently delete this subscriber?' 
      : 'Are you sure you want to unsubscribe this email?';
    
    if (window.confirm(message)) {
      try {
        await newsletterAPI.unsubscribe(id, permanent);
        toast.success(permanent ? 'Subscriber deleted' : 'Subscriber unsubscribed');
        fetchNewsletters();
        fetchStats();
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        toast.error('Failed to remove subscriber');
      }
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await newsletterAPI.reactivate(id);
      toast.success('Subscriber reactivated');
      fetchNewsletters();
      fetchStats();
    } catch (error) {
      console.error('Error reactivating subscriber:', error);
      toast.error('Failed to reactivate subscriber');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading newsletter subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Newsletter Subscribers</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your newsletter email list.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-serif">Total Subscribers</p>
              <p className="text-3xl font-bold text-[#2a363b] mt-1">{stats.total}</p>
            </div>
            <Mail className="text-[#2a363b] opacity-20" size={48} />
          </div>
        </div>
        <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-serif">New This Month</p>
              <p className="text-3xl font-bold text-[#2a363b] mt-1">{stats.lastMonth}</p>
            </div>
            <CheckCircle className="text-green-600 opacity-20" size={48} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-white border border-[#dcd6c9] rounded-md py-2 px-4 focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#dcd6c9]">
            <thead className="bg-[#f3efe7]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase hidden sm:table-cell">Subscribed At</th>
                <th className="px-4 py-3 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e7e2d9]">
              {paginatedNewsletters.map(newsletter => (
                <tr key={newsletter.id_newsletter} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{newsletter.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                    {new Date(newsletter.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      newsletter.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {newsletter.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {!newsletter.isActive && (
                        <button 
                          onClick={() => handleReactivate(newsletter.id_newsletter)}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition"
                          title="Reactivate"
                        >
                          <RefreshCw size={16}/>
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(newsletter.id_newsletter, false)}
                        className="p-1.5 text-orange-600 hover:bg-orange-100 rounded-md transition"
                        title="Unsubscribe"
                      >
                        <XCircle size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(newsletter.id_newsletter, true)}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition"
                        title="Delete permanently"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      )}
    </motion.div>
  );
};

export default AdminNewsletters;