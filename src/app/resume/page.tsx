import Sectiontitle from "../components/Sectiontitle";
import Smalltitle from "../components/Smalltitle";

import { getSkills, getExperience } from "@/lib/data-fetching";
import ResumeItem from "../components/ResumeItem";
import Skills from "../components/Skills";

export default async function Resume() {
  const skills = await getSkills();
  const { workingExperience, educationExperience } = await getExperience();

  return (
    <div>
      <div className="mi-skills-area mi-section mi-padding-top">
        <div className="container">
          <Sectiontitle title="My Skills" />
          <div className="mi-skills">
            <div className="row mt-30-reverse">
              <Skills skills={skills} />
            </div>
          </div>
        </div>
      </div>
      <div className="mi-resume-area mi-section mi-padding-top mi-padding-bottom">
        <div className="container">
          <Sectiontitle title="Resume" />
          <Smalltitle title="Working Experience" icon="briefcase" />
          <div className="mi-resume-wrapper">
            {workingExperience.map((workingExp: any) => (
              <ResumeItem key={workingExp.id} resumeData={workingExp} />
            ))}
          </div>
          <div className="mt-30"></div>
          <Smalltitle title="Educational Qualifications" icon="book" />
          <div className="mi-resume-wrapper">
            {educationExperience.map((educationExp: any) => (
              <ResumeItem key={educationExp.id} resumeData={educationExp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
