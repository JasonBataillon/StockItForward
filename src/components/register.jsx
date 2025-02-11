import { useState } from "react";

const Register = () => {
  // This state holds the form data: email and password
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  //This state holds the message to be displayed to the user
  const [message, setMessage] = useState("");
  // This function updates the formData state whenever the user types in the input fields
  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep the existing data
      [e.target.name]: e.target.value, // Update only the field being typed into
    });
  };

  // This function runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when the form is submitted
    console.log("Registering user:", formData); // For now, just log the data to the console
    // Later, this is where you'd send the data to your backend API
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5173/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("User registered:", data);
      setMessage("Registration successful!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Registration failed.");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        {/* Email Input Field */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email" // Matches the key in formData
            value={formData.email} // Controlled input bound to formData
            onChange={handleChange} // Update formData when typing
            required // Basic validation to ensure it's filled
          />
        </div>

        {/* Password Input Field */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {/* Confirm Password Input Field */}
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Register</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Register;
