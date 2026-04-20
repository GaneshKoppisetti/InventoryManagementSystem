import axios from 'axios';
import {showToast} from "../utils/toaster/Toaster";
import { navigateTo } from "./navigation";

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // important for cookies
});


api.interceptors.request.use(config => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//This handles auto refresh.
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:4000/api/users/refreshAccessToken",
          {},
          { withCredentials: true }
        );

        sessionStorage.setItem(
          "accessToken",
          res.data.accessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch(error) {
        console.log("Error while refresh the access token",error);
        sessionStorage.clear();
        showToast("Session has expired. Please Re-login","error")
        // window.location.href="/login";
        navigateTo("/login");
      }
    }

    return Promise.reject(error);
  }
);


export default api;
