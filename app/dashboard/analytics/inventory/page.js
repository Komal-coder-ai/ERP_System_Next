import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import Sparkline from '../../../components/charts/Sparkline';
import LineChart from '../../../components/charts/LineChart';

async function get7DayTrend(db, collectionName) {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const pipeline = [
      { $match: { createdAt: { $gte: start } } },
      { $project: { day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
      { $group: { _id: "$day", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ];

    const rows = await db.collection(collectionName).aggregate(pipeline).toArray();
    const map = {};
    rows.forEach(r => { map[r._id] = r.count; });

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push(map[key] || 0);
    }

    return result;
  } catch (e) {
    return [0,0,0,0,0,0,0];
  }
}

export default async function InventoryAnalytics() {
  let items = [];
  let trend = [0,0,0,0,0,0,0];
  try {
    const { db } = await connectToDatabase();
    items = await db.collection('inventory').find({}, { projection: { name: 1, quantity: 1 } }).limit(20).toArray();
    trend = await get7DayTrend(db, 'inventory');
  } catch (e) {
    console.error('Inventory analytics error', e);
  }

  // compute simple metrics
  let totalItems = 0, totalQuantity = 0, usedQuantity = 0, utilization = 0;
  try {
    const { db } = await connectToDatabase();
    totalItems = await db.collection('inventory').countDocuments();
    const agg = await db.collection('inventory').aggregate([
      { $group: { _id: null, totalQuantity: { $sum: { $ifNull: ["$quantity", 0] } }, usedQuantity: { $sum: { $ifNull: ["$usedQuantity", 0] } } } }
    ]).toArray();
    if (agg && agg[0]) {
      totalQuantity = agg[0].totalQuantity || 0;
      usedQuantity = agg[0].usedQuantity || 0;
      utilization = totalQuantity ? Math.round((usedQuantity / totalQuantity) * 100) : 0;
    }
  } catch (e) { }

  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - i);
    labels.push(d.toISOString().slice(0,10));
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Analytics</h1>
          <div className="text-xs text-neutral-400 mt-1">Last 7 days</div>
        </div>
        <div className="flex-1 w-full">
          <LineChart data={trend} labels={labels} height={160} />
        </div>
        <Link href="/dashboard/inventory" className="text-sm text-primary-500">Open Inventory</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Total Items</div>
          <div className="text-lg font-semibold">{totalItems}</div>
        </div>
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Total Quantity</div>
          <div className="text-lg font-semibold">{totalQuantity}</div>
        </div>
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Utilization</div>
          <div className="text-lg font-semibold">{utilization}%</div>
        </div>
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
