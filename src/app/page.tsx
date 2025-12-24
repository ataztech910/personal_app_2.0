import Sectiontitle from "./components/Sectiontitle";
import Service from "./components/Service";
import { getInformation, getServices } from "@/lib/data-fetching";
import MainImage from "./components/MainImage";
import { calculateAge } from "@/lib/strings";

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
                  I’m a passionate and results-driven Full Stack Developer with
                  extensive experience in creating scalable, robust, and
                  high-performance applications.
                  <br />
                  <br />
                  Over the years, I have honed my skills in various programming
                  languages and frameworks, including Next.js, Deno, and React
                  Native. I take pride in my ability to work on both the
                  front-end and back-end of web applications, delivering
                  seamless user experiences and powerful functionality.
                  <br />
                  <br />
                  Beyond coding, I am dedicated to providing software
                  development consulting and education, helping individuals and
                  teams unlock their full potential. Whether it's guiding you
                  through technical challenges or sharing my insights on best
                  practices, I am here to support your growth in the software
                  development world.
                  <br />
                  <br />
                  With a solid track record in cross-platform development, I
                  have worked with technologies like Tauri and Electron,
                  delivering desktop apps that work seamlessly across multiple
                  platforms.
                  <br />
                  <br />I also specialize in E2E testing, utilizing tools like
                  Playwright, Cypress, Detox, and Maestro to ensure that your
                  applications are bug-free and deliver a flawless user
                  experience. If you're looking for a reliable, versatile
                  developer who thrives on solving complex problems and building
                  quality software, you’ve come to the right place.
                  <br />
                  <br />
                  <b className="font-xl">
                    Let’s create something exceptional together!
                  </b>
                </p>
                <ul>
                  {information.name && (
                    <li>
                      <b>Full Name:</b> {information.name}
                    </li>
                  )}
                  {information.age && (
                    <li>
                      <b>Age:</b> {calculateAge()} Years
                    </li>
                  )}
                  {information.phone && (
                    <li>
                      <b>Phone:</b> {information.phone}
                    </li>
                  )}
                  {information.nationality && (
                    <li>
                      <b>Nationality:</b> {information.nationality}
                    </li>
                  )}
                  {information.language && (
                    <li>
                      <b>Languages:</b> {information.language}
                    </li>
                  )}
                  {information.email && (
                    <li>
                      <b>Email:</b> {information.email}
                    </li>
                  )}
                  {information.address && (
                    <li>
                      <b>Address:</b> {information.address}
                    </li>
                  )}
                  {information.freelanceStatus && (
                    <li>
                      <b>Freelance:</b> {information.freelanceStatus}
                    </li>
                  )}
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
                <div
                  className="col-lg-4 col-md-6 col-12 mt-30"
                  key={service.title}
                >
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
