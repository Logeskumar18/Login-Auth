import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';



const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { backendURL, setIsLoggedIn , getUserData} = useContext(AppContext)


const handleSubmit = async (e) => {
  e.preventDefault();
  axios.defaults.withCredentials = true;

  const cleanURL = backendURL.replace(/\/+$/, '');

  try {
    const endpoint = state === 'Sign Up' ? '/api/auth/register' : '/api/auth/login';
    const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

    const { data } = await axios.post(`${cleanURL}${endpoint}`, payload);

    if (data.success) {
      toast.success(state === 'Sign Up' ? 'Account created!' : 'Login successful!');
      setIsLoggedIn(true);
      getUserData()
      navigate('/');  
    } else {
      toast.error(data.message);
      getUserData()
    }

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
  }

  setName("");
  setEmail("");
  setPassword("");
};



  return (
    <div className="min-h-screen bg-gray-100 relative px-4 py-6">
      {/* Logo at Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
        <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className="w-20 sm:w-24" />
      </div>

      {/* Centered Form Box */}
      <div className="flex flex-col items-center justify-center h-full pt-20">
        <div className="bg-white shadow-md rounded-lg px-6 py-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>
          <p className="text-gray-600 mb-6">
            {state === "Sign Up"
              ? "Create Your Account"
              : "Login To Your Account"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {state === "Sign Up" && (
              <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
                <img
                  src={assets.person_icon}
                  alt="Person"
                  className="w-5 h-5 mr-2"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-transparent focus:outline-none"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
              <img
                src={assets.mail_icon}
                alt="Mail"
                className="w-5 h-5 mr-2"
              />
              <input
                type="email"
                placeholder="Email ID"
                className="w-full bg-transparent focus:outline-none"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
              <img
                src={assets.lock_icon}
                alt="Lock"
                className="w-5 h-5 mr-2"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent focus:outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div onClick={() => navigate('/reset-password')} className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot Password?
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
            >
              {state}
            </button>

            <p className="text-sm mt-4 text-gray-600">
              {state === "Sign Up"
                ? "Already have an account?"
                : "Don't have an account?"}
              <span
                className="ml-1 text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() =>
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
              >
                {state === "Sign Up" ? "Login" : "Sign Up"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
