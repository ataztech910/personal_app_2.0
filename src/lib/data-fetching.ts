import axios from "axios";

export async function getInformation() {
  try {
    const response = await axios.get(`http:/localhost:3000/api/information`);
    return response.data.information;
  } catch (error) {
    console.error("Error fetching information:", error);
    return {};
  }
}

export async function getServices() {
  try {
    const response = await axios.get(`http:/localhost:3000/api/services`);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}


export async function getSkills() {
  try {
    const response = await axios.get(`http:/localhost:3000/api/skills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getExperience() {
  try {
    const response = await axios.get(`http:/localhost:3000/api/experience`);
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
    const response = await axios.get(`http:/localhost:3000/api/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
