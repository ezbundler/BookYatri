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
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedEmail = useDebounce(email);
  const debouncedPassword = useDebounce(password);
  const debouncedName = useDebounce(name);

  useEffect(() => {
    if (touched.name) validateName(debouncedName);
    if (touched.email) validateEmail(debouncedEmail);
    if (touched.password) validatePassword(debouncedPassword);
  }, [debouncedName, debouncedEmail, debouncedPassword]);

  const validateName = (name) => {
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Name cannot be empty." }));
    } else if (!/^[a-zA-Z ]+$/.test(name)) {
      setErrors((prev) => ({ ...prev, name: "Name must contain only letters." }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (Object.values(errors).some((error) => error !== "") || !name || !email || !password) {
      toast.error("Please fix validation errors.");
      setLoading(false);
      return;
    }

    const users = await fetchUser();
    const response = await checkUserPresent({ email: debouncedEmail });

    if (users.statusCode !== 401) {
      if (response === true) {
        toast.error("Email already in use! Try with a different email.");
        setLoading(false);
        return;
      } else if (response === false) {
        const newUser = {
          id: (users.data.length + 1).toString(),
          name: debouncedName,
          email: debouncedEmail,
          password: debouncedPassword,
          role,
        };
        signUpFunction({ newUser });
        setLoading(false);
        toast.success("Account created successfully. Please login to start using BookYatri!");
        navigate("/home");
      } else {
        toast.error("Something went wrong while creating the user. Please try again later.");
      }
    } else {
      toast.error(`${users.error}`);
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl text-red-600 font-bold mb-4">Sign Up</h2>
        <form className="space-y-4 w-80" onSubmit={handleSignUp}>
          <div>
            <input
              type="text"
              placeholder="Name"
              className={`p-2 border rounded w-full ${
                errors.name && touched.name ? "border-red-500" : ""
              }`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value);
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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

          <select
            className="p-2 border rounded w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <Button
            type="submit"
            title={loading ? "Signing Up..." : "Sign Up"}
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
