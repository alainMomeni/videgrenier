import { LayoutDashboard, ShoppingBag, Users, Settings, Package, BarChart2, Archive, TruckIcon, TrendingUp, MessageSquare } from 'lucide-react';
import type { FC } from 'react';

type NavLink = {
  path: string;
  label: string;
  icon: FC<{ size?: number }>;
};

export const dashboardNavConfig: { [key: string]: NavLink[] } = {
  admin: [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Manage Products', icon: ShoppingBag },
    { path: '/admin/stock', label: 'Stock Management', icon: Archive },
    { path: '/admin/supply', label: 'Supply Management', icon: TruckIcon },
    { path: '/admin/sales', label: 'Sales Analytics', icon: TrendingUp },
    { path: '/admin/reviews', label: 'Customer Reviews', icon: MessageSquare },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  seller: [
    { path: '/admin', label: 'My Dashboard', icon: LayoutDashboard },
    { path: '/admin/my-products', label: 'My Products', icon: Package },
    { path: '/admin/my-stock', label: 'My Stock', icon: Archive },
    { path: '/admin/my-sales', label: 'My Sales', icon: BarChart2 },
    { path: '/admin/my-reviews', label: 'My Reviews', icon: MessageSquare },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ],
};