"use client";

import { useState } from "react";

type ShowOffItem = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  cta: string;
  image?: string;
};

type DevWorldVideo = {
  title: string;
  youtubeId: string;
};

const showOffItems: ShowOffItem[] = [
  {
    title: "Published author (2 books)",
    subtitle: "Next.js & 3D Web Development",
    description:
      "Books on building scalable, production-ready apps with Next.js and end-to-end 3D web experiences with Three.js + Next.js.",
    href: "https://www.amazon.de/-/en/Development-Three-js-Next-js-end-end/dp/9365895065/",
    cta: "View on Amazon",
    image: "/showoff-books.png",
  },
  {
    title: "Tofo",
    subtitle: "Engine of synthetic assistants",
    description:
      "From idea to Go/No-Go in minutes. Tofo assembles a team of synthetic experts — a CTO, financial analyst, skeptic, growth PM — tailored to your domain. They analyze independently, debate, and deliver a full breakdown: risks ranked by severity, follow-up questions, and an implementation plan when you're ready to move.",
    href: "https://tofo.dev",
    cta: "Visit tofo.dev",
    image: "/showoff-tofo.png",
  },
  {
    title: "ADVNCD platform",
    subtitle: "Amplify-like DX for Google Cloud",
    description:
      "Advncd is a local-first developer platform designed for Go applications on Google Cloud. The platform provides a single-binary CLI that handles OAuth authentication, project configuration, and deployments to Cloud Run using direct Google Cloud APIs.",
    href: "https://advncd-docs.vercel.app/",
    cta: "Open docs",
    image: "/showoff-advncd.png",
  },
];

const devWorldVideos: DevWorldVideo[] = [
  { title: "Killing Wasted Re-renders With Production Hook Instrumentation", youtubeId: "Me0m6WMQ80g" },
  { title: "The New Frontend Stack: Humans, AI, and Prompts", youtubeId: "UhSfwrvZNJc" },
  { title: "AST + AI = Developer Co-Pilot 2.0", youtubeId: "l1mLz1DaWlw" },
];

function ShowOffCard({ item }: { item: ShowOffItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="mi-service mi-service-card h-100"
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.image && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            opacity: hovered ? 0.18 : 0,
            transition: "opacity 0.4s ease-out",
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative" }}>
        <h5 className="mb-2">{item.title}</h5>
        <h6 className="mb-3 color-heading">{item.subtitle}</h6>
        <p className="mb-4">{item.description}</p>
        <a className="mi-button mi-button-small" href={item.href} target="_blank" rel="noreferrer">
          {item.cta}
        </a>
      </div>
    </div>
  );
}

function YouTubeEmbed({ video }: { video: DevWorldVideo }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ margin: 0, fontWeight: 600, color: "var(--color-heading, #fff)" }}>
        {video.title}
      </p>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
          borderRadius: "4px",
          border: "1px solid #2e344e",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </div>
    </div>
  );
}

export default function ShowOff() {
  return (
    <div>
      <div className="mi-service-wrapper">
        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ fontWeight: 700, marginBottom: "4px" }}>DevWorld 2026</h4>
          <p style={{ margin: 0, opacity: 0.7 }}>Conference talks</p>
        </div>
        <div className="row mt-30-reverse">
          {devWorldVideos.map((video) => (
            <div className="col-lg-6 col-12 mt-30" key={video.youtubeId}>
              <YouTubeEmbed video={video} />
            </div>
          ))}
        </div>
      </div>

      <div className="mi-service-wrapper" style={{ marginTop: "60px" }}>
        <div className="row mt-30-reverse mb-30">
          {showOffItems.map((item) => (
            <div className="col-lg-4 col-md-6 col-12 mt-30" key={item.title}>
              <ShowOffCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
