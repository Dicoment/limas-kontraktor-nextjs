import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function GET() {
  try {
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
            url: `/uploads/${name}`,
            createdAt: stats.birthtime,
          };
        }
        return null;
      })
    );

    const validFiles = files.filter(Boolean) as any[];
    validFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ data: validFiles });
  } catch (err: any) {
    console.error("Media API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const filenames: string[] = Array.isArray(body?.filenames) ? body.filenames : [];

    if (filenames.length === 0) {
      return NextResponse.json({ error: "Tidak ada file yang dipilih." }, { status: 400 });
    }

    let deletedCount = 0;
    const failed: string[] = [];

    for (const rawName of filenames) {
      // path.basename mencegah path traversal (misal "../../../etc/passwd")
      const safeName = path.basename(rawName);
      const filePath = path.join(uploadDir, safeName);

      // Pastikan path hasil join tetap di dalam uploadDir
      if (!filePath.startsWith(uploadDir)) {
        failed.push(rawName);
        continue;
      }

      try {
        await fs.unlink(filePath);
        deletedCount++;
      } catch (err) {
        console.error(`Gagal hapus file ${safeName}:`, err);
        failed.push(rawName);
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      failed,
    });
  } catch (err: any) {
    console.error("Media DELETE Error:", err);
    return NextResponse.json({ error: err.message || "Gagal menghapus file." }, { status: 500 });
  }
}