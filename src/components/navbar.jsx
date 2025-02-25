import { Link } from "react-router-dom"; // Import Link for navigation
const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link className="home" to="/">
            Home
          </Link>{" "}
          {/* Link to Home page */}
        </li>
        <li>
          <Link className="stockSearch" to="/stockSearch">
            Stock Search
          </Link>{" "}
          {/* Link to Stock Search page */}
        </li>
        <li>
          <Link className="stockCharts" to={"/stockCharts"}>
            Stock Charts
          </Link>{" "}
          {/* Link to Stock Charts page */}
        </li>
        <li>
          <Link className="register" to="/register">
            Register
          </Link>{" "}
          {/* Link to Register page */}
        </li>
        <li>
          <Link className="login" to="/login">
            Login
          </Link>{" "}
          {/* Link to Login page */}
        </li>
        <li>
          <Link className="users" to="/users">
            User Page
          </Link>{" "}
          {/* Link to User page */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
