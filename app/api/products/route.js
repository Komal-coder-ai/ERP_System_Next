import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const { name, sku, description, price, quantity, category, customFieldValues, images } = await req.json();

    if (!name || !sku || !price) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    // Check if SKU already exists
    const existingProduct = await productsCollection.findOne({ sku });
    if (existingProduct) {
      return new Response(
        JSON.stringify({ error: 'SKU already exists' }),
        { status: 400 }
      );
    }

    // Create product
    // Normalize images: ensure only one isPrimary
    let normalizedImages = Array.isArray(images) ? images.map(img => ({ ...img })) : [];
    if (normalizedImages.length > 0 && !normalizedImages.some(i => i.isPrimary)) {
      normalizedImages[0].isPrimary = true;
    }

    const result = await productsCollection.insertOne({
      name,
      sku,
      description: description || '',
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
      category: category || '',
      customFieldValues: customFieldValues || {},
      images: normalizedImages,
      createdBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: 'Product created successfully',
        product: {
          id: result.insertedId,
          name,
          sku,
          price,
          quantity,
          images: Array.isArray(images) ? images : [],
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    const products = await productsCollection.find({}).toArray();

    return new Response(
      JSON.stringify({ products }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get products error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
