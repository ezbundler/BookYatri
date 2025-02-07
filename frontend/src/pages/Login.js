import React, { useState, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jwt-encode";
import { loginfunction } from "../services/auth";
import { toast } from "react-toastify";


const Navbar = React.lazy(() => import("../components/Navbar"));
const LoaderModal = React.lazy(() => import("../components/Loader"));
const Button = React.lazy(() => import("../utils.js/button"));

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email cannot be empty.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.password) {
      newErrors.password = "Password cannot be empty.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix validation errors.");
      return;
    }

    setLoading(true);
    const user = await loginfunction(formData);

    if (user) {
      const payload = {
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };
      const secretKey = process.env.REACT_APP_JWT_SECRET || "fallback-secret";
      const token = jwt(payload, secretKey);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      toast.success("Logged In Successfully!");
      navigate("/home");
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <>
      {loading && (
        <Suspense fallback={<div>Loading...</div>}>
          <LoaderModal />
        </Suspense>
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-red-600">Login</h2>
        <form className="space-y-4 w-80" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`p-2 border rounded w-full ${
                errors.email ? "border-red-500" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`p-2 border rounded w-full ${
                errors.password ? "border-red-500" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <Button
              type="submit"
              title={loading ? "Logging in..." : "Login"}
              disabled={loading}
              className="bg-red-600 text-white p-2 rounded w-full hover:bg-yellow-400"
            />
          </Suspense>
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
