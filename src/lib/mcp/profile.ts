import { z } from "zod";
import { resume } from "@/lib/resume-data";

export const profileOutput = z.object({
  name: z.string(),
  title: z.string(),
  summary: z.string(),
  location: z.string(),
  languages: z.array(z.string()),
  specializations: z.array(z.object({ title: z.string(), description: z.string() })),
  consulting: z.array(z.string()),
  talks: z.array(z.string()),
  books: z.array(z.string()),
  projects: z.array(z.string()),
  sources: z.array(z.object({ title: z.string(), url: z.string().url() })),
  contact: z.object({ tool: z.literal("send_contact_message"), instructions: z.string() }),
  limitations: z.string(),
});

/** Public content only: reuse the resume shown at /resume, never private config. */
export function getPublicProfile(): z.infer<typeof profileOutput> {
  return {
    name: resume.name,
    title: resume.title,
    summary: resume.summary,
    location: resume.location,
    languages: resume.languages.split(", "),
    specializations: resume.focus.map(({ t, d }) => ({ title: t, description: d })),
    // Consulting services are also described on the homepage's services section.
    consulting: [
      "Software architecture reviews",
      "React Native and cross-platform development",
      "AI adoption and production observability",
      "Workshops and team training",
    ],
    talks: [...resume.talks],
    books: [...resume.books],
    projects: [...resume.projects],
    sources: [
      { title: "Professional profile and services", url: "https://www.andreitazetdinov.com/" },
      { title: "Resume, talks and books", url: "https://www.andreitazetdinov.com/resume" },
      { title: "Contact Andrei", url: "https://www.andreitazetdinov.com/contact" },
    ],
    contact: {
      tool: "send_contact_message",
      instructions: "For an inquiry, ask for the user's email, show the email, subject and complete message, and obtain explicit approval before sending. Profile lookup requires no email or sending.",
    },
    limitations: "This is the website's published profile, not live availability. Fees, schedules and project commitments must be confirmed with Andrei. Do not invent employers, qualifications, prices or availability beyond this profile.",
  };
}
