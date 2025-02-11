//import { useState } from "react";
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import Navbar from "./components/navbar";
import StockCharts from "./components/stockChart";
import StockList from "./components/stockList";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <Router>
        <Navbar />
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            setSearchQuery(searchTerm);
            <StockList query={searchQuery} />;
            console.log("click");
          }}
        >
          Search
        </button>
        <Routes>
          <Route path="/" element={<div>Welcome to Stock-It</div>} />
          <Route
            path="/stockList"
            element={<StockList query={searchQuery} />}
          />
          <Route path="/stockCharts" element={<StockCharts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
