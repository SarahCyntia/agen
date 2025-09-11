import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "https://normally-workable-piranha.ngrok-free.app/api/";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Tambahkan interceptor agar token otomatis disisipkan
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  config.headers["Accept"] = "application/json";
  
  return config;
});

export default api;