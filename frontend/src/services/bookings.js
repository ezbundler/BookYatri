import axios from "axios";
import { BaseURL } from "./baseURL";
const API_URL = `${BaseURL}/bookings`;


export const fetchAllBooking = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.status !== 200)
        throw new Error("Failed to fetch booking data");
      return response;
    } catch (error) {
      return error;
    }
  };



  export const seatBooking = async ({ busBooking }) => {
    try {
      const seatBook = await axios.post(
        API_URL,
        busBooking,
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      if (seatBook.status !== 201) {
        throw new Error("Failed to add the booking in the booking list");
      }
      return seatBook;
    } catch (error) {
      return error;
    }
  };