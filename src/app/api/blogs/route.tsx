import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      title:
        "How to set up Webpack + TypeScript + SCSS to create a simple front-end in a modern way",
      featuredImage:
        "https://miro.medium.com/v2/resize:fit:1400/1*C3vuK0Who-_d8xeNiBnnMQ.jpeg",
      filesource:
        "https://medium.com/@coder_in_austria/how-to-set-up-webpack-typescript-scss-to-create-a-simple-front-end-in-a-modern-way-86850ee3f1c6",
      createDay: "16",
      createMonth: "August",
      createYear: "2023",
    },
    {
      id: 2,
      title:
        "How to create the Taplink-like page for free to use it in your Instagram",
      featuredImage:
        "https://miro.medium.com/v2/resize:fit:1400/1*9O7Itn7mkXkwGPbcBGQbxQ.png",
      filesource:
        "https://medium.com/@coder_in_austria/how-to-create-the-taplink-like-page-for-free-to-use-it-in-your-instagram-4281fd1ffab0",
      createDay: "27",
      createMonth: "August",
      createYear: "2023",
    },
    {
      id: 3,
      title:
        "How to create an online video game for browser, faster than you can imagine",
      featuredImage:
        "https://miro.medium.com/v2/resize:fit:1400/1*fwwRp63vHN23C8ARORAHeQ.jpeg",
      filesource:
        "https://medium.com/@coder_in_austria/how-to-create-an-online-video-game-for-browser-faster-than-you-can-imagine-8529673d3d2c",
      createDay: "22",
      createMonth: "September",
      createYear: "2023",
    },
    {
      id: 4,
      title: "Using the class-transformer for better data architecture",
      featuredImage:
        "https://miro.medium.com/v2/resize:fit:1400/1*6z28ClCYWxilxwsdHddpvg.jpeg",
      filesource:
        "https://medium.com/@coder_in_austria/using-the-class-transformer-for-better-data-architecture-87448f74037a",
      createDay: "20",
      createMonth: "December",
      createYear: "2023",
    },
  ]);
}