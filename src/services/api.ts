// frontend/src/services/api.ts
import axios from 'axios';
import toast from 'react-hot-toast';

// Détection automatique de l'environnement
const API_URL = import.meta.env.PROD 
  ? 'https://videgrenierback.onrender.com/api' // ✅ Production Render
  : 'http://localhost:5000/api'; // Développement local

console.log('🔗 API URL:', API_URL);
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('🏭 Production:', import.meta.env.PROD);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes
  withCredentials: true, // Important pour CORS avec credentials
});

// ============================================
// INTERCEPTEURS
// ============================================

// Intercepteur de requête : Ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : Gérer les comptes bloqués et les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ GÉRER LES ERREURS D'AUTHENTIFICATION (401)
    if (error.response?.status === 401 && error.response?.data?.requiresAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.error('Please login to continue', {
        duration: 4000,
      });
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
      return Promise.reject(error);
    }
    
    // Gérer les comptes bloqués
    if (error.response?.status === 403 && error.response?.data?.blocked) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.error('Your account has been blocked. Please contact support.', {
        duration: 5000,
      });
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    
    // Gérer les erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    }
    
    // Gérer les erreurs réseau
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    // Gérer les erreurs CORS
    if (error.message && error.message.includes('CORS')) {
      console.error('❌ CORS Error:', error);
      toast.error('Connection error. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// FONCTIONS DE NORMALISATION
// ============================================

const normalizeProduct = (product: any) => ({
  ...product,
  prix: Number(product.prix),
  quantite: Number(product.quantite),
  id_user: Number(product.id_user),
  id_produit: Number(product.id_produit),
});

const normalizeStock = (stock: any) => ({
  ...stock,
  id_stock: Number(stock.id_stock),
  id_produit: Number(stock.id_produit),
  id_user: stock.id_user ? Number(stock.id_user) : undefined,
  quantite_ouverture_mois: Number(stock.quantite_ouverture_mois),
  quantite_vendu_mois: Number(stock.quantite_vendu_mois),
  stock_actuel: Number(stock.stock_actuel),
  quantite_approvisionner: Number(stock.quantite_approvisionner),
  valeur_stock: Number(stock.valeur_stock),
  prix_unitaire: stock.prix_unitaire ? Number(stock.prix_unitaire) : undefined,
});

const normalizeSale = (sale: any) => ({
  ...sale,
  id_sale: Number(sale.id_sale),
  id_produit: Number(sale.id_produit),
  id_seller: Number(sale.id_seller),
  quantity: Number(sale.quantity),
  unit_price: Number(sale.unit_price),
  total_amount: Number(sale.total_amount),
});

const normalizeSupply = (supply: any) => ({
  ...supply,
  id_supply: Number(supply.id_supply),
  id_produit: Number(supply.id_produit),
  id_user: Number(supply.id_user),
  quantite: Number(supply.quantite),
  prix_unitaire: Number(supply.prix_unitaire),
  prix_total: Number(supply.prix_total),
});

const normalizeReview = (review: any) => ({
  ...review,
  id_review: Number(review.id_review),
  id_produit: Number(review.id_produit),
  rating: Number(review.rating),
  helpful: Number(review.helpful),
});

const normalizeUser = (user: any) => ({
  ...user,
  id: Number(user.id),
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  role: user.role,
  isBlocked: Boolean(user.is_blocked),
  createdAt: user.created_at,
});

// ============================================
// UPLOAD IMAGE - CLOUDINARY
// ============================================

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    console.log('📤 Uploading image to Cloudinary...');
    console.log('📄 File name:', file.name);
    console.log('📄 File size:', (file.size / 1024).toFixed(2), 'KB');
    
    const response = await api.post('/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 secondes pour l'upload
    });
    
    console.log('✅ Image uploaded successfully');
    console.log('🔗 Cloudinary URL:', response.data.imageUrl);
    
    return response.data.imageUrl;
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

// ============================================
// API PRODUCTS
// ============================================

export const productAPI = {
  getAll: async (userId?: number) => {
    console.log('🔍 ========================================');
    console.log('🔍 API CALL: GET ALL PRODUCTS');
    console.log('🔍 User ID param:', userId);
    
    // ✅ CORRECTION ICI : Utiliser id_user au lieu de userId
    const params = userId ? { id_user: userId } : {};
    console.log('📝 Request params:', params);
    console.log('🔍 ========================================');
    
    const response = await api.get('/products', { params });
    return {
      ...response,
      data: response.data.map(normalizeProduct)
    };
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return {
      ...response,
      data: normalizeProduct(response.data)
    };
  },
  
  create: (data: any) => api.post('/products', data),
  
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  
  delete: (id: number) => api.delete(`/products/${id}`),
};

// ============================================
// API STOCK
// ============================================

export const stockAPI = {
  getAll: async (params?: { month?: number; year?: number; userId?: number }) => {
    const response = await api.get('/stock', { params });
    return {
      ...response,
      data: response.data.map(normalizeStock)
    };
  },
  
  create: (data: any) => api.post('/stock', data),
  
  updateStock: (id: number, data: { stock_actuel: number; prix_unitaire?: number }) => 
    api.put(`/stock/${id}`, data),
  
  delete: (id: number) => api.delete(`/stock/${id}`),
};

// ============================================
// API SUPPLIES (Sans fournisseurs)
// ============================================

export const supplyAPI = {
  getAll: async (userId?: number) => {
    const response = await api.get('/supplies', { 
      params: userId ? { userId } : {} 
    });
    return {
      ...response,
      data: response.data.map(normalizeSupply)
    };
  },
  
  create: (data: any) => api.post('/supplies', data),
  
  update: (id: number, data: any) => api.put(`/supplies/${id}`, data),
  
  delete: (id: number) => api.delete(`/supplies/${id}`),
};

// ============================================
// API SALES
// ============================================

export const salesAPI = {
  getAll: async (sellerId?: number) => {
    const response = await api.get('/sales', { params: sellerId ? { sellerId } : {} });
    return {
      ...response,
      data: response.data.map(normalizeSale)
    };
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/sales/${id}`);
    return {
      ...response,
      data: normalizeSale(response.data)
    };
  },
  
  create: (data: any) => api.post('/sales', data),
  
  // ✅ SIMPLIFIÉ : Plus besoin de buyer_name et buyer_email
  createBulk: (data: {
    items: Array<{ id_produit: number; quantity: number }>;
    payment_method: string;
    shipping_address?: string;
  }) => api.post('/sales/bulk', data),
  
  updateStatus: (id: number, status: string) => 
    api.put(`/sales/${id}/status`, { status }),
  
  // ✅ AJOUT DE LA MÉTHODE DELETE
  delete: (id: number) => api.delete(`/sales/${id}`),
};

// ============================================
// API REVIEWS
// ============================================

export const reviewAPI = {
  getAll: async (params?: { productId?: number; status?: string; sellerId?: number }) => {
    const response = await api.get('/reviews', { params });
    return {
      ...response,
      data: response.data.map(normalizeReview)
    };
  },
  
  getStats: (productId: number) => api.get(`/reviews/product/${productId}/stats`),
  
  create: (data: any) => api.post('/reviews', data),
  
  updateStatus: (id: number, status: string) => 
    api.put(`/reviews/${id}/status`, { status }),
  
  markHelpful: (id: number) => api.put(`/reviews/${id}/helpful`),
  
  delete: (id: number) => api.delete(`/reviews/${id}`),
};

// ============================================
// API USERS
// ============================================

export const userAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return {
      ...response,
      data: response.data.map(normalizeUser)
    };
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return {
      ...response,
      data: normalizeUser(response.data)
    };
  },
  
  create: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post('/users', data);
    return {
      ...response,
      data: normalizeUser(response.data.user)
    };
  },
  
  update: async (id: number, data: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    password?: string;
  }) => {
    const response = await api.put(`/users/${id}`, data);
    return {
      ...response,
      data: normalizeUser(response.data.user)
    };
  },
  
  delete: (id: number) => api.delete(`/users/${id}`),
  
  updatePassword: (id: number, data: { currentPassword: string; newPassword: string }) => 
    api.put(`/users/${id}/password`, data),
  
  toggleBlock: async (id: number) => {
    const response = await api.put(`/users/${id}/toggle-block`);
    return {
      ...response,
      data: normalizeUser(response.data.user)
    };
  },
};

// ============================================
// API NEWSLETTERS
// ============================================

export const newsletterAPI = {
  subscribe: (email: string) => api.post('/newsletters/subscribe', { email }),
  
  getAll: async () => {
    const response = await api.get('/newsletters');
    return {
      ...response,
      data: response.data.map((sub: any) => ({
        ...sub,
        id_newsletter: Number(sub.id_newsletter),
        isActive: Boolean(sub.is_active),
        subscribedAt: sub.subscribed_at,
      }))
    };
  },
  
  getStats: () => api.get('/newsletters/stats'),
  
  unsubscribe: (id: number, permanent: boolean = false) => 
    api.delete(`/newsletters/${id}?permanent=${permanent}`),
  
  reactivate: (id: number) => api.put(`/newsletters/${id}/reactivate`),
};

// ============================================
// API CONTACT
// ============================================

export const contactAPI = {
  submit: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => api.post('/contact/submit', data),
};

// ============================================
// API AUTH (Password Reset)
// ============================================

export const authAPI = {
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; newPassword: string }) => 
    api.post('/auth/reset-password', data),
};

// ============================================
// API PAYMENT (Mobile Money CamPay)
// ============================================

export const paymentAPI = {
  // Initier un paiement mobile money
  initiateMobilePayment: (data: {
    order_id: string;
    phone_number: string;
    amount: number;
    operator: 'orange' | 'mtn';
  }) => api.post('/payment/mobile/initiate', data),
  
  // Vérifier le statut d'un paiement
  checkPaymentStatus: (reference: string) => api.get(`/payment/status/${reference}`),
};

export default api;