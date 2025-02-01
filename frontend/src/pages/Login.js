import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jwt-encode";
import Navbar from "../components/Navbar";
import { loginfunction } from "../services/auth";
import { toast } from "react-toastify";
import Button from "../utils.js/button";
import { useDebounce } from "../utils.js/debounceHook";
import LoaderModal from "../components/Loader";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);

  useEffect(() => {
    if (debouncedEmail) {
      console.log("Debounced Email:", debouncedEmail);
    }
    if (debouncedPassword) {
      console.log("Debounced Password:", debouncedPassword);
    }
  }, [debouncedEmail, debouncedPassword]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const user = await loginfunction({ email: debouncedEmail, password: debouncedPassword });

    if (user) {
      const payload = {
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };
      const secretKey = "your-secret-key";
      const token = jwt(payload, secretKey);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      toast.warning("Logged In Successfully!");
      
    } else {
      toast.error("Invalid email or password");
    }
    setTimeout(() => {
      
      setLoading(false);
    }, 3000);
    navigate(`/home`);
  };

  return (
    <>
    {loading && <LoaderModal/>}
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center ">
        <h2 className="text-3xl font-bold mb-4 text-red-600 ">Login</h2>
        <form className="space-y-4 w-80" onSubmit={handleLogin}>
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
            className="p-2 border rounded  w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            title={loading ? "Logging in..." : "Login"}
            disabled={loading}
            className="bg-red-600 text-white p-2 rounded w-full hover:bg-yellow-400"
          />
        </form>
        <div className="mt-2 text-black ">
          <p>
            New to the BookYatri?{" "}
            <Link to="/signup">
              <span className="text-orange-600 hover:text-yellow-400">
                Click here{" "}
              </span>
            </Link>{" "}
            to Sign up.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
