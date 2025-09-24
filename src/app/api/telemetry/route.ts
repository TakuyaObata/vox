import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, txid, bucketId, value, meta } = body;

    if (!event) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    const validEvents = ['sent', 'found', 'decrypt', 'view', 'status'];
    if (!validEvents.includes(event)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    
    // const { data, error } = await supabase
    //   .from('telemetry')
    //   .insert({
    //     event,
    //     txid: txid || null,
    //     bucket_id: bucketId || null,
    //     value: value || null,
    //     meta: meta || null
    //   })
    //   .select()
    //   .single();

    // if (error) {
    //   console.error('Telemetry error:', error);
    //   return NextResponse.json(
    //     { error: 'Failed to record telemetry' },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({
      success: true,
      id: 'mock_telemetry_id'
    });

  } catch (error) {
    console.error('Telemetry recording error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
