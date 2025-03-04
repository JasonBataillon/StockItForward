import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link className="home" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="stockSearch" to="/stockSearch">
            Stock Search
          </Link>
        </li>
        <li>
          <Link className="stockCharts" to={'/stockCharts'}>
            Stock Charts
          </Link>
        </li>
        <li>
          <Link className="register" to="/register">
            Register
          </Link>
        </li>
        <li>
          <Link className="login" to="/login">
            Login
          </Link>
        </li>
        <li>
          <Link className="users" to="/users">
            User Page
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
