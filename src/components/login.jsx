import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

// Define the Login component
const Login = () => {
  // State to hold username and password input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Here you would typically handle the login logic, such as sending the data to your server
    try {
      // const response = await fetch('https://stockitback.onrender.com/login', {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000); // Redirect to home after 2 seconds

      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Login failed.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* username input field */}
        <div>
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {/* Password input field */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Submit button */}
        <button type="submit">Login</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Login;
