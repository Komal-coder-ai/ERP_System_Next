import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
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

    const productId = params.id;

    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'Product ID required' }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ product }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get product error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
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

    const productId = params.id;

    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'Product ID required' }),
        { status: 400 }
      );
    }

    const { name, sku, description, price, quantity, category, customFieldValues, images } = await req.json();

    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    // Normalize images so only one isPrimary
    let normalizedImages = Array.isArray(images) ? images.map(img => ({ ...img })) : undefined;
    if (Array.isArray(normalizedImages)) {
      if (normalizedImages.length > 0 && !normalizedImages.some(i => i.isPrimary)) {
        normalizedImages[0].isPrimary = true;
      }
    }

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          name: name || undefined,
          sku: sku || undefined,
          description: description || undefined,
          price: price ? parseFloat(price) : undefined,
          quantity: quantity ? parseInt(quantity) : undefined,
          category: category || undefined,
          customFieldValues: customFieldValues || undefined,
          images: normalizedImages || undefined,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Product updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update product error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
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

    const productId = params.id;

    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'Product ID required' }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    const result = await productsCollection.deleteOne({
      _id: new ObjectId(productId),
    });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Product deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete product error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
