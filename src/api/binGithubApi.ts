import axios from "axios";

const baseURL = 'https://knn3-gateway.knn3.xyz/oauth/login'

const api = axios.create({
  baseURL
});

api.interceptors.response.use((res: any) => {
  return res.data
}, (error: any) => {
  return error.response;
});

export default api;