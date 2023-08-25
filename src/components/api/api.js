import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8085/api/v1/', // api Url
  timeout: 10000, // Set a timeout for requests
});

// Add an interceptor to include the Bearer token in the headers
instance.interceptors.request.use(
  (config) => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlc3RoZXIiLCJpYXQiOjE2OTE5MDUxOTgsImV4cCI6MzM4MzgxMDk5Nn0.sCtHcRGNsGLvjqMyrZP3uHcd5v4pzujWWxG2xwbsHKaGz9_pbjJmZ_Gg5W610462e4B-dlAIKBPP3k8O6Eg5WA'; // Replace with your actual token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
