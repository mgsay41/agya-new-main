import axios from "axios";

const api = axios.create({
  baseURL: "https://agya-backend.vercel.app/api", // Your backend server URL
});

export default api;
