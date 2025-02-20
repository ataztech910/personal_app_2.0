import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
        workingExperience: [
          {
            id: 1,
            year: "2018 - Present",
            position: "Frontend Web Developer",
            company: "Abc Company",
            details:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.",
          },
          {
            id: 2,
            year: "2016 - 2018",
            position: "Frontend Web Developer",
            company: "CBA Company",
            details:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.",
          },
          {
            id: 3,
            year: "2014 - 1016",
            position: "UI/UX Designer",
            company: "Example Company",
            details:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.",
          },
        ],
        educationExperience: [
          {
            id: 1,
            year: "2018 - 2019",
            graduation: "Master of Science",
            university: "Abc University",
            details:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.",
          },
          {
            id: 2,
            year: "2016 - 2018",
            graduation: "Bachelor of Science",
            university: "Abc University",
            details:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.",
          },
          {
            id: 3,
            year: "2015 - 2016",
            graduation: "Higher Schoold Graduation",
            university: "Abc College",
            details:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.",
          },
        ],
      }
  );
}
