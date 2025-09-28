import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Trash2, Star, User, ChevronLeft, ChevronRight, Shield, AlertCircle } from 'lucide-react';


type ReviewRecord = {
  id: number;
  productId: number;
  productName: string;
  productCreator: string; // Le vendeur qui a créé le produit
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  reviewDate: string;
  status: 'approved' | 'pending' | 'rejected';
  helpful: number;
  verified: boolean;
};

type ReviewDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewRecord | null;
  onStatusChange: (reviewId: number, newStatus: 'approved' | 'pending' | 'rejected') => void;
};

// Modal pour voir les détails d'un avis
const ReviewDetailsModal = ({ isOpen, onClose, review, onStatusChange }: ReviewDetailsModalProps) => {
  const [localStatus, setLocalStatus] = useState(review?.status || 'pending');

  useEffect(() => {
    if (review) {
      setLocalStatus(review.status);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleStatusChange = () => {
    onStatusChange(review.id, localStatus);
    onClose();
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={20} 
        className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-[#fcfaf7] rounded-lg shadow-xl w-full max-w-3xl p-8 border border-[#dcd6c9] my-8"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-serif text-[#2a363b]">Review Details</h2>
          {review.verified && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              <Shield size={14} /> Verified Purchase
            </span>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Product Information */}
          <div className="bg-white p-4 rounded-lg border border-[#e7e2d9]">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Product Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-serif">Product Name</p>
                <p className="font-medium text-gray-900">{review.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-serif">Created by (Seller)</p>
                <p className="font-medium text-gray-900">{review.productCreator}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white p-4 rounded-lg border border-[#e7e2d9]">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-serif">Name</p>
                <p className="font-medium text-gray-900">{review.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-serif">Email</p>
                <p className="font-medium text-gray-900">{review.customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="bg-white p-4 rounded-lg border border-[#e7e2d9]">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Review Content</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-600">{review.rating}/5</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{review.title}</p>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
                <span>Posted on {new Date(review.reviewDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>{review.helpful} people found this helpful</span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white p-4 rounded-lg border border-[#e7e2d9]">
            <h3 className="font-serif font-semibold text-[#2a363b] mb-3">Review Status</h3>
            <div className="flex items-center gap-4">
              <select
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value as 'approved' | 'pending' | 'rejected')}
                className="flex-1 bg-white border border-[#dcd6c9] rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8]"
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleStatusChange}
                className="px-6 py-2 text-sm font-serif text-white bg-[#70816B] rounded-md hover:bg-opacity-90 transition"
              >
                Update Status
              </button>
            </div>
            {localStatus === 'rejected' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">
                  Rejected reviews will not be visible to customers on the product page.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-[#dcd6c9]">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-serif text-white bg-[#2a363b] rounded-md hover:bg-opacity-90 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const REVIEWS_PER_PAGE = 10;

const AdminReviews = () => {
  // Données factices des avis
  const initialReviews: ReviewRecord[] = [
    {
      id: 1,
      productId: 1,
      productName: 'Sac Classique Cuir Blanc',
      productCreator: 'Sarah Martinez',
      customerName: 'Marie Lambert',
      customerEmail: 'marie.lambert@email.com',
      rating: 5,
      title: 'Excellent quality!',
      comment: 'The leather quality is amazing, and the craftsmanship is top-notch. Very happy with my purchase!',
      reviewDate: '2024-01-28',
      status: 'approved',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      productId: 2,
      productName: 'Sneakers Montantes Bleues',
      productCreator: 'James Chen',
      customerName: 'Paul Martin',
      customerEmail: 'paul.martin@email.com',
      rating: 4,
      title: 'Great shoes, minor issue',
      comment: 'Love the style and comfort. Only issue is they run slightly small, order half size up.',
      reviewDate: '2024-01-27',
      status: 'pending',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      productId: 3,
      productName: 'T-shirt Uni Bleu Marine',
      productCreator: 'Sarah Martinez',
      customerName: 'Sophie Durand',
      customerEmail: 'sophie.durand@email.com',
      rating: 3,
      title: 'Average quality',
      comment: 'The fabric is okay but not as soft as expected. Color is nice though.',
      reviewDate: '2024-01-26',
      status: 'approved',
      helpful: 3,
      verified: false
    },
    {
      id: 4,
      productId: 4,
      productName: 'Veste en Cuir Aviateur',
      productCreator: 'Michael Brown',
      customerName: 'Lucas Bernard',
      customerEmail: 'lucas.bernard@email.com',
      rating: 5,
      title: 'Perfect vintage look!',
      comment: 'Exactly what I was looking for! Authentic vintage style with modern comfort.',
      reviewDate: '2024-01-25',
      status: 'approved',
      helpful: 20,
      verified: true
    },
    {
      id: 5,
      productId: 5,
      productName: 'Sandales en Cuir Sahara',
      productCreator: 'Emma Wilson',
      customerName: 'Claire Petit',
      customerEmail: 'claire.petit@email.com',
      rating: 2,
      title: 'Disappointed',
      comment: 'The straps broke after just two weeks of use. Not worth the price.',
      reviewDate: '2024-01-24',
      status: 'rejected',
      helpful: 1,
      verified: true
    }
  ];

  const [reviews, setReviews] = useState<ReviewRecord[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter(review => 
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productCreator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    return filtered;
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = useMemo(() => 
    filteredReviews.slice(
      (currentPage - 1) * REVIEWS_PER_PAGE,
      currentPage * REVIEWS_PER_PAGE
    ), [filteredReviews, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, ratingFilter]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (review: ReviewRecord) => {
    setSelectedReview(review);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = (reviewId: number, newStatus: 'approved' | 'pending' | 'rejected') => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: newStatus } : r
    ));
  };

  const handleDeleteReview = (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Stats
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">Manage and moderate customer reviews and ratings.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm">
          <p className="text-sm text-gray-500 font-serif">Total Reviews</p>
          <p className="text-3xl font-bold text-[#2a363b] mt-1">{reviews.length}</p>
        </div>
        <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm">
          <p className="text-sm text-gray-500 font-serif">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-3xl font-bold text-[#2a363b]">{averageRating}</p>
            <Star size={24} className="text-yellow-500 fill-yellow-500" />
          </div>
        </div>
        <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm">
          <p className="text-sm text-gray-500 font-serif">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm">
          <p className="text-sm text-gray-500 font-serif">Verified Reviews</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {reviews.filter(r => r.verified).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <label htmlFor="search-reviews" className="sr-only">Search Reviews</label>
          <input 
            id="search-reviews"
            type="text"
            placeholder="Search by product, customer, seller, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white border border-[#dcd6c9] rounded-md focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#dcd6c9] rounded-md py-2 px-4 focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="bg-white border border-[#dcd6c9] rounded-md py-2 px-4 focus:ring-2 focus:ring-[#c0b8a8] focus:outline-none"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-[#dcd6c9]">
          <thead className="bg-[#f3efe7]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Review
              </th>
              <th className="px-6 py-4 text-center text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-serif font-semibold text-[#2a363b] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e7e2d9]">
            {paginatedReviews.map(review => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{review.productName}</div>
                    {review.verified && (
                      <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <Shield size={12} /> Verified
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{review.productCreator}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{review.customerName}</div>
                    <div className="text-xs text-gray-500">{review.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center">
                    {renderStars(review.rating)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-semibold text-gray-900 truncate">{review.title}</p>
                    <p className="text-xs text-gray-600 truncate mt-1">{review.comment}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(review.status)}`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleViewDetails(review)}
                      className="p-2 text-gray-500 hover:bg-[#e7e2d9] rounded-md transition"
                      title="View Details"
                    >
                      <Eye size={16}/>
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-md transition"
                      title="Delete Review"
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

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
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
        </div>
      )}

      <ReviewDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        review={selectedReview}
        onStatusChange={handleStatusChange}
      />
    </motion.div>
  );
};

export default AdminReviews;