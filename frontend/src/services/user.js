import axios from "axios";
import { BaseURL } from "./baseURL";


const API_URL = `${BaseURL}/users`;


export const checkUserPresent = async ({ email }) => {
  try {
    const response = await axios.get(API_URL);
    const users = response.data;

    const existingUser = users.find((u) => u.email === email);
    return !!existingUser;
  } catch (error) {
    return error;
  }
};


export const fetchUser = async () => {
  try {
    const response = await axios.get(API_URL);
    return {
      statusCode: 201,
      data: response.data,
    };
  } catch (error) {
    let res = {
      statusCode: 401,
      error: error.message,
    };
   
    return res;
  }
};

export const changeUserData = async(updatedUser)=>{
    try { 
        // console.log(updatedUser.id);
        const response = await fetch(
            `${API_URL}/${updatedUser.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            }
          ); 
          return {
           data: response,
            statusCode: 201
          }
    } catch (error) {
        console.log(error,"error handling");
        return {
            error:error,
            statusCode: 401
        }
    }
}



export const fetchPaginatedUsers = async (page, limit = 5) => {
  const { data, headers } = await axios.get(`${API_URL}?_page=${page}&_limit=${limit}`);
  return {
    data,
    total: parseInt(headers["x-total-count"]), 
  };
};
