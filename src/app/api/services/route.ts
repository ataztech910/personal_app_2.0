import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      title: "Full Stack Development",
      icon: "brush-alt",
      details:
        "I specialize in building modern, dynamic web applications using the latest technologies. With expertise in Next.js and Deno, I can help you develop full-stack solutions that are fast, scalable, and maintainable. Whether you need a custom web application or an e-commerce platform, I am committed to delivering high-quality results tailored to your needs.",
    },
    {
      title: "Software Development Consulting and Education",
      icon: "code",
      details:
        "I offer expert consulting to help you navigate complex software development challenges. From architectural decisions to optimizing workflows, I provide actionable insights that help you move your project forward. Additionally, I offer educational services to individuals or teams looking to enhance their skills in software development.",
    },
    {
      title: "Cross-Platform Development",
      icon: "mobile",
      details:
        "I develop cross-platform mobile and desktop applications using React Native, Tauri, and Electron. With my experience, I can help you build applications that run seamlessly across different platforms, reducing development time and cost while ensuring a native-like experience for your users.",
    },
    {
      title: "E2E Testing",
      icon: "mobile",
      details:
        "I ensure your applications are thoroughly tested and ready for production with end-to-end testing frameworks like Playwright, Cypress, Detox, and Maestro. My testing services ensure that your applications are not only functional but also user-friendly and error-free, offering a smooth experience for your users.",
    },
  ]);
}
