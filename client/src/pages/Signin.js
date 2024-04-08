import { useDispatch } from 'react-redux';
import { login } from '../redux/reducers/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch('http://localhost:8003/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(login(data));
        setLoading(false);
        setError(null);
        navigate('/');
      } else {
        setError(data.message || 'An error occurred');
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="ml-[700px] pt-[200px] mr-[700px]">
      <h1 className="text-3xl text-center text-black-500 font-semibold my-3 ">SIGN IN</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          className="border p-3 rounded-lg"
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="Password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-purple-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={'/signup'}>
          <span className="text-purple-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      
    </div>
  );
};

export default SignIn;