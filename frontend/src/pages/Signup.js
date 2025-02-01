import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { checkUserPresent, fetchUser } from "../services/user";
import { signUpFunction } from "../services/auth";
import { toast } from "react-toastify";
import Button from "../utils.js/button";
import { useDebounce } from "../utils.js/debounceHook";
const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // New state for role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const debouncedEmail = useDebounce(email);
  const debouncedPassword = useDebounce(password);
  const debouncedname = useDebounce(name);


  useEffect(()=>{
if(debouncedEmail){
  console.log("debounced email:",debouncedEmail);
  
}
if(debouncedPassword){
  console.log("debounced password:",debouncedPassword);
  
}
if(debouncedname){
  console.log("debounced name:",debouncedname);
  
}
  },[debouncedEmail,debouncedname,debouncedPassword])

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!debouncedname || !debouncedEmail || !debouncedPassword || !role) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
      const users = await fetchUser();
      const response = await checkUserPresent({ email:debouncedEmail });
     if(users.statusCode !== 401){
      if (response===true) {
       toast.error("already user email exist! .try with different email")
        setError("Email already in use.");
        setLoading(false);
        return;
      }
      else if( response ===false) {
        const newUser = {
          id: (users.data.length + 1).toString(),
          name:debouncedname,
          email:debouncedEmail,
          password:debouncedPassword,
          role, // Include role in user data
        };
        signUpFunction({newUser});
setLoading(false);
        toast.success("you have successfully created account. PLease login to start using the BoookYatrii")
        navigate("/home");
      }else{
       toast.error("SOmethig wrong happened while creating the user. please try again later!")
      }
     }else{
      toast.error(`${users.error}`);
      setError("unable to signUP");
      setLoading(false);
     
     } 
     setLoading(false);   
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center ">
        <h2 className="text-3xl text-red-600 font-bold mb-4">Sign Up</h2>
        <form className="space-y-4 w-80" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Name"
            className="p-2 border rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Dropdown */}
          <select
            className="p-2 border rounded w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-500">{error}</p>}
          <Button
                      type="submit"
                      title= {loading ? "Signing Up..." : "Sign Up"}
                      disabled={loading}
                      className="bg-red-600 text-white p-2 rounded w-full hover:bg-yellow-400"
                    />
         
        </form>
        <div className="mt-2">
          <p>
            Already connected to the BookYatri?{" "}
            <Link to="/login">
              <span className="text-orange-600 hover:text-yellow-400">
                Click here
              </span>
            </Link>{" "}
            to Login.
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
