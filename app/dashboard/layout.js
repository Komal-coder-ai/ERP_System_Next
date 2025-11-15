'use client';

import Sidebar from '@/app/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return <div style={{padding: '20px'}}>Loading...</div>;

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Welcome, {user.name}</h1>
          <p style={styles.headerSubtitle}>{user.email}</p>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    marginLeft: '250px',
    flex: 1,
    transition: 'margin-left 0.3s ease',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 40px',
    borderBottom: '1px solid #dee2e6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    margin: '0 0 5px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  content: {
    padding: '30px 40px',
  },
};
