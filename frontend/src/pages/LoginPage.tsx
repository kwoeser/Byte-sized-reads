import { apiClient } from "../Connection"; 
import { useState } from "react";
import { UseMutationOptions, useMutation } from "@ts-rest/react-query";

// https://tanstack.com/query/v4/docs/framework/react/guides/mutations
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // register mutation, POST /auth/register
  const registerMutation = apiClient.register.useMutation()

  // login mutation, POST /auth/login
  const loginMutation = apiClient.login.useMutation();

  // logout mutation, POST /auth/logout
  const logoutMutation = apiClient.logout.useMutation();

  
  const handleRegister = () => {  
    registerMutation.mutate(
      { body: { username, password } },
      {
        onSuccess: (data) => {
          console.log("Regristration works:", data);
        },
        onError: (err) => {
          console.error("Regristration error:", err);
        },
      }
    )
  };

  const handleLogin = () => {
    loginMutation.mutate(
      { body: { username, password } },
      {
        onSuccess: (data) => {
          console.log("Login successful:", data);
          setErrorMessage(""); // Clear any previous errors on success
        },
        onError: (err) => {
          console.error("Login error:", err);
          setErrorMessage("Login failed. Please check your credentials.");
        },
      }
    );
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login / Register</h2>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
    
    <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage