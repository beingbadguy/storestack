import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";

export const singlePhotoUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosClient.post(
      API_ENDPOINTS.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response?.data?.data || null;
  } catch (error) {
    console.log(error);
  }
};
