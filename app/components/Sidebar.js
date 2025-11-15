'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import FactoryIcon from '@mui/icons-material/Factory';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path) => pathname === path;

  const menuItems = [
    { label: 'Home', icon: HomeIcon, path: '/dashboard' },
    { label: 'Products', icon: StorageIcon, path: '/dashboard/products' },
    { label: 'Inventory', icon: InventoryIcon, path: '/dashboard/inventory' },
    { label: 'Sales', icon: ShoppingCartIcon, path: '/dashboard/sales' },
    { label: 'Customers', icon: PersonIcon, path: '/dashboard/customers' },
    { label: 'Suppliers', icon: FactoryIcon, path: '/dashboard/suppliers' },
    { label: 'Configuration', icon: SettingsIcon, path: '/dashboard/configuration' },
    { label: 'Settings', icon: SettingsIcon, path: '/dashboard/settings' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="px-6 py-6 border-b border-neutral-800 flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
          title="Toggle Sidebar"
        >
          {collapsed ? <MenuIcon /> : <CloseIcon />}
        </button>
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
              <span className="text-white text-sm font-bold">ERP</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 overflow-y-auto px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
                title={item.label}
              >
                <Icon style={{ fontSize: '20px' }} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}

        {/* Analytics Dropdown */}
        <div>
          <div
            onClick={() => setAnalyticsOpen(!analyticsOpen)}
            className={`px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all duration-200 ${
              pathname && pathname.startsWith('/dashboard/analytics')
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
            title="Analytics"
          >
            <BarChartIcon style={{ fontSize: '20px' }} />
            {!collapsed && <span className="text-sm font-medium">Analytics</span>}
            {!collapsed && (analyticsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </div>

          {analyticsOpen && (
            <div className="pl-8 mt-2 space-y-1">
              <Link href="/dashboard/analytics">
                <div className="px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800">
                  {!collapsed && <span className="text-sm">Overview</span>}
                </div>
              </Link>
              <Link href="/dashboard/analytics/products">
                <div className="px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800">
                  {!collapsed && <span className="text-sm">Products</span>}
                </div>
              </Link>
              <Link href="/dashboard/analytics/inventory">
                <div className="px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800">
                  {!collapsed && <span className="text-sm">Inventory</span>}
                </div>
              </Link>
              <Link href="/dashboard/analytics/sales">
                <div className="px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800">
                  {!collapsed && <span className="text-sm">Sales</span>}
                </div>
              </Link>
              <Link href="/dashboard/analytics/suppliers">
                <div className="px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800">
                  {!collapsed && <span className="text-sm">Suppliers</span>}
                </div>
              </Link>
              <Link href="/dashboard/analytics/configuration">
                <div className="px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800">
                  {!collapsed && <span className="text-sm">Configuration</span>}
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-6 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 justify-center"
          title="Logout"
        >
          <LogoutIcon style={{ fontSize: '18px' }} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}
