import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads'); 
    
    try {
      await fs.access(uploadDir);
    } catch {
      return NextResponse.json({ data: [] });
    }

    const filenames = await fs.readdir(uploadDir);
    
    const files = await Promise.all(
      filenames.map(async (name) => {
        const fullPath = path.join(uploadDir, name);
        const stats = await fs.stat(fullPath);
        // Hanya proses jika file biasa (bukan direktori)
        if (stats.isFile() && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name)) {
          return {
            id: name,
            name: name,
            size: stats.size,
            url: `/uploads/${name}`, // Next.js otomatis melayani ini dari public/uploads
            createdAt: stats.birthtime
          };
        }
        return null;
      })
    );

    // Filter null dan urutkan dari yang terbaru
    const validFiles = files.filter(Boolean) as any[];
    validFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ data: validFiles });
  } catch (err: any) {
    console.error("Media API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}