import axios from "axios";
const BASE_URL = "https://together-server-8glm.onrender.com:8000/api/v1";
export default axios.create({
  baseURL: BASE_URL,
});
