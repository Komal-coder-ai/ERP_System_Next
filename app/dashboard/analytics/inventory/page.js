import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';

export default async function InventoryAnalytics() {
  let items = [];
  try {
    const { db } = await connectToDatabase();
    items = await db.collection('inventory').find({}, { projection: { name: 1, quantity: 1 } }).limit(20).toArray();
  } catch (e) {
    console.error('Inventory analytics error', e);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Inventory Analytics</h1>
        <Link href="/dashboard/inventory" className="text-sm text-primary-500">Open Inventory</Link>
      </div>
      <div className="bg-white/5 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-3">Recent inventory items</div>
        <ul className="space-y-2">
          {items.length === 0 && <li className="text-neutral-500">No data available</li>}
          {items.map((it) => (
            <li key={it._id} className="text-sm">{it.name || String(it._id)} — {it.quantity ?? '-'}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
