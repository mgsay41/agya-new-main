import axios from "axios";

const api = axios.create({
  baseURL: "https://agyademo.uber.space", // Your backend server URL
});

export const upload = axios.create({
  baseURL: "https://agyademo.uber.space", // Your backend server URL
});

export default api;
