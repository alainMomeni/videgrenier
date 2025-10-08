// frontend/src/config/dashboardNavConfig.ts
import { LayoutDashboard, ShoppingBag, Users, Settings, BarChart2, Archive, Star, Truck, Mail } from 'lucide-react';

export type NavLink = {
  path: string;
  label: string;
  icon: any;
};

export const dashboardNavConfig: { [key: string]: NavLink[] } = {
  admin: [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Manage Products', icon: ShoppingBag },
    { path: '/admin/stock', label: 'Stock Management', icon: Archive },
    { path: '/admin/supply', label: 'Supplies', icon: Truck },
    { path: '/admin/sales', label: 'Sales Analytics', icon: BarChart2 },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/reviews', label: 'Customer Reviews', icon: Star },
    { path: '/admin/newsletters', label: 'Newsletter', icon: Mail },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  seller: [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/my-products', label: 'My Products', icon: ShoppingBag },
    { path: '/admin/my-stock', label: 'Stock Management', icon: Archive },
    { path: '/admin/my-supply', label: 'My Supplies', icon: Truck }, // AJOUTÉ
    { path: '/admin/my-sales', label: 'My Sales', icon: BarChart2 },
    { path: '/admin/my-reviews', label: 'My Reviews', icon: Star },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ],
};