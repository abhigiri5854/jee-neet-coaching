import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
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
  const visitorKey = request.cookies.get("sample-paper-visitor")?.value ?? randomUUID();
  const supabase = await createClient();
  if (supabase) {
    await supabase.rpc(download ? "track_paper_download" : "track_paper_view", {
      p_paper_id: paper.id,
      p_visitor_key: visitorKey,
    });
  }
  const filePath = paper.file_path.replace(/^\/+/, "");
  const localPath = path.join(process.cwd(), "public", "sample-papers", path.basename(filePath));

  try {
    const bytes = await readFile(localPath);
    const response = new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${path.basename(filePath)}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
    if (!request.cookies.get("sample-paper-visitor")) response.cookies.set("sample-paper-visitor", visitorKey, { maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "lax", path: "/" });
    return response;
  } catch {
    if (!supabase) {
      return new Response("PDF file is missing", { status: 404 });
    }
    const { data, error } = await supabase.storage
      .from("sample-papers")
      .createSignedUrl(filePath, 60, {
        download: download ? path.basename(filePath) : undefined,
      });
    if (error || !data?.signedUrl) {
      return new Response("Unable to open this PDF", { status: 404 });
    }
    const response = NextResponse.redirect(data.signedUrl, 302);
    if (!request.cookies.get("sample-paper-visitor")) response.cookies.set("sample-paper-visitor", visitorKey, { maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "lax", path: "/" });
    return response;
  }
}
