import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link> {/* Link to Home page */}
        </li>
        <li>
          <Link to={"/stockCharts"}>Stock Charts</Link>{" "}
          {/* Link to Stock Charts page */}
        </li>
        <li>
          <Link to="/register">Register</Link> {/* Link to Register page */}
        </li>
        <li>
          <Link to="/login">Login</Link> {/* Link to Login page */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
