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

export default async function ConfigurationAnalytics() {
  let fields = [];
  let trend = [0,0,0,0,0,0,0];
  try {
    const { db } = await connectToDatabase();
    fields = await db.collection('custom_fields').find({}, { projection: { fieldName: 1, fieldType: 1 } }).toArray();
    trend = await get7DayTrend(db, 'custom_fields');
  } catch (e) {
    console.error('Configuration analytics error', e);
  }

  // metrics
  let total = 0, selects = 0;
  try {
    const { db } = await connectToDatabase();
    total = await db.collection('custom_fields').countDocuments();
    selects = await db.collection('custom_fields').countDocuments({ fieldType: { $in: ['select-single','select-multi'] } });
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
          <h1 className="text-2xl font-semibold">Configuration Analytics</h1>
          <div className="text-xs text-neutral-400 mt-1">Last 7 days</div>
        </div>
        <div className="flex-1 w-full">
          <LineChart data={trend} labels={labels} height={160} />
        </div>
        <Link href="/dashboard/configuration" className="text-sm text-primary-500">Open Configuration</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Total Fields</div>
          <div className="text-lg font-semibold">{total}</div>
        </div>
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Select Fields</div>
          <div className="text-lg font-semibold">{selects}</div>
        </div>
        <div className="p-3 bg-white/5 border border-neutral-800 rounded-lg">
          <div className="text-xs text-neutral-400">Percent Selects</div>
          <div className="text-lg font-semibold">{total ? Math.round((selects/total)*100) : 0}%</div>
        </div>
      </div>
      <div className="bg-white/5 border border-neutral-800 rounded-lg p-4">
        <div className="text-sm text-neutral-400 mb-3">Custom fields</div>
        <ul className="space-y-2">
          {fields.length === 0 && <li className="text-neutral-500">No data available</li>}
          {fields.map((f) => (
            <li key={f._id} className="text-sm">{f.fieldName} — {f.fieldType}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
