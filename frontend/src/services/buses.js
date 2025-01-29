import axios from "axios";

export const fetchbuses = async () => {
  try {
    const response = await axios.get("http://localhost:5000/buses");
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
    const response = await axios.get(`http://localhost:5000/buses/${id}`);
    if (response.status !== 200) throw new Error("Failed to fetch bus data");
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchAllBooking = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/bookings`);
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
      `http://localhost:5000/bookings`,
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
