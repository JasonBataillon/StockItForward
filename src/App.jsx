//import { useState } from "react";
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

//for aaron and jason
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import Navbar from "./components/navbar";
import StockCharts from "./components/stockChart";
import StockSearch from "./components/stockSearch";
import StockAlert from "./components/alert";
import Users from "./components/users";
// import ErrorBoundary from "./components/ErrorBoundary";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Navbar />

        <Routes>
          {/* <Route path="/" element={<StockAlert />} /> */}
          <Route path="/stockSearch" element={<StockSearch />} />
          <Route
            path="/stockCharts"
            element={
              // <ErrorBoundary>
              <StockCharts />
              // </ErrorBoundary>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
