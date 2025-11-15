import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

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

    const { fieldName, fieldType, options } = await req.json();

    if (!fieldName || !fieldType) {
      return new Response(
        JSON.stringify({ error: 'Field name and type are required' }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const fieldsCollection = db.collection('custom_fields');

    // Check if field already exists
    const existingField = await fieldsCollection.findOne({ fieldName });
    if (existingField) {
      return new Response(
        JSON.stringify({ error: 'Field already exists' }),
        { status: 400 }
      );
    }

    // Create custom field
    const result = await fieldsCollection.insertOne({
      fieldName,
      fieldType, // text, number, radio, checkbox
      options: options || [], // For radio/checkbox
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: 'Custom field created successfully',
        field: {
          id: result.insertedId,
          fieldName,
          fieldType,
          options: options || [],
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create custom field error:', error);
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
    const fieldsCollection = db.collection('custom_fields');

    const fields = await fieldsCollection.find({}).toArray();

    return new Response(
      JSON.stringify({ fields }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get custom fields error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
