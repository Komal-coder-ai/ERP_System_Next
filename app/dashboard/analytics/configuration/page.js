import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';

export default async function ConfigurationAnalytics() {
  let fields = [];
  try {
    const { db } = await connectToDatabase();
    fields = await db.collection('custom_fields').find({}, { projection: { fieldName: 1, fieldType: 1 } }).toArray();
  } catch (e) {
    console.error('Configuration analytics error', e);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Configuration Analytics</h1>
        <Link href="/dashboard/configuration" className="text-sm text-primary-500">Open Configuration</Link>
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
