import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
      {
        id: 1,
        content:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita impedit nobis tempore quaerat quibusdam, aliquid maxime tempora.",
        author: {
          name: "Burdette Turner",
          designation: "Web Developer, Abc Company",
        },
      },
      {
        id: 2,
        content:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita impedit nobis tempore quaerat quibusdam.",
        author: {
          name: "Susan Yost",
          designation: "Client",
        },
      },
      {
        id: 3,
        content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        author: {
          name: "Irving Feeney",
          designation: "Fiverr Client",
        },
      },
    ]
  );
}
