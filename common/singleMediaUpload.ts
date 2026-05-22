import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";

export const singleMediaUpload = async (file: File | Blob) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post(
      API_ENDPOINTS.UPLOAD_MEDIA,
      formData,
    );
    return response?.data?.data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
