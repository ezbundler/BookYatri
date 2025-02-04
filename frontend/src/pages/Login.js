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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);

  useEffect(() => {
    if (touched.email) validateEmail(debouncedEmail);
    if (touched.password) validatePassword(debouncedPassword);
  }, [debouncedEmail, debouncedPassword]);

  const validateEmail = (email) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email cannot be empty." }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email." }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password cannot be empty." }));
    } else if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (Object.values(errors).some((error) => error !== "") || !email || !password) {
      toast.error("Please fix validation errors.");
      setLoading(false);
      return;
    }

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
      toast.success("Logged In Successfully!");
      navigate(`/home`);
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <>
      {loading && <LoaderModal />}
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-red-600">Login</h2>
        <form className="space-y-4 w-80" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`p-2 border rounded w-full ${
                errors.email && touched.email ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`p-2 border rounded w-full ${
                errors.password && touched.password ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            title={loading ? "Logging in..." : "Login"}
            disabled={loading}
            className="bg-red-600 text-white p-2 rounded w-full hover:bg-yellow-400"
          />
        </form>
        <div className="mt-2 text-black">
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
