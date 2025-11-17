import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import Sparkline from '../../components/charts/Sparkline';

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
    return [0, 0, 0, 0, 0, 0, 0];
  }
}

async function getModuleMetrics(db) {
  const metrics = {
    products: { total: 0, active: 0 },
    inventory: { totalItems: 0, totalQuantity: 0, usedQuantity: 0 },
    sales: { orders: 0, revenue: 0 },
    suppliers: { total: 0, active: 0 },
    config: { total: 0, selects: 0 },
  };

  try {
    // Products
    metrics.products.total = await db.collection('products').countDocuments();
    try { metrics.products.active = await db.collection('products').countDocuments({ isActive: true }); } catch { metrics.products.active = 0; }

    // Inventory
    metrics.inventory.totalItems = await db.collection('inventory').countDocuments();
    try {
      const res = await db.collection('inventory').aggregate([
        { $group: { _id: null, totalQuantity: { $sum: { $ifNull: ["$quantity", 0] } }, usedQuantity: { $sum: { $ifNull: ["$usedQuantity", 0] } } } }
      ]).toArray();
      if (res && res[0]) {
        metrics.inventory.totalQuantity = res[0].totalQuantity || 0;
        metrics.inventory.usedQuantity = res[0].usedQuantity || 0;
      }
    } catch (e) { }

    // Sales
    metrics.sales.orders = await db.collection('sales').countDocuments();
    try {
      const rev = await db.collection('sales').aggregate([
        { $group: { _id: null, revenue: { $sum: { $ifNull: ["$total", 0] } } } }
      ]).toArray();
      metrics.sales.revenue = (rev && rev[0] && rev[0].revenue) ? rev[0].revenue : 0;
    } catch (e) { }

    // Suppliers
    metrics.suppliers.total = await db.collection('suppliers').countDocuments();
    try { metrics.suppliers.active = await db.collection('suppliers').countDocuments({ isActive: true }); } catch { metrics.suppliers.active = 0; }

    // Configuration
    metrics.config.total = await db.collection('custom_fields').countDocuments();
    try { metrics.config.selects = await db.collection('custom_fields').countDocuments({ fieldType: { $in: ['select-single','select-multi'] } }); } catch { metrics.config.selects = 0; }
  } catch (e) {
    console.error('getModuleMetrics error', e);
  }

  return metrics;
}

function StatCard({ title, count, href, trend, meta }) {
  const utilization = (() => {
    if (!meta) return null;
    if (meta.total !== undefined && meta.active !== undefined) {
      const t = meta.total || 0;
      const a = meta.active || 0;
      return t ? Math.round((a / t) * 100) : 0;
    }
    if (meta.totalQuantity !== undefined) {
      const tq = meta.totalQuantity || 0;
      const uq = meta.usedQuantity || 0;
      return tq ? Math.round((uq / tq) * 100) : 0;
    }
    return null;
  })();

  return (
    <Link href={href} className="block">
      <div className="p-4 bg-white/5 border border-neutral-800 rounded-lg shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-300">{title}</div>
          <div className="text-xs text-neutral-400">7d</div>
        </div>
        <div className="mt-2 text-2xl font-semibold">{typeof count === 'number' ? count : '-'}</div>
        {utilization !== null && (
          <div className="text-xs text-neutral-400 mt-1">Active Utilization: {utilization}%</div>
        )}
        <div className="mt-3">
          <Sparkline data={trend} />
        </div>
      </div>
    </Link>
  );
}

export default async function AnalyticsPage() {
  let counts = { productsCount: 0, inventoryCount: 0, salesCount: 0, suppliersCount: 0, configCount: 0 };
  let trends = {
    products: [0,0,0,0,0,0,0],
    inventory: [0,0,0,0,0,0,0],
    sales: [0,0,0,0,0,0,0],
    suppliers: [0,0,0,0,0,0,0],
    config: [0,0,0,0,0,0,0],
  };

  try {
    counts = await getCounts();
    const { db } = await connectToDatabase();
    const [pT, iT, sT, supT, cT, metrics] = await Promise.all([
      get7DayTrend(db, 'products'),
      get7DayTrend(db, 'inventory'),
      get7DayTrend(db, 'sales'),
      get7DayTrend(db, 'suppliers'),
      get7DayTrend(db, 'custom_fields'),
      getModuleMetrics(db),
    ]);
    trends = { products: pT, inventory: iT, sales: sT, suppliers: supT, config: cT };
    counts._metrics = metrics;
  } catch (e) {
    console.error('Analytics fetch error:', e);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Analytics Overview</h1>
        <div className="text-sm text-neutral-400">Snapshot of key modules</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Products" count={counts.productsCount} href="/dashboard/products" trend={trends.products} meta={counts._metrics?.products} />
        <StatCard title="Inventory Items" count={counts.inventoryCount} href="/dashboard/inventory" trend={trends.inventory} meta={counts._metrics?.inventory} />
        <StatCard title="Sales" count={counts.salesCount} href="/dashboard/sales" trend={trends.sales} meta={counts._metrics?.sales} />
        <StatCard title="Suppliers" count={counts.suppliersCount} href="/dashboard/suppliers" trend={trends.suppliers} meta={counts._metrics?.suppliers} />
        <StatCard title="Custom Fields (Configuration)" count={counts.configCount} href="/dashboard/configuration" trend={trends.config} meta={counts._metrics?.config} />
      </div>

      <div className="mt-6">
        <div className="text-sm text-neutral-400">Click any card to open the related module.</div>
      </div>
    </div>
  );
}
