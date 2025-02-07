import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
   
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem("userData");
        let parsedUser;
        if (userData) {
          parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log(parsedUser, "user");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
    
  }, []);

  return (
    <> 
      {user?.role === "user" ? (
        navigate("/home/user")
      ) : (
        navigate("/home/admin")
      )}
    </>
  );
};

export default HomePage;
