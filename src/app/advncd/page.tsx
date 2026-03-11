import type { Metadata } from "next";
import Sectiontitle from "@/app/components/Sectiontitle";
import advncdContent from "@/lib/content/advncd.en.json";

export const metadata: Metadata = {
  title: "ADVNCD CLI | OAuth Verification",
  description:
    "Public application information for ADVNCD CLI Google OAuth verification.",
};

export default function AdvncdHomePage() {
  return (
    <>
      <Sectiontitle title={advncdContent.home.title} />
      <div className="mi-advncd-prose">
        <h5>{advncdContent.brand.tagline}</h5>
        {advncdContent.home.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="row mt-30-reverse mb-30">
        {advncdContent.home.highlights.map((item) => (
          <div className="col-lg-4 col-md-6 col-12 mt-30" key={item.title}>
            <article className="mi-service mi-advncd-card h-100">
              <h5>{item.title}</h5>
              <p>{item.description}</p>
            </article>
          </div>
        ))}
      </div>

      <div className="mi-advncd-note">
        <p>{advncdContent.home.subtitle}</p>
      </div>
    </>
  );
}
