import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';

async function getCounts() {
  const { db } = await connectToDatabase();

  const [productsCount, inventoryCount, salesCount, suppliersCount, configCount] = await Promise.all([
    db.collection('products').countDocuments(),
    db.collection('inventory').countDocuments(),
    db.collection('sales').countDocuments(),
    db.collection('suppliers').countDocuments(),
    db.collection('custom_fields').countDocuments(),
  ]);

  return { productsCount, inventoryCount, salesCount, suppliersCount, configCount };
}

function StatCard({ title, count, href }) {
  return (
    <Link href={href} className="block">
      <div className="p-4 bg-white/5 border border-neutral-800 rounded-lg shadow-sm hover:shadow-md transition">
        <div className="text-sm text-neutral-300">{title}</div>
        <div className="mt-2 text-2xl font-semibold">{typeof count === 'number' ? count : '-'}</div>
      </div>
    </Link>
  );
}

export default async function AnalyticsPage() {
  let counts = { productsCount: 0, inventoryCount: 0, salesCount: 0, suppliersCount: 0, configCount: 0 };
  try {
    counts = await getCounts();
  } catch (e) {
    // If DB not configured this page will still render with zeros and a notice
    console.error('Analytics fetch error:', e);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Analytics Overview</h1>
        <div className="text-sm text-neutral-400">Snapshot of key modules</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Products" count={counts.productsCount} href="/dashboard/products" />
        <StatCard title="Inventory Items" count={counts.inventoryCount} href="/dashboard/inventory" />
        <StatCard title="Sales" count={counts.salesCount} href="/dashboard/sales" />
        <StatCard title="Suppliers" count={counts.suppliersCount} href="/dashboard/suppliers" />
        <StatCard title="Custom Fields (Configuration)" count={counts.configCount} href="/dashboard/configuration" />
      </div>

      <div className="mt-6">
        <div className="text-sm text-neutral-400">Click any card to open the related module.</div>
      </div>
    </div>
  );
}
