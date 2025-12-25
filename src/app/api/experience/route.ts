import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    workingExperience: [
      {
        id: 1,
        year: "Apr 2025 - Present",
        position: "Senior Software Engineer (Mobile Agent / RUM / React Native)",
        company: "Dynatrace",
        details:
          "Working in the Mobile Agent team on Real User Monitoring (RUM) and observability for React Native. Focused on improving mobile performance and user experience through data-driven insights and mobile monitoring innovation.",
      },
      {
        id: 2,
        year: "Sep 2007 - Present",
        position: "Full Stack Engineer",
        company: "Freelance (Self-employed)",
        details:
          "Building and deploying corporate web applications and services. Frontend: TypeScript / React / Next.js. Backend: TypeScript (Node.js / NestJS) or Go. Created an npm library for Notion→HTML parsing (notion-to-html). Built personal projects (Next.js + AWS Amplify + Contentful) and a Chrome extension for Telegra.ph-based blogging.",
      },
      {
        id: 3,
        year: "Sep 2022 - Apr 2025",
        position: "Senior Frontend Developer / Technical Architect",
        company: "IBM iX DACH",
        details:
          "High-end frontend development and consulting for leading global brands. Worked with modern tooling and enterprise platforms, contributed to large-scale delivery, and mentored teammates while strengthening architecture and best practices across projects.",
      },
      {
        id: 4,
        year: "Jan 2022 - Aug 2022",
        position: "Senior Frontend Developer / Technical Product Lead",
        company: "KINNOVIS GmbH",
        details:
          "Architected a configuration-driven application approach using an SDK to define app behavior via JSON, reducing maintenance and simplifying onboarding. Designed CRUD architecture and improved maintainability by shifting from screen-heavy implementation to configuration logic.",
      },
      {
        id: 5,
        year: "Nov 2019 - Dec 2021",
        position: "Senior Software Developer",
        company: "Dynatrace",
        details:
          "Built developer-focused tooling used by thousands of developers worldwide. Delivered “developers for developers” solutions, improved internal productivity, and contributed to scalable frontend tooling and workflows.",
      },
      {
        id: 6,
        year: "May 2019 - Nov 2019",
        position: "Senior FullStack Developer",
        company: "NBH Markets EU Ltd",
        details:
          "Built a gold trading platform from scratch under strict deadlines. Defined architecture for a modern web stack: Vue.js / Nuxt, Storybook, Strapi, GraphQL; CRM built with Laravel and Bootstrap.",
      },
      {
        id: 7,
        year: "Jul 2018 - May 2019",
        position: "Team Lead",
        company: "ForexTime (FXTM)",
        details:
          "Built and led a mobile development team from zero to production for the FXTM Trading Mobile App. Implemented CI/CD with GitLab and Fastlane, transitioned processes from Kanban to Scrum for support, and established a robust Redux-based architecture for hybrid mobile development.",
      },
      {
        id: 8,
        year: "Sep 2017 - Jul 2018",
        position: "Front End Developer",
        company: "ForexTime (FXTM)",
        details:
          "Worked on a large legacy private area of the broker platform (my.forextime.com). Refactored performance-critical parts, improved mobile-first experience, and introduced Karma tests for key Angular components. Promoted in under a year.",
      },
      {
        id: 9,
        year: "Oct 2017 - Jun 2018",
        position: "Education Mentor (Android Development)",
        company: "Mail.Ru Group (GeekBrains.ru)",
        details:
          "Mentored students in Android development courses, helping them build practical skills and ship learning projects with production-oriented guidance.",
      },
      {
        id: 10,
        year: "Jun 2016 - Aug 2017",
        position: "Software Engineer Team Lead",
        company: "socpack.ru",
        details:
          "Led development for a Russian coupon portal. Tech: Angular, Laravel, AdonisJS. Responsibilities included planning, architecture, hiring/interviews, and mentoring the team through delivery.",
      },
      {
        id: 11,
        year: "Aug 2015 - Aug 2017",
        position: "Education Mentor",
        company: "Samsung",
        details:
          "Mentored students to develop and publish Android applications and supported an educational program focused on practical delivery and teamwork.",
      },
      {
        id: 12,
        year: "Jul 2015 - 2016",
        position: "Co-Founder / CTO",
        company: "Questura.ru",
        details:
          "Co-founded an escape room aggregator with referral and partner programs. Built the product using Laravel and AngularJS and handled core technical decisions and delivery.",
      },
      {
        id: 13,
        year: "Sep 2013 - 2015",
        position: "Associate Founder / CTO",
        company: "NuArz.COM",
        details:
          "Co-founded a web agency. Managed clients, delivered websites and mobile apps, and maintained legacy systems. Tech included PHP, JavaScript, and Ionic 1.",
      },
      {
        id: 14,
        year: "Sep 2011 - Jan 2013",
        position: "Head of Software Development",
        company: "ООО ПО Уралпрофиль",
        details:
          "Led a software development department (10+ people). Researched and integrated automation solutions for manufacturing, and managed hiring/interviews and team execution. Tech: JavaScript, PHP, C#, Java.",
      },
      {
        id: 15,
        year: "2009 - 2011",
        position: "Software Engineer Team Lead",
        company: "ELL.RU",
        details:
          "Led engineering work and supported delivery of web solutions, coordinating development tasks and improving implementation quality across projects.",
      },
    ],
    educationExperience: [
      {
        id: 1,
        year: "2001 - 2006",
        graduation: "Bachelor's degree, Computational and Applied Mathematics",
        university: "Ural State Mining University (former Academy of Mining and Geology)",
        details:
          "Bachelor’s program focused on computational and applied mathematics. Participated in software development hackathons and built a strong foundation for engineering problem-solving and system thinking.",
      },
    ],
  });
}