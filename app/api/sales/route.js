import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// GET - Fetch all sales or a specific sale by ID
export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const salesCollection = db.collection('sales');

    // Check if a specific ID is requested via query parameter
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      // Fetch a single sale by ID
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid sale ID' }, { status: 400 });
      }

      const sale = await salesCollection.findOne({ _id: new ObjectId(id) });

      if (!sale) {
        return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        sales: [sale],
      });
    }

    // Fetch all sales
    const allSales = await salesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      sales: allSales,
      total: allSales.length,
    });
  } catch (error) {
    console.error('Sales fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

// POST - Create new sale
export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    console.log(decoded,"tokentoken")
   

    const body = await req.json();
    const {
      saleId,
      customerId,
      customerName,
      saleDate,
      items,
      totalAmount,
      discount,
      discountPercent,
      finalAmount,
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      notes,
      isActive,
    } = body;

    // Validation
    if (!saleId || !customerId || !customerName || !saleDate || !items || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: saleId, customerId, customerName, saleDate, items, paymentMethod' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Validate items have required fields
    for (const item of items) {
      if (!item.productId || !item.productName || item.quantity < 0 || item.unitPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid item: must have productId, productName, quantity, and unitPrice' },
          { status: 400 }
        );
      }
    }

    if (totalAmount < 0 || discount < 0 || finalAmount < 0) {
      return NextResponse.json(
        { error: 'Amounts must be non-negative' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const salesCollection = db.collection('sales');

    // Check if saleId already exists
    const existingSale = await salesCollection.findOne({ saleId });
    if (existingSale) {
      return NextResponse.json(
        { error: 'Sale ID must be unique', details: `Sale ID '${saleId}' already exists` },
        { status: 400 }
      );
    }

    const saleObject = {
      saleId,
      customerId,
      customerName,
      saleDate: new Date(saleDate),
      items,
      totalAmount: parseFloat(totalAmount),
      discount: parseFloat(discount) || 0,
      discountPercent: parseFloat(discountPercent) || 0,
      finalAmount: parseFloat(finalAmount),
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      deliveryStatus: deliveryStatus || 'pending',
      notes: notes || '',
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await salesCollection.insertOne(saleObject);

    return NextResponse.json({
      success: true,
      message: 'Sale created successfully',
      sale: { _id: result.insertedId, ...saleObject },
    });
  } catch (error) {
    console.error('Sale creation error:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}

// PUT - Update sale
export async function PUT(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    // if (!decoded || decoded.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Sale ID is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid sale ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const salesCollection = db.collection('sales');

    // Prepare update object
    const updateObject = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Parse numeric fields
    if (updateObject.totalAmount !== undefined) {
      updateObject.totalAmount = parseFloat(updateObject.totalAmount);
    }
    if (updateObject.discount !== undefined) {
      updateObject.discount = parseFloat(updateObject.discount);
    }
    if (updateObject.discountPercent !== undefined) {
      updateObject.discountPercent = parseFloat(updateObject.discountPercent);
    }
    if (updateObject.finalAmount !== undefined) {
      updateObject.finalAmount = parseFloat(updateObject.finalAmount);
    }
    if (updateObject.saleDate !== undefined) {
      updateObject.saleDate = new Date(updateObject.saleDate);
    }

    const result = await salesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateObject },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sale updated successfully',
      sale: result.value,
    });
  } catch (error) {
    console.error('Sale update error:', error);
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 });
  }
}

// DELETE - Delete sale
export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    // if (!decoded || decoded.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Sale ID is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid sale ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const salesCollection = db.collection('sales');

    const result = await salesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sale deleted successfully',
    });
  } catch (error) {
    console.error('Sale deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 });
  }
}
