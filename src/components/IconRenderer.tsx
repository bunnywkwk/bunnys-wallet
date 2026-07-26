import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = 'w-5 h-5',
  size = 20,
  color,
}) => {
  // @ts-ignore
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} style={{ color }} />;
};

export const AVAILABLE_ICONS = [
  'Banknote',
  'Building2',
  'Smartphone',
  'CreditCard',
  'Wallet',
  'PiggyBank',
  'DollarSign',
  'TrendingUp',
  'Utensils',
  'ShoppingCart',
  'Car',
  'Zap',
  'ShoppingBag',
  'Film',
  'HeartPulse',
  'BookOpen',
  'Briefcase',
  'Laptop',
  'Gift',
  'Home',
  'Plane',
  'Coffee',
  'Dumbbell',
  'Scissors',
  'Tv',
  'MoreHorizontal',
];
