import axios from "axios";

const api = axios.create({
  baseURL: "https://agyademo.uber.space/api", // Your backend server URL
});

export default api;
