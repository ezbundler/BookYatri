import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt from 'jwt-encode';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    
    setLoading(true);
    setError('');

    try {
      
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

     
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
console.log(user,"user cred");
      
      if (user) {
        console.log("user is present now creating token")
        const payload = {
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + 60 * 60  
          };
          
const secretKey = 'your-secret-key';
const token = jwt(payload, secretKey);
console.log(token, "token generated");
localStorage.setItem('authToken', token);
localStorage.setItem('userData', JSON.stringify(user));


      
        navigate(`/home`);  
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Failed to login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
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
        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded w-full hover:bg-yellow-400"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className='mt-2 text-black '> <p>New to the BookYatri? <Link to='/signup'><span className='text-orange-600 hover:text-yellow-400'>Click here </span></Link> to Sign up.</p></div>
    </div>
    </>
  );
};

export default LoginPage;
