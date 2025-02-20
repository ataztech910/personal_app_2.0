import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    phoneNumbers: ["+012-3456-7891", "+012-3456-7892"],
    emailAddress: ["admin.sitename@example.com", "info.sitename@example.com"],
    address: "121 King Street, Melbourne, Victoria 3000, Australia",
  }
  );
}
