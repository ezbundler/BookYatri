import axios from "axios";
import { toast } from "react-toastify";
import { BaseURL } from "./baseURL";
const API_URL = `${BaseURL}/buses`;
export const fetchbuses = async () => {
  try {
    const response = await axios.get(API_URL);
    return {
      statusCode: 201,
      buses: response.data,
    };
  } catch (error) {
    console.error("Fetch Buses Error:", error);
    return {
      statusCode: 401,
      error: error.message,
    };
  }
};

export const fetchbusById = async ({ id }) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    if (response.status !== 200) throw new Error("Failed to fetch bus data");
    return response;
  } catch (error) {
    return error;
  }
};

export const createNewBus = async (busData) => {
  const response = await axios.post(API_URL, busData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const updateBusById = async (busId, updatedBusData) => {
  try {
    const response = await axios.put(`${API_URL}/${busId}`, updatedBusData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update bus details"
    );
  }
};

export const deleteBusById = async (busId) => {
  try {
    const res = await axios.delete(`${API_URL}/${busId}`);
    return res;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete bus");
  }
};
