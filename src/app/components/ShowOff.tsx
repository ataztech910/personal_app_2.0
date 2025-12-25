type ShowOffItem = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  cta: string;
};

const showOffItems: ShowOffItem[] = [
  {
    title: "Published author (2 books)",
    subtitle: "Next.js & 3D Web Development",
    description:
      "Books on building scalable, production-ready apps with Next.js and end-to-end 3D web experiences with Three.js + Next.js.",
    href: "https://www.amazon.de/-/en/Development-Three-js-Next-js-end-end/dp/9365895065/",
    cta: "View on Amazon",
  },
  {
    title: "TOFO framework",
    subtitle: "Think Once, Flow On (Deno)",
    description:
      "A lightweight API framework with file-based routing, dynamic routes, zero-config setup, middleware support, and simple views (ETA). Includes benchmark notes (15k+ req/sec, <2ms avg latency).",
    href: "https://github.com/AchoraSoft/tofo",
    cta: "View on GitHub",
  },
  {
    title: "ADVNCD platform",
    subtitle: "Amplify-like DX for Google Cloud",
    description:
      "Local-first studio + schema→codegen pipeline that generates TypeScript types, rules/indexes, GraphQL, and ready-to-use React UI. One-click deploy via Terraform and monitoring links. (In documentation stage.)",
    href: "https://advncd-docs.vercel.app/",
    cta: "Open docs",
  },
];

function ShowOffCard({ item }: { item: ShowOffItem }) {
  return (
    <div className="mi-service mi-service-card h-100">
      <h5 className="mb-2">{item.title}</h5>
      <h6 className="mb-3 color-heading">{item.subtitle}</h6>
      <p className="mb-4">{item.description}</p>
      <a className="mi-button mi-button-small" href={item.href} target="_blank" rel="noreferrer">
        {item.cta}
      </a>
    </div>
  );
}

export default function ShowOff() {
  return (
    <div className="mi-service-wrapper">
      <div className="row mt-30-reverse mb-30">
        {showOffItems.map((item) => (
          <div className="col-lg-4 col-md-6 col-12 mt-30" key={item.title}>
            <ShowOffCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}