import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bytes = parseInt(searchParams.get('bytes') || '0');

    if (bytes <= 0) {
      return NextResponse.json(
        { error: 'Valid bytes parameter is required' },
        { status: 400 }
      );
    }

    
    const arPricePerByte = 0.000001; // Mock price in AR per byte
    const arToUsdRate = 25.50; // Mock AR to USD exchange rate
    
    const costAr = bytes * arPricePerByte;
    const costUsd = costAr * arToUsdRate;
    const costJpy = costUsd * 150; // Mock USD to JPY rate

    const bufferMultiplier = 1.1;
    const finalCostAr = costAr * bufferMultiplier;
    const finalCostUsd = costUsd * bufferMultiplier;
    const finalCostJpy = costJpy * bufferMultiplier;

    return NextResponse.json({
      bytes,
      cost: {
        ar: Math.round(finalCostAr * 1000000) / 1000000, // 6 decimal places
        usd: Math.round(finalCostUsd * 100) / 100, // 2 decimal places
        jpy: Math.round(finalCostJpy)
      },
      rates: {
        arPerByte: arPricePerByte,
        arToUsd: arToUsdRate,
        usdToJpy: 150
      },
      timestamp: new Date().toISOString(),
      network: 'irys-mainnet'
    });

  } catch (error) {
    console.error('Fee estimation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
