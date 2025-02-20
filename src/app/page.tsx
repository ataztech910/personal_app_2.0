
import Sectiontitle from "./components/Sectiontitle";
import Service from "./components/Service";
import { getInformation, getServices } from "@/lib/data-fetching";
import MainImage from "./components/MainImage";

export default async function Home() {
  const information = await getInformation();
  const services = await getServices();

  return (
    <div>
      <div className="mi-about-area mi-section mi-padding-top">
        <div className="container">
          <Sectiontitle title="About Me" />
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mi-about-image">
                <MainImage information={information} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mi-about-content">
                <h3>
                  I am <span className="color-heading">{information.name}</span>
                </h3>
                <p>
                  I am a frontend web developer. I can provide clean code and
                  pixel perfect design. I also make websites more & more
                  interactive with web animations.
                </p>
                <ul>
                  {information.name && <li><b>Full Name:</b> {information.name}</li>}
                  {information.age && <li><b>Age:</b> {information.age} Years</li>}
                  {information.phone && <li><b>Phone:</b> {information.phone}</li>}
                  {information.nationality && <li><b>Nationality:</b> {information.nationality}</li>}
                  {information.language && <li><b>Languages:</b> {information.language}</li>}
                  {information.email && <li><b>Email:</b> {information.email}</li>}
                  {information.address && <li><b>Address:</b> {information.address}</li>}
                  {information.freelanceStatus && <li><b>Freelance:</b> {information.freelanceStatus}</li>}
                </ul>
                {information.cvfile && (
                  <a href={information.cvfile} className="mi-button">
                    Download CV
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mi-service-area mi-section mi-padding-top">
        <div className="container">
          <Sectiontitle title="Services" />
          <div className="mi-service-wrapper">
            <div className="row mt-30-reverse mb-30">
              {services.map((service: any) => (
                <div className="col-lg-4 col-md-6 col-12 mt-30" key={service.title}>
                  <Service content={service} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
