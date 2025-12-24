import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    phoneNumbers: ["+012-3456-7891", "+012-3456-7892"],
    emailAddress: ["info@andreitazetdinov.com"],
    address: "https://buymeacoffee.com/ataztech910",
    socialMedia: [
      {
        link: "https://www.linkedin.com/in/andrei-tazetdinov-9710bb6a/",
        name: "LinkedIn",
        icon: faLinkedin
      }, 
      { 
        link: "https://github.com/ataztech910",
        name: "GitHub",
        icon: faGithub
      }
    ]
  }
  );
}
