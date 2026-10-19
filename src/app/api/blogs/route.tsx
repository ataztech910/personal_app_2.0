import { NextResponse } from "next/server";
import { blogPosts } from "@/lib/blog-posts";

export async function GET() {
  return NextResponse.json(blogPosts);
}
