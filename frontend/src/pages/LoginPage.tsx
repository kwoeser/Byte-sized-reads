import { apiClient } from "../Connection"; 
import { useState } from "react";
import { UseMutationOptions, useMutation } from "@ts-rest/react-query";

// https://tanstack.com/query/v4/docs/framework/react/guides/mutations
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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


  return (
    <div>
      <input type="text" placeholder="Username"
        value={username} onChange={(e) => setUsername(e.target.value)}
      />
      <input type="password" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>

      
    </div>
  )
}

export default LoginPage