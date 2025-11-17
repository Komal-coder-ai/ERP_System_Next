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

    // Accept ID from route params or ?id= query
    let fieldId = params?.id;
    if (!fieldId || fieldId === '[id]') {
      const { searchParams } = new URL(req.url);
      fieldId = searchParams.get('id');
    }

    if (!fieldId) {
      return new Response(
        JSON.stringify({ error: 'Field ID required' }),
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(fieldId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid field ID format' }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const fieldsCollection = db.collection('custom_fields');

    const field = await fieldsCollection.findOne({ _id: new ObjectId(fieldId) });
    if (!field) {
      return new Response(
        JSON.stringify({ error: 'Field not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ field }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get custom field error:', error);
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

    const { searchParams } = new URL(req.url);
    const fieldId = searchParams.get('id');

    if (!fieldId) {
      return new Response(
        JSON.stringify({ error: 'Field ID required' }),
        { status: 400 }
      );
    }

    const { fieldName, fieldType, options } = await req.json();

    const { db } = await connectToDatabase();
    const fieldsCollection = db.collection('custom_fields');

    const result = await fieldsCollection.updateOne(
      { _id: new ObjectId(fieldId) },
      {
        $set: {
          fieldName: fieldName || undefined,
          fieldType: fieldType || undefined,
          options: options || undefined,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Field not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Field updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update field error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
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

    const { searchParams } = new URL(req.url);
    const fieldId = searchParams.get('id');

    if (!fieldId) {
      return new Response(
        JSON.stringify({ error: 'Field ID required' }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const fieldsCollection = db.collection('custom_fields');

    const result = await fieldsCollection.deleteOne({
      _id: new ObjectId(fieldId),
    });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Field not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Field deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete field error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
