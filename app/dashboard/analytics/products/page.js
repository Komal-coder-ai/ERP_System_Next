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

export default async function ProductsAnalytics() {
  let products = [];
  let trend = [0,0,0,0,0,0,0];
  try {
    const { db } = await connectToDatabase();
    products = await db.collection('products').find({}, { projection: { name: 1 } }).limit(20).toArray();
    trend = await get7DayTrend(db, 'products');
  } catch (e) {
    console.error('Products analytics error', e);
  }

  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - i);
    labels.push(d.toISOString().slice(0,10));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Products Analytics</h1>
          <div className="text-xs text-neutral-400 mt-1">Last 7 days</div>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1">
            <LineChart data={trend} labels={labels} height={160} />
          </div>
          <Link href="/dashboard/products" className="text-sm text-primary-500">Open Products</Link>
        </div>
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
