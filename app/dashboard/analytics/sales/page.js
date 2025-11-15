import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';

export default async function SalesAnalytics() {
  let sales = [];
  try {
    const { db } = await connectToDatabase();
    sales = await db.collection('sales').find({}, { projection: { total: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(20).toArray();
  } catch (e) {
    console.error('Sales analytics error', e);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sales Analytics</h1>
        <Link href="/dashboard/sales" className="text-sm text-primary-500">Open Sales</Link>
      </div>
      <div className="bg-white/5 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-3">Recent sales</div>
        <ul className="space-y-2">
          {sales.length === 0 && <li className="text-neutral-500">No data available</li>}
          {sales.map((s) => (
            <li key={s._id} className="text-sm">{s.total ? `Total: ${s.total}` : String(s._id)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
