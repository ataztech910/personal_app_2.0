import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    brandImage: "/avatar.jpg",
    information: {
      name: "Andrei Tazetdinov",
      aboutContent:
        "I am a frontend web developer. I can provide clean code and pixel perfect design. I also make website more & more interactive with web animations.",
      age: 40,
      phone: "",
      nationality: "Russian",
      language: "English, Russian",
      email: "",
      address: "4020, Linz, Austria",
      freelanceStatus: "Available",
      socialLinks: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        pinterest: "",
        behance: "",
        linkedin: "",
        dribbble: "",
        github: "https://github.com",
      },
      aboutImage: "/images/main_image.jpg",
      aboutImageLg: "/images/main_image.jpg",
      // cvfile: "/files/empty.pdf",
    },
  });
}
