import axios from 'axios';

const API_URL = "http://localhost:5000/users";


export const loginfunction = async ({ email, password }) => {
  try {
    const response = await axios.get(API_URL);
    const users = response.data;
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    return user || null;
  } catch (error) {
    console.error("Login Error:", error);
    return error;
  }
};


export const signUpFunction = async ({ newUser }) => {
  try {
    console.log(newUser, "new user data from the auth services");

    const addUserResponse = await axios.post(API_URL, newUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return addUserResponse.status === 201;
  } catch (error) {
    console.error("Sign-up Error:", error);
    return error;
  }
};
