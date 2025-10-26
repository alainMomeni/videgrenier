// frontend/src/pages/seller/SellerSupply.tsx
import AdminSupply from '../admin/AdminSupply';

const SellerSupply = () => {
  return <AdminSupply {...({ isSellerView: true } as any)} />;
};

export default SellerSupply;