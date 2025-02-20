import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    [
        {
          title: "HTML5",
          value: 95,
        },
        {
          title: "CSS3",
          value: 90,
        },
        {
          title: "Javascript",
          value: 70,
        },
        {
          title: "jQuery",
          value: 85,
        },
        {
          title: "ReactJS",
          value: 80,
        },
        {
          title: "Photoshop",
          value: 65,
        },
      ]
  );
}
