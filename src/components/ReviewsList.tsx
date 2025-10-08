// frontend/src/components/ReviewsList.tsx
import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { reviewAPI } from '../services/api';
import toast from 'react-hot-toast';

type Review = {
  id_review: number;
  customer_name: string;
  rating: number;
  title?: string;
  comment?: string;
  review_date: string;
  helpful: number;
  verified: boolean;
};

type ReviewsListProps = {
  productId: number;
};

const ReviewsList = ({ productId }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getAll({ productId, status: 'approved' });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewAPI.getStats(productId);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      await reviewAPI.markHelpful(reviewId);
      fetchReviews();
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to mark as helpful');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  const averageRating = stats?.average_rating ? parseFloat(stats.average_rating).toFixed(1) : '0.0';
  const totalReviews = stats?.total_reviews || 0;

  return (
    <div className="space-y-6">
      {/* Stats globales */}
      {totalReviews > 0 && (
        <div className="bg-[#f3efe7] rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <div className="text-4xl font-bold text-[#2a363b]">{averageRating}</div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={`${
                      star <= Math.round(parseFloat(averageRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats?.[`${['one', 'two', 'three', 'four', 'five'][rating - 1]}_star`] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id_review} className="bg-white rounded-lg border border-[#dcd6c9] p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{review.customer_name}</span>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
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
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.review_date).toLocaleDateString()}
                </span>
              </div>

              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              )}

              {review.comment && (
                <p className="text-gray-700 mb-3">{review.comment}</p>
              )}

              <button
                onClick={() => handleMarkHelpful(review.id_review)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#C06C54] transition"
              >
                <ThumbsUp size={16} />
                Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;