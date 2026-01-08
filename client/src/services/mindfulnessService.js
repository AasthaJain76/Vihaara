import axiosInstance from "../utils/axiosInstance";

const API_URL = "/mindfulness/activities";
export const getAllActivities = async () => {
  try {
    const res = await axiosInstance.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching all activities:", err);
    throw err;
  }
};

export const getActivitiesByCategory = async (category) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/${category}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching activities for category ${category}:`, err);
    throw err;
  }
};

export const createActivity = async (data) => {
  try {
    const token = localStorage.getItem("vihaara_token");
    const res = await axiosInstance.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating activity:", err);
    throw err;
  }
};
