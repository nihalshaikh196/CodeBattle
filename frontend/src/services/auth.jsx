import axios from "axios";

const API_URL = "http://localhost:3000";

export const registerAPI = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      return response;
    } catch (error) {
        return error.response;
    }
};

export const loginAPI = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      return response;
    } catch (error) {
        return error.response;
    }
};