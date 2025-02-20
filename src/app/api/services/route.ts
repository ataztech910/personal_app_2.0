import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
      {
        title: "Frontend Consulting",
        icon: "brush-alt",
        details:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.",
      },
      {
        title: "Frontend Development",
        icon: "code",
        details:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.",
      },
      {
        title: "Mobile Application",
        icon: "mobile",
        details:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.",
      },
      {
          title: "E2E tests with Playwright or Cypress",
          icon: "mobile",
          details:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.",
      },
    ]
  );
}
