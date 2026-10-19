import type { Metadata } from "next";
import Sectiontitle from "@/app/components/Sectiontitle";
import advncdContent from "@/lib/content/advncd.en.json";

export const metadata: Metadata = {
  title: "Privacy Policy | ADVNCD CLI",
  description: "Privacy Policy for ADVNCD CLI Google OAuth usage.",
};

export default function AdvncdPrivacyPage() {
  const { privacy } = advncdContent;

  return (
    <>
      <Sectiontitle title={privacy.title} />
      <div className="mi-advncd-prose">
        <p className="mi-advncd-effective-date">
          <b>Effective date:</b> {privacy.effectiveDate}
        </p>
        <p>{privacy.intro}</p>

        {privacy.sections.map((section) => (
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
