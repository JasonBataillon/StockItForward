import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "./logoutSlice";
// import { useHistory } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  // const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authToken");
    // history.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
