import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // New state for role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    if (!name || !email || !password || !role) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        setError('Email already in use.');
        setLoading(false);
        return;
      }

      const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        password,
        role,  // Include role in user data
      };
console.log(newUser,"newuser")
      const addUserResponse = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!addUserResponse.ok) {
        throw new Error('Failed to create user.');
      }

      navigate('/home');
    } catch (error) {
      setError('Failed to sign up. Please try again later.');
    } finally {
      setLoading(false);
    }
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
          <button
            type="submit"
            className="bg-red-600 hover:bg-yellow-400 text-white p-2 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-2">
          <p>
            Already connected to the BookYatri?{' '}
            <Link to="/login">
              <span className="text-orange-600 hover:text-yellow-400">
                Click here
              </span>
            </Link>{' '}
            to Login.
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
