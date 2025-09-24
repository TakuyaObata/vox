import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txid, openerId } = body;

    if (!txid || !openerId) {
      return NextResponse.json(
        { error: 'Missing required fields: txid and openerId' },
        { status: 400 }
      );
    }

    // const supabase = createServerClient();
    // const { data: letter, error: letterError } = await supabase
    //   .from('letters')
    //   .select('id, bucket_id')
    //   .eq('txid', txid)
    //   .single();

    // if (letterError || !letter) {
    //   return NextResponse.json(
    //     { error: 'Letter not found' },
    //     { status: 404 }
    //   );
    // }

    // const { data: existingOpening } = await supabase
    //   .from('openings')
    //   .select('id')
    //   .eq('txid', txid)
    //   .eq('opener_id', openerId)
    //   .single();

    // if (existingOpening) {
    //   return NextResponse.json(
    //     { error: 'Letter already opened by this user' },
    //     { status: 409 }
    //   );
    // }

    // const { data: opening, error: openingError } = await supabase
    //   .from('openings')
    //   .insert({
    //     txid,
    //     opener_id: openerId
    //   })
    //   .select()
    //   .single();

    // if (openingError) {
    //   console.error('Database error:', openingError);
    //   return NextResponse.json(
    //     { error: 'Failed to record opening' },
    //     { status: 500 }
    //   );
    // }

    // await supabase
    //   .from('telemetry')
    //   .insert({
    //     event: 'decrypt',
    //     txid,
    //     bucket_id: letter.bucket_id,
    //     meta: {
    //       opener_id: openerId
    //     }
    //   });

    return NextResponse.json({
      success: true,
      openingId: 'mock_opening_id',
      message: 'Opening recorded successfully'
    });

  } catch (error) {
    console.error('Opening recording error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
