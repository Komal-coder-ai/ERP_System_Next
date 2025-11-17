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

export default async function SalesAnalytics() {
  let sales = [];
  let trend = [0,0,0,0,0,0,0];
  try {
    const { db } = await connectToDatabase();
    sales = await db.collection('sales').find({}, { projection: { total: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(20).toArray();
    trend = await get7DayTrend(db, 'sales');
  } catch (e) {
    console.error('Sales analytics error', e);
  }

  // compute metrics
  let orders = 0, revenue = 0, avg = 0;
  try {
    const { db } = await connectToDatabase();
    orders = await db.collection('sales').countDocuments();
    const rev = await db.collection('sales').aggregate([
      { $group: { _id: null, revenue: { $sum: { $ifNull: ["$total", 0] } } } }
    ]).toArray();
    revenue = (rev && rev[0] && rev[0].revenue) ? rev[0].revenue : 0;
    avg = orders ? Math.round((revenue / orders) * 100) / 100 : 0;
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
          <h1 className="text-2xl font-semibold">Sales Analytics</h1>
          <div className="text-xs text-neutral-400 mt-1">Last 7 days</div>
        </div>
        <div className="flex-1 w-full">
          <LineChart data={trend} labels={labels} height={160} />
        </div>
        <Link href="/dashboard/sales" className="text-sm text-primary-500">Open Sales</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Orders</div>
          <div className="text-lg font-semibold">{orders}</div>
        </div>
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Revenue</div>
          <div className="text-lg font-semibold">{revenue}</div>
        </div>
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Avg Order</div>
          <div className="text-lg font-semibold">{avg}</div>
        </div>
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
