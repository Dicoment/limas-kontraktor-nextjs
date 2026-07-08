import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 2 * 2048 * 2048; // 2MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang dikirim.' }, { status: 400 });
    }

    // Validasi tipe
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipe file tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau SVG.' }, { status: 400 });
    }

    // Validasi ukuranD
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Ukuran file maksimal 2MB.' }, { status: 400 });
    }

    // Buat nama file unik — timestamp + nama asli (sanitized)
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-').toLowerCase();
    const uniqueName = `${Date.now()}-${originalName}`;

    // Pastikan folder untuk upload ada
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Tulis nama file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({
      url,
      name: uniqueName,
      size: file.size,
      originalName: file.name,
    }, { status: 201 });

  } catch (err: any) {
    console.error('Upload API Error:', err);
    return NextResponse.json({ error: err.message || 'Upload gagal.' }, { status: 500 });
  }
}