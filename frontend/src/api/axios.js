import axios from "axios";
const BASE_URL = "https://together-server-8glm.onrender.com/api/v1";
export default axios.create({
  baseURL: BASE_URL,
});
