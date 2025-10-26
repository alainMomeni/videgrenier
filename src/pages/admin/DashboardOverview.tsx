// frontend/src/pages/admin/DashboardOverview.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Package, 
  Star,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productAPI, salesAPI, userAPI, reviewAPI } from '../../services/api';
import { Link } from 'react-router-dom';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: string;
};

const StatCard = ({ title, value, icon, trend, trendLabel, color = 'bg-[#2a363b]' }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg border border-[#dcd6c9] p-6 shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-serif mb-1">{title}</p>
        <p className="text-3xl font-bold text-[#2a363b] mb-2">{value}</p>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {trend >= 0 ? (
              <ArrowUpRight className="text-green-600" size={16} />
            ) : (
              <ArrowDownRight className="text-red-600" size={16} />
            )}
            <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend)}%
            </span>
            {trendLabel && <span className="text-sm text-gray-500">{trendLabel}</span>}
          </div>
        )}
      </div>
      <div className={`${color} text-white p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

type RecentSale = {
  id_sale: number;
  order_id: string;
  buyer_name: string;
  total_amount: number;
  sale_date: string;
  status: string;
  nom_produit?: string;
};

type Product = {
  id_produit: number;
  nom_produit: string;
  prix: number;
  quantite: number;
  photo: string;
  categorie: string;
};

type Sale = {
  id_sale: number;
  order_id: string;
  buyer_name: string;
  total_amount: number;
  sale_date: string;
  status: string;
  nom_produit?: string;
  id_produit: number;
  id_seller: number;
  buyer_email: string;
  quantity: number;
  unit_price: number;
  payment_method: string;
};

type Review = {
  id_review: number;
  id_produit: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  title?: string;
  comment?: string;
  review_date: string;
  status: string;
  helpful: number;
  verified: boolean;
};

const DashboardOverview = () => {
  const auth = useAuth();
  const user = auth?.user;
  const isAdmin = user?.role === 'admin';
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalUsers: 0,
    averageRating: 0,
    pendingReviews: 0,
    lowStockProducts: 0,
    recentSalesCount: 0
  });
  
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id, isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      console.log('🔍 Fetching dashboard data...');
      console.log('📍 User ID:', user?.id);
      console.log('👤 Is Admin:', isAdmin);

      // ✅ Fetch products - FILTRE PAR UTILISATEUR SI PAS ADMIN
      const productsResponse = isAdmin 
        ? await productAPI.getAll()
        : await productAPI.getAll(user?.id);
      
      const products: Product[] = productsResponse.data;
      console.log('📦 Products loaded:', products.length);

      // ✅ Fetch sales - FILTRE PAR UTILISATEUR SI PAS ADMIN
      const salesResponse = isAdmin 
        ? await salesAPI.getAll()
        : await salesAPI.getAll(user?.id);
      
      const sales: Sale[] = salesResponse.data;
      console.log('💰 Sales loaded:', sales.length);

      // Calculate stats
      const totalRevenue = sales.reduce((sum: number, sale: Sale) => sum + sale.total_amount, 0);
      const lowStockProducts = products.filter((p: Product) => p.quantite > 0 && p.quantite <= 5).length;

      // Get recent sales (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentSalesData = sales.filter((sale: Sale) => 
        new Date(sale.sale_date) >= sevenDaysAgo
      );

      // Sort sales by date and take last 5
      const sortedSales = sales
        .sort((a: Sale, b: Sale) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())
        .slice(0, 5);

      setRecentSales(sortedSales);

      // Get top products (sort by quantity sold - approximation)
      const topProds = products
        .filter((p: Product) => p.quantite > 0)
        .sort((a: Product, b: Product) => b.quantite - a.quantite)
        .slice(0, 4);
      
      setTopProducts(topProds);

      // Admin-only stats
      let totalUsers = 0;
      let averageRating = 0;
      let pendingReviews = 0;

      if (isAdmin) {
        const usersResponse = await userAPI.getAll();
        totalUsers = usersResponse.data.length;

        const reviewsResponse = await reviewAPI.getAll();
        const reviews: Review[] = reviewsResponse.data;
        
        if (reviews.length > 0) {
          averageRating = reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length;
        }
        
        pendingReviews = reviews.filter((r: Review) => r.status === 'pending').length;
      }

      setStats({
        totalProducts: products.length,
        totalSales: sales.length,
        totalRevenue,
        totalUsers,
        averageRating,
        pendingReviews,
        lowStockProducts,
        recentSalesCount: recentSalesData.length
      });

      console.log('✅ Dashboard data loaded successfully');

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a363b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Here's what's happening with your {isAdmin ? 'platform' : 'store'} today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={isAdmin ? "Total Products" : "My Products"}
          value={stats.totalProducts}
          icon={<ShoppingBag size={24} />}
          color="bg-blue-600"
        />
        
        <StatCard
          title={isAdmin ? "Total Sales" : "My Sales"}
          value={stats.totalSales}
          icon={<TrendingUp size={24} />}
          trend={stats.recentSalesCount > 0 ? 12 : 0}
          trendLabel="vs last week"
          color="bg-green-600"
        />
        
        <StatCard
          title={isAdmin ? "Total Revenue" : "My Revenue"}
          value={`${stats.totalRevenue.toFixed(0)} FCFA`}
          icon={<DollarSign size={24} />}
          trend={stats.totalRevenue > 0 ? 8 : 0}
          trendLabel="vs last month"
          color="bg-purple-600"
        />

        {isAdmin ? (
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users size={24} />}
            color="bg-orange-600"
          />
        ) : (
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockProducts}
            icon={<AlertCircle size={24} />}
            color="bg-red-600"
          />
        )}
      </div>

      {/* Secondary Stats (Admin Only) */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            icon={<Star size={24} />}
            color="bg-yellow-500"
          />
          
          <StatCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            icon={<Star size={24} />}
            color="bg-indigo-600"
          />
          
          <StatCard
            title="Low Stock Alerts"
            value={stats.lowStockProducts}
            icon={<Package size={24} />}
            color="bg-red-600"
          />
        </div>
      )}

      {/* Recent Sales & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg border border-[#dcd6c9] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-[#2a363b]">Recent Sales</h2>
            <Link 
              to={isAdmin ? "/admin/sales" : "/admin/my-sales"}
              className="text-sm text-[#C06C54] hover:underline font-serif"
            >
              View All
            </Link>
          </div>
          
          {recentSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent sales</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSales.map((sale: RecentSale) => (
                <div key={sale.id_sale} className="flex items-center justify-between py-3 border-b border-[#e7e2d9] last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm"></p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {sale.nom_produit || `Order #${sale.order_id.slice(0, 12)}...`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2a363b]">
                      {sale.total_amount.toFixed(0)} FCFA
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-700' :
                      sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-[#dcd6c9] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-[#2a363b]">
              {isAdmin ? "Top Products" : "My Products"}
            </h2>
            <Link 
              to={isAdmin ? "/admin/products" : "/admin/my-products"}
              className="text-sm text-[#C06C54] hover:underline font-serif"
            >
              View All
            </Link>
          </div>
          
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No products available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product: Product) => (
                <div key={product.id_produit} className="flex items-center gap-4 py-3 border-b border-[#e7e2d9] last:border-0">
                  <img 
                    src={product.photo} 
                    alt={product.nom_produit}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/placeholder-product.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{product.nom_produit}</p>
                    <p className="text-xs text-gray-500">{product.categorie}</p>
                    <p className="text-xs text-gray-400">Stock: {product.quantite}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2a363b]">
                      {product.prix.toFixed(0)} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-[#dcd6c9] p-6">
        <h2 className="text-xl font-serif font-bold text-[#2a363b] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to={isAdmin ? "/admin/products" : "/admin/my-products"}
            className="flex flex-col items-center justify-center p-4 border-2 border-[#dcd6c9] rounded-lg hover:border-[#C06C54] hover:bg-[#f3efe7] transition"
          >
            <ShoppingBag className="text-[#2a363b] mb-2" size={32} />
            <span className="text-sm font-serif text-center">Manage Products</span>
          </Link>
          
          <Link
            to={isAdmin ? "/admin/sales" : "/admin/my-sales"}
            className="flex flex-col items-center justify-center p-4 border-2 border-[#dcd6c9] rounded-lg hover:border-[#C06C54] hover:bg-[#f3efe7] transition"
          >
            <TrendingUp className="text-[#2a363b] mb-2" size={32} />
            <span className="text-sm font-serif text-center">View Sales</span>
          </Link>
          
          <Link
            to={isAdmin ? "/admin/stock" : "/admin/my-stock"}
            className="flex flex-col items-center justify-center p-4 border-2 border-[#dcd6c9] rounded-lg hover:border-[#C06C54] hover:bg-[#f3efe7] transition"
          >
            <Package className="text-[#2a363b] mb-2" size={32} />
            <span className="text-sm font-serif text-center">Stock Management</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/reviews"
              className="flex flex-col items-center justify-center p-4 border-2 border-[#dcd6c9] rounded-lg hover:border-[#C06C54] hover:bg-[#f3efe7] transition"
            >
              <Star className="text-[#2a363b] mb-2" size={32} />
              <span className="text-sm font-serif text-center">Reviews</span>
            </Link>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Low Stock Alert</h3>
              <p className="text-sm text-orange-800">
                You have {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? 's' : ''} with low stock. 
                Consider restocking soon to avoid running out.
              </p>
              <Link 
                to={isAdmin ? "/admin/stock" : "/admin/my-stock"}
                className="text-sm text-orange-600 hover:underline font-semibold mt-2 inline-block"
              >
                View Stock →
              </Link>
            </div>
          </div>
        </div>
      )}

      {isAdmin && stats.pendingReviews > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Star className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Pending Reviews</h3>
              <p className="text-sm text-blue-800">
                You have {stats.pendingReviews} review{stats.pendingReviews !== 1 ? 's' : ''} waiting for approval.
              </p>
              <Link 
                to="/admin/reviews"
                className="text-sm text-blue-600 hover:underline font-semibold mt-2 inline-block"
              >
                Review Now →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;