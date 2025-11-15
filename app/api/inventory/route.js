import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// GET - Fetch all inventory items or a specific item by ID
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
    const inventoryCollection = db.collection('inventory');
    
    // Check if a specific ID is requested via query parameter
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      // Fetch a single item by ID
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid inventory ID' }, { status: 400 });
      }

      const item = await inventoryCollection.findOne({ _id: new ObjectId(id) });
      
      if (!item) {
        return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        inventory: [item],
      });
    }

    // Fetch all items
    const inventoryItems = await inventoryCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      inventory: inventoryItems,
      total: inventoryItems.length,
    });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST - Create new inventory item
export async function POST(req) {
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
    const {
      productId,
      productName,
      quantity,
      reorderLevel,
      unit,
      location,
      batchNumber,
      expiryDate,
      supplier,
      notes,
      isActive = true,
    } = body;

    // Validation
    if (!productId || !productName || !quantity || !reorderLevel || !unit || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (isNaN(quantity) || quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    if (isNaN(reorderLevel) || reorderLevel < 0) {
      return NextResponse.json(
        { error: 'Reorder level must be a positive number' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection('inventory');

    // Check if inventory already exists for this product
    const existingInventory = await inventoryCollection.findOne({ productId });
    if (existingInventory) {
      return NextResponse.json(
        { error: 'Inventory already exists for this product' },
        { status: 409 }
      );
    }

    const qty = parseInt(quantity);
    const reorder = parseInt(reorderLevel);

    const inventoryItem = {
      productId,
      productName,
      quantity: qty,
      reorderLevel: reorder,
      unit,
      location,
      batchNumber: batchNumber || '',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      supplier: supplier || '',
      notes: notes || '',
      status: qty <= reorder ? 'low' : 'ok',
      isActive: isActive === true || isActive === 'true',
      lastRestockDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await inventoryCollection.insertOne(inventoryItem);

    return NextResponse.json(
      {
        success: true,
        message: 'Inventory item created successfully',
        inventory: {
          _id: result.insertedId,
          ...inventoryItem,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Inventory creation error:', error);
    return NextResponse.json({ error: 'Failed to create inventory' }, { status: 500 });
  }
}

// PUT - Update inventory item
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
      return NextResponse.json({ error: 'Inventory ID required' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid inventory ID format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection('inventory');

    // Parse quantity and reorderLevel as numbers
    const updateDataParsed = {
      ...updateData,
      quantity: updateData.quantity !== undefined ? Number(updateData.quantity) : undefined,
      reorderLevel: updateData.reorderLevel !== undefined ? Number(updateData.reorderLevel) : undefined,
    };

    // Prepare update data
    const updateFields = {
      ...updateDataParsed,
      updatedAt: new Date(),
    };

    // Update status based on quantity vs reorder level
    if (updateDataParsed.quantity !== undefined && updateDataParsed.reorderLevel !== undefined) {
      updateFields.status = updateDataParsed.quantity <= updateDataParsed.reorderLevel ? 'low' : 'ok';
    } else if (updateDataParsed.quantity !== undefined) {
      const item = await inventoryCollection.findOne({ _id: new ObjectId(id) });
      if (item) {
        updateFields.status = updateDataParsed.quantity <= item.reorderLevel ? 'low' : 'ok';
      }
    }

    const result = await inventoryCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
console.log(result,"resultresult");

    if (!result._id) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory updated successfully',
      inventory: result.value,
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}

// DELETE - Delete inventory item
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Inventory ID required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection('inventory');

    const result = await inventoryCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory deleted successfully',
    });
  } catch (error) {
    console.error('Inventory deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete inventory' }, { status: 500 });
  }
}
