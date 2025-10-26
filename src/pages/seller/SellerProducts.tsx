// frontend/src/pages/seller/SellerProducts.tsx

import AdminProducts from "../admin/AdminProducts"; // On importe la page de l'admin

// Ce composant est un simple "wrapper"
// Il rend la même page que l'admin, mais avec la prop `isSellerView` activée
const SellerProducts = () => {
  return <AdminProducts isSellerView={true} />;
};

export default SellerProducts;