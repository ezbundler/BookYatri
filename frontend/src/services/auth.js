import axios from 'axios';
import { BaseURL } from './baseURL';

const API_URL = `${BaseURL}/users`;


export const loginfunction = async (formdata ) => {
  try {
    console.log("login api ",formdata.email)
    const response = await axios.get(API_URL);
    const users = response.data;
    const user = users.find(
      (u) => u.email === formdata?.email && u.password === formdata?.password
    );
    return user || null;
  } catch (error) {
    console.error("Login Error:", error);
    return error;
  }
};


export const signUpFunction = async ({formdata}) => {
  try {
    const addUserResponse = await axios.post(API_URL, formdata, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return addUserResponse.status === 201;
  } catch (error) {
    return error;
  }
};
