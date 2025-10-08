// frontend/src/pages/admin/AdminReviews.tsx
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

type Review = {
  id_review: number;
  id_produit: number;
  nom_produit: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title?: string;
  comment?: string;
  review_date: string;
  status: 'approved' | 'pending' | 'rejected';
  helpful: number;
  verified: boolean;
};

const REVIEWS_PER_PAGE = 10;

const AdminReviews = () => {
  const auth = useAuth();
  const user = auth?.user;
  const isAdmin = user?.role === 'admin';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [user?.id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Si seller, filtrer par ses produits uniquement
      const params = isAdmin 
        ? {} 
        : { sellerId: user?.id };
      
      const response = await reviewAPI.getAll(params);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter((review: Review) =>
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.nom_produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r: Review) => r.status === statusFilter);
    }

    return filtered;
  }, [reviews, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = useMemo(() =>
    filteredReviews.slice(
      (currentPage - 1) * REVIEWS_PER_PAGE,
      currentPage * REVIEWS_PER_PAGE
    ), [filteredReviews, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await reviewAPI.updateStatus(id, status);
      toast.success(`Review ${status} successfully`);
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.delete(id);
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">
          {isAdmin ? 'Customer Reviews' : 'My Product Reviews'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {isAdmin 
            ? 'Manage and moderate customer reviews.' 
            : 'View and manage reviews for your products.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg p-4">
          <p className="text-sm text-gray-500 font-serif">Total Reviews</p>
          <p className="text-2xl font-bold text-[#2a363b] mt-1">{reviews.length}</p>
        </div>
        <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg p-4">
          <p className="text-sm text-gray-500 font-serif">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {reviews.filter((r: Review) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg p-4">
          <p className="text-sm text-gray-500 font-serif">Average Rating</p>
          <p className="text-2xl font-bold text-[#2a363b] mt-1">
            {reviews.length > 0
              ? (reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '0.0'}
            <Star className="inline ml-1 mb-1 fill-yellow-400 text-yellow-400" size={20} />
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search reviews..."
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
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-[#dcd6c9]">
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          paginatedReviews.map((review: Review) => (
            <div key={review.id_review} className="bg-white rounded-lg border border-[#dcd6c9] p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{review.customer_name}</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.review_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Product: <span className="font-semibold">{review.nom_produit}</span>
                  </p>
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#dcd6c9]">
                <span className="text-sm text-gray-500">
                  {review.helpful} people found this helpful
                </span>
                <div className="flex gap-2">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(review.id_review, 'approved')}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-md transition"
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(review.id_review, 'rejected')}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition"
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id_review)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-md transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e7e2d9] rounded-md transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
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

export default AdminReviews;