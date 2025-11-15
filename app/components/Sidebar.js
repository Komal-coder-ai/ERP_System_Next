'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path) => pathname === path;

  const menuItems = [
    { label: 'Home', icon: '🏠', path: '/dashboard' },
    { label: 'Products', icon: '📦', path: '/dashboard/products' },
    { label: 'Configuration', icon: '⚙️', path: '/dashboard/configuration' },
  ];

  return (
    <div style={{...styles.container, width: collapsed ? '60px' : '250px'}}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={styles.toggleBtn}
          title="Toggle Sidebar"
        >
          {collapsed ? '→' : '←'}
        </button>
        {!collapsed && <h2 style={styles.logo}>ERP System</h2>}
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} style={{textDecoration: 'none'}}>
            <div
              style={{
                ...styles.menuItem,
                backgroundColor: isActive(item.path) ? '#0056b3' : 'transparent',
                color: isActive(item.path) ? 'white' : '#333',
              }}
              title={item.label}
            >
              <span style={styles.icon}>{item.icon}</span>
              {!collapsed && <span style={styles.label}>{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={styles.footer}>
        <button
          onClick={handleLogout}
          style={{
            ...styles.logoutBtn,
            width: collapsed ? '40px' : '100%',
          }}
          title="Logout"
        >
          {collapsed ? '🚪' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
  },
  logo: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    overflow: 'y-auto',
  },
  menuItem: {
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderLeft: '4px solid transparent',
  },
  icon: {
    fontSize: '20px',
    minWidth: '24px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #dee2e6',
  },
  logoutBtn: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};
