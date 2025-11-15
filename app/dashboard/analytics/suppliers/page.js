import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';

export default async function SuppliersAnalytics() {
  let suppliers = [];
  try {
    const { db } = await connectToDatabase();
    suppliers = await db.collection('suppliers').find({}, { projection: { name: 1 } }).limit(20).toArray();
  } catch (e) {
    console.error('Suppliers analytics error', e);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Suppliers Analytics</h1>
        <Link href="/dashboard/suppliers" className="text-sm text-primary-500">Open Suppliers</Link>
      </div>
      <div className="bg-white/5 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-3">Recent suppliers</div>
        <ul className="space-y-2">
          {suppliers.length === 0 && <li className="text-neutral-500">No data available</li>}
          {suppliers.map((s) => (
            <li key={s._id} className="text-sm">{s.name || String(s._id)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
