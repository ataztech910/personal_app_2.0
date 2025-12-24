import axios from "axios";

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getInformation() {
  try {
    const response = await axios.get(`${baseUrl}/api/information`);
    return response.data.information;
  } catch (error) {
    console.error("Error fetching information:", error);
    return {};
  }
}

export async function getServices() {
  try {
    const response = await axios.get(`${baseUrl}/api/services`);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getSkills() {
  try {
    const response = await axios.get(`${baseUrl}/api/skills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getExperience() {
  try {
    const response = await axios.get(`${baseUrl}/api/experience`);
    return {
      workingExperience: response.data.workingExperience || [],
      educationExperience: response.data.educationExperience || [],
    };
  } catch (error) {
    console.error("Error fetching experience:", error);
    return { workingExperience: [], educationExperience: [] };
  }
}

export async function getBlogs() {
  try {
    const response = await axios.get(`${baseUrl}/api/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
