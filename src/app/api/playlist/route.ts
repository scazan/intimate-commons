import { NextResponse } from 'next/server';
import { generatePlaylist } from '@/lib/storage';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Generate playlist from bucket
    const playlist = await generatePlaylist('intimate-commons-prod');
    
    // Save playlist to public folder
    const publicPath = path.join(process.cwd(), 'public', 'playlist.json');
    await writeFile(publicPath, JSON.stringify(playlist, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      playlist,
      message: 'Playlist generated and saved to /public/playlist.json' 
    });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate playlist' 
    }, { status: 500 });
  }
}