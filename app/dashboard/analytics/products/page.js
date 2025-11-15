import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';

export default async function ProductsAnalytics() {
  let products = [];
  try {
    const { db } = await connectToDatabase();
    products = await db.collection('products').find({}, { projection: { name: 1 } }).limit(20).toArray();
  } catch (e) {
    console.error('Products analytics error', e);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products Analytics</h1>
        <Link href="/dashboard/products" className="text-sm text-primary-500">Open Products</Link>
      </div>
      <div className="bg-white/5 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-3">Recent products (name)</div>
        <ul className="space-y-2">
          {products.length === 0 && <li className="text-neutral-500">No data available</li>}
          {products.map((p) => (
            <li key={p._id} className="text-sm">{p.name || String(p._id)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
