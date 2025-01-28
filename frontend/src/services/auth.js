import axios from 'axios';

export const loginfunction = async ({ email, password }) => {
  try {
    const response = await axios.get("http://localhost:5000/users");
    const users = response.data;
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};
