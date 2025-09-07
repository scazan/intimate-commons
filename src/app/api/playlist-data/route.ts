import { NextResponse } from 'next/server';
import { generatePlaylist } from '@/lib/storage';

export async function GET() {
  try {
    // Generate fresh playlist from bucket (never use cache)
    const playlist = await generatePlaylist('intimate-commons-prod');
    
    const response = NextResponse.json(playlist);
    
    // Prevent caching with multiple cache-control headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    const errorResponse = NextResponse.json({ 
      error: 'Failed to fetch playlist',
      tracks: []
    }, { status: 500 });
    
    // Also prevent caching of error responses
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');
    
    return errorResponse;
  }
}