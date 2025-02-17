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
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<div>Welcome to Stock-It</div>} />
          <Route path="/stockSearch" element={<StockSearch />} />
          <Route path="/stockCharts" element={<StockCharts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
