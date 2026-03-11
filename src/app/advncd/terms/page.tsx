import type { Metadata } from "next";
import Sectiontitle from "@/app/components/Sectiontitle";
import advncdContent from "@/lib/content/advncd.en.json";

export const metadata: Metadata = {
  title: "Terms of Service | ADVNCD CLI",
  description: "Terms of Service for ADVNCD CLI.",
};

export default function AdvncdTermsPage() {
  const { terms } = advncdContent;

  return (
    <>
      <Sectiontitle title={terms.title} />
      <div className="mi-advncd-prose">
        <p className="mi-advncd-effective-date">
          <b>Effective date:</b> {terms.effectiveDate}
        </p>
        <p>{terms.intro}</p>

        {terms.sections.map((section) => (
          <section className="mi-advncd-section" key={section.heading}>
            <h5>{section.heading}</h5>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
