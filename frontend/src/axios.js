import axios from "axios";

const api = axios.create({
  baseURL: "https://agya-new-main-umye.vercel.app/api", // Your backend server URL
});

export default api;
