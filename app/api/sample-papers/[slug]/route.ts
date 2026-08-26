import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPaperBySlug } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const paper = await getPaperBySlug(slug);
  if (!paper) {
    return new Response("Paper not found", { status: 404 });
  }

  const download = request.nextUrl.searchParams.get("download") === "1";
  const fileName = paper.file_path.replace(/^\/+/, "");
  const localPath = path.join(process.cwd(), "public", "sample-papers", path.basename(fileName));

  try {
    const bytes = await readFile(localPath);
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${path.basename(fileName)}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    const supabase = await createClient();
    if (!supabase) {
      return new Response("PDF file is missing", { status: 404 });
    }
    const { data, error } = await supabase.storage
      .from("sample-papers")
      .createSignedUrl(fileName, 60, {
        download: download ? path.basename(fileName) : undefined,
      });
    if (error || !data?.signedUrl) {
      return new Response("Unable to open this PDF", { status: 404 });
    }
    return Response.redirect(data.signedUrl, 302);
  }
}
