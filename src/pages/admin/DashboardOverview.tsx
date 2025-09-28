import { motion, type Variants } from 'framer-motion';
import { DollarSign, Users, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import React, { useState } from 'react';

// Données factices pour le graphique
const salesData = [
  { name: 'Jan', sales: 4000 }, 
  { name: 'Feb', sales: 3000 }, 
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 }, 
  { name: 'May', sales: 6000 }, 
  { name: 'Jun', sales: 5500 },
];

// Couleurs harmonisées pour le graphique
const COLORS = ['#a9b1a8', '#9a9e91', '#70816B', '#5a6958', '#495547', '#3a4339'];

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
};

const StatCard = ({ title, value, icon, change }: StatCardProps) => (
  <div className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm transition-shadow hover:shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-serif">{title}</p>
        <p className="text-3xl font-bold text-[#2a363b] mt-1">{value}</p>
      </div>
      <div className="bg-[#e7e2d9] p-3 rounded-full text-[#2a363b]">
        {icon}
      </div>
    </div>
    <div className="flex items-center text-xs text-green-700 mt-4">
      <ArrowUpRight size={14} className="mr-1" /> {change} vs last month
    </div>
  </div>
);

const DashboardOverview = () => {
  const [focusBar, setFocusBar] = useState<number | null>(null);

  // FIX: Typage correct des variants avec ease en tant que literal
  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.2 
      } 
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const // FIX: Spécifier le type literal
      } 
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2a363b]">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">A summary of your store's performance.</p>
      </div>
      
      {/* Stat Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        variants={cardContainerVariants}
      >
        <motion.div variants={cardVariants}>
          <StatCard title="Total Revenue" value="$45,231" icon={<DollarSign />} change="+20.1%" />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard title="New Customers" value="+3,412" icon={<Users />} change="+15.3%" />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard title="Orders This Month" value="1,754" icon={<ShoppingBag />} change="+5.7%" />
        </motion.div>
      </motion.div>
      
      {/* Sales Chart */}
      <motion.div 
        className="bg-[#fcfaf7] p-6 rounded-lg border border-[#dcd6c9] shadow-sm h-96"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="font-serif text-xl text-[#2a363b] mb-4">Sales Performance (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart 
            data={salesData} 
            margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
            onMouseMove={(state: any) => {
              // FIX: Vérifier que activeTooltipIndex n'est pas undefined
              if (state && state.isTooltipActive && typeof state.activeTooltipIndex === 'number') {
                setFocusBar(state.activeTooltipIndex);
              } else {
                setFocusBar(null);
              }
            }}
            onMouseLeave={() => setFocusBar(null)} // FIX: Reset quand la souris quitte le graphique
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d9" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              cursor={{ fill: '#e7e2d9' }}
              contentStyle={{ 
                backgroundColor: '#fcfaf7', 
                border: '1px solid #dcd6c9',
                borderRadius: '0.5rem',
                fontFamily: 'serif'
              }} 
            />
            <Bar dataKey="sales" name="Sales ($)">
              {salesData.map((_entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={focusBar === index ? '#2a363b' : COLORS[index % COLORS.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;