import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('video') as unknown as File;
    const thumbFile: File | null = data.get('thumbnail') as unknown as File; // New
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No video file provided" }, { status: 400 });
    }

    const saveFileLocally = async (fileObj: File, subDir: string) => {
      const bytes = await fileObj.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(fileObj.name) || (subDir === 'images' ? '.jpg' : '.mp4');
      const filename = `${subDir === 'images' ? 'thumb' : 'video'}-${uniqueSuffix}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
      
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      return `/uploads/${subDir}/${filename}`;
    };

    const videoUrl = await saveFileLocally(file, 'videos');
    let thumbnailUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"; // fallback

    if (thumbFile) {
      thumbnailUrl = await saveFileLocally(thumbFile, 'images');
    }

    return NextResponse.json({ success: true, videoUrl, thumbnailUrl });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
