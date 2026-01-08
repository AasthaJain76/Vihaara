import axiosInstance from "../utils/axiosInstance";



// 🟢 Fetch current user’s profile
export const getMyProfile = async () => {
  const res = await axiosInstance.get('/profile/me');
  return res.data;
};

// ✏️ Update or create profile
export const updateMyProfile = async (profileData) => {
  const res = await axiosInstance.put('/profile/me', profileData);
  return res.data;
};

// 🔍 Get another user’s profile by ID
export const getProfileById = async (userId) => {
  const res = await axiosInstance.get(`/profile/${userId}`);
  return res.data;
};

// ❌ Delete my profile
export const deleteMyProfile = async () => {
  const res = await axiosInstance.delete('/profile/me');
  return res.data;
};
