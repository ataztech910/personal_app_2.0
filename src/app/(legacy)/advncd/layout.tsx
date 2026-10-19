import advncdContent from "@/lib/content/advncd.en.json";
import AdvncdSectionLinks from "./components/AdvncdSectionLinks";

export default function AdvncdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mi-advncd-area mi-section mi-padding-top mi-padding-bottom">
      <div className="container">
        <header className="mi-advncd-header">
          <h5 className="mi-advncd-brand">{advncdContent.brand.name}</h5>
          <p className="mi-advncd-eyebrow">{advncdContent.brand.tagline}</p>
          <AdvncdSectionLinks />
        </header>

        <main className="mi-advncd-main">{children}</main>

        <footer className="mi-advncd-footer">
          <AdvncdSectionLinks />
          <p>
            <b>Last updated:</b> {advncdContent.privacy.effectiveDate}
          </p>
          <p>
            <b>{advncdContent.footer.supportLabel}:</b>{" "}
            <a href={`mailto:${advncdContent.footer.supportEmail}`}>
              {advncdContent.footer.supportEmail}
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
