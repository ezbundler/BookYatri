import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Set loading to true while making the request
    setLoading(true);
    setError('');

    // Validation: Check if all fields are filled
    if (!name || !email || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // Fetch all users from the JSON Server to check if the email already exists
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

      // Check if the email is already registered
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        setError('Email already in use.');
        setLoading(false);
        return;
      }

      // Create a new user object
      const newUser = {
        id: users.length + 1, // Simple way to generate an ID (this can be handled more dynamically by the database)
        name,
        email,
        password
      };

      // Send a POST request to add the new user to the JSON Server database
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

      // Redirect to login page after successful signup
      navigate('/home');
    } catch (error) {
      setError('Failed to sign up. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-100">
      <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
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
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-orange-500 text-white p-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <div className='mt-2'> <p>Already connected to the BookYatri? <Link to='/login'><span className='text-orange-600 hover:text-purple-600'>Click here </span></Link> to Login.</p></div>

    </div>
    </>
  );
};

export default SignUpPage;
