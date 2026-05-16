import axios from "axios";

export const axiosClient = axios.create({
  // TODO: do this from the api base url
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
