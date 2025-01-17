import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();
  const signOut = ()=>{
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');


    
    navigate('/');
  }


  return(
    <>
    <button onClick={signOut} className='text-black dark:text-white'>Sign Out</button>
    </>
  );
};

export default SignOut;