import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    [
        {
          title: "TypeScript",
          value: 95,
        },
        {
          title: "CSS3",
          value: 90,
        },
        {
          title: "Javascript",
          value: 100,
        },
        {
          title: "React",
          value: 85,
        },
        {
          title: "Angular",
          value: 80,
        },
        {
          title: "React Native",
          value: 75,
        },
      ]
  );
}
