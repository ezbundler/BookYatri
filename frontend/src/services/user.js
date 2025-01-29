import axios from "axios";


const API_URL = "http://localhost:5000/users";


export const checkUserPresent = async ({ email }) => {
  try {
    const response = await axios.get(API_URL);
    const users = response.data;

    const existingUser = users.find((u) => u.email === email);
    return !!existingUser;
  } catch (error) {
    console.error("Error checking user presence:", error);
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
    console.error("Error fetching users:", res);
    return res;
  }
};

export const changeUserRole = async({updatedUser})=>{
    try {
        // console.log(updatedUser.id);
        const response = await fetch(
            `http://localhost:5000/users/${updatedUser.id}`,
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
