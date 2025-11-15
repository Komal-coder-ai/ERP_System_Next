import { MongoClient, ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/jwt';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
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
  if (!MONGODB_URI) {
    return Response.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('erp');
    const customersCollection = db.collection('customers');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single customer
    if (id) {
      if (!ObjectId.isValid(id)) {
        return Response.json({ error: 'Invalid customer ID' }, { status: 400 });
      }

      const customer = await customersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!customer) {
        return Response.json({ error: 'Customer not found' }, { status: 404 });
      }

      return Response.json(customer);
    }

    // All customers + filters
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const filter = {};

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) filter.customerType = type;
    if (status) filter.customerStatus = status;

    const customers = await customersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(customers);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch customers', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// ==================================================
//  POST - CREATE CUSTOMER
// ==================================================

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const user = await verifyAdminToken(token);

  if (!user) {
    return Response.json({ error: 'Admin access required' }, { status: 401 });
  }

  if (!MONGODB_URI) {
    return Response.json(
      { error: 'Database connection not configured', details: 'MONGODB_URI is undefined' },
      { status: 500 }
    );
  }

  let client;

  try {
    const body = await request.json();

    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      city,
      state,
      country,
      postalCode,
      companyName,
      gstNumber,
      creditLimit,
      contactPerson,
      customerType,
      paymentTerms,
      preferredPaymentMethod,
      customerStatus,
    } = body;

    if (!customerId || !customerName || !customerEmail || !customerPhone) {
      return Response.json(
        { error: 'Customer ID, name, email & phone required' },
        { status: 400 }
      );
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('erp');
    const customersCollection = db.collection('customers');

    // Check duplicates
    const existing = await customersCollection.findOne({ customerId });
    if (existing) {
      return Response.json(
        { error: 'Customer ID already exists' },
        { status: 400 }
      );
    }

    const newCustomer = {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress: customerAddress || '',
      city: city || '',
      state: state || '',
      country: country || '',
      postalCode: postalCode || '',
      companyName: companyName || '',
      gstNumber: gstNumber || '',
      creditLimit: Number(creditLimit) || 0,
      contactPerson: contactPerson || '',
      customerType,
      paymentTerms: paymentTerms || 'Net 30',
      preferredPaymentMethod: preferredPaymentMethod || 'Bank Transfer',
      totalOrders: 0,
      totalAmount: 0,
      totalDue: 0,
      customerStatus: customerStatus || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await customersCollection.insertOne(newCustomer);

    return Response.json(
      { message: 'Customer created', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: 'Failed to create customer', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// ==================================================
//  PUT - UPDATE CUSTOMER
// ==================================================

export async function PUT(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const user = await verifyAdminToken(token);

  if (!user) {
    return Response.json({ error: 'Admin access required' }, { status: 401 });
  }

  if (!MONGODB_URI) {
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
      return Response.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    const body = await request.json();

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('erp');
    const customersCollection = db.collection('customers');

    const result = await customersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return Response.json({ error: 'Customer not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Customer updated',
      customer: result.value,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update customer', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// ==================================================
//  DELETE - REMOVE CUSTOMER
// ==================================================

export async function DELETE(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const user = await verifyAdminToken(token);

  if (!user) {
    return Response.json({ error: 'Admin access required' }, { status: 401 });
  }

  if (!MONGODB_URI) {
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
      return Response.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('erp');
    const customersCollection = db.collection('customers');

    const result = await customersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Customer not found' }, { status: 404 });
    }

    return Response.json({ message: 'Customer deleted' });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete customer', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
