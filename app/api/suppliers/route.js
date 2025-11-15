import { MongoClient, ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/jwt';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
}

const verifyAdminToken = async (token) => {
  if (!token) {
    return null;
  }
  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch (err) {
    return null;
  }
};

export async function GET(request) {
  if (!MONGO_URI) {
    return Response.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  let client;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('erp');
    const suppliersCollection = db.collection('suppliers');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single supplier
    if (id) {
      if (!ObjectId.isValid(id)) {
        return Response.json({ error: 'Invalid supplier ID' }, { status: 400 });
      }

      const supplier = await suppliersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!supplier) {
        return Response.json({ error: 'Supplier not found' }, { status: 404 });
      }

      return Response.json(supplier);
    }

    // All suppliers + filters
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const filter = {};

    if (search) {
      filter.$or = [
        { supplierName: { $regex: search, $options: 'i' } },
        { supplierId: { $regex: search, $options: 'i' } },
        { supplierEmail: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) filter.supplierType = type;
    if (status) filter.supplierStatus = status;

    const suppliers = await suppliersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(suppliers);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch suppliers', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const user = await verifyAdminToken(token);

  if (!user) {
    return Response.json({ error: 'Admin access required' }, { status: 401 });
  }

  if (!MONGO_URI) {
    return Response.json(
      { error: 'Database connection not configured', details: 'MONGO_URI is undefined' },
      { status: 500 }
    );
  }

  let client;

  try {
    const body = await request.json();

    const {
      supplierId,
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierAddress,
      supplierCity,
      supplierState,
      supplierCountry,
      supplierPostalCode,
      supplierCompanyName,
      supplierTaxId,
      paymentDuesDays,
      minimumOrderValue,
      supplierContactPerson,
      supplierType,
      supplierRating,
      supplierStatus,
    } = body;

    if (!supplierId || !supplierName || !supplierEmail || !supplierPhone) {
      return Response.json(
        { error: 'Supplier ID, name, email & phone required' },
        { status: 400 }
      );
    }

    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('erp');
    const suppliersCollection = db.collection('suppliers');

    // Check duplicates
    const existing = await suppliersCollection.findOne({ supplierId });
    if (existing) {
      return Response.json(
        { error: 'Supplier ID already exists' },
        { status: 400 }
      );
    }

    const newSupplier = {
      supplierId,
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierAddress: supplierAddress || '',
      supplierCity: supplierCity || '',
      supplierState: supplierState || '',
      supplierCountry: supplierCountry || '',
      supplierPostalCode: supplierPostalCode || '',
      supplierCompanyName: supplierCompanyName || '',
      supplierTaxId: supplierTaxId || '',
      paymentDuesDays: Number(paymentDuesDays) || 30,
      minimumOrderValue: Number(minimumOrderValue) || 0,
      supplierContactPerson: supplierContactPerson || '',
      supplierType: supplierType || 'raw-materials',
      supplierRating: Number(supplierRating) || 0,
      totalPurchases: 0,
      totalPaymentDue: 0,
      supplierStatus: supplierStatus || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await suppliersCollection.insertOne(newSupplier);

    return Response.json(
      { message: 'Supplier created', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: 'Failed to create supplier', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

export async function PUT(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const user = await verifyAdminToken(token);

  if (!user) {
    return Response.json({ error: 'Admin access required' }, { status: 401 });
  }

  if (!MONGO_URI) {
    return Response.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  let client;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return Response.json({ error: 'Invalid supplier ID' }, { status: 400 });
    }

    const body = await request.json();

    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('erp');
    const suppliersCollection = db.collection('suppliers');

    const result = await suppliersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return Response.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Supplier updated',
      supplier: result.value,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update supplier', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

export async function DELETE(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const user = await verifyAdminToken(token);

  if (!user) {
    return Response.json({ error: 'Admin access required' }, { status: 401 });
  }

  if (!MONGO_URI) {
    return Response.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  let client;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return Response.json({ error: 'Invalid supplier ID' }, { status: 400 });
    }

    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('erp');
    const suppliersCollection = db.collection('suppliers');

    const result = await suppliersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return Response.json({ message: 'Supplier deleted' });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete supplier', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
