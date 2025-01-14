import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import StaffPage from './components/StaffPage';
import AdminPage from './components/AdminPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SalesPage from './components/SalesPage';
import PurchasePage from './components/PurchasePage';
import StockPage from './components/StockPage';

import { RiAdminLine } from "react-icons/ri";
import { GoPeople } from "react-icons/go";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { MdProductionQuantityLimits } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { GiMilkCarton } from "react-icons/gi";
import { PiCowFill } from "react-icons/pi";
import { GiCow } from "react-icons/gi";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if the user is logged in
  const navigate = useNavigate();

  // Check if the user is logged in by verifying token in localStorage
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update state
    navigate('/'); // Redirect to login page
  };

  // Click handler function for navigation buttons
  const handleClick = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (

    <div id="set">
      <h2 className="Dms">Dairy Management System <GiMilkCarton /> </h2>

      {isLoggedIn ? (
        <div>
          <button className="btn" onClick={() => handleClick('/sales')}>Sales <LuReceiptIndianRupee /> </button>
          <button className="btn" onClick={() => handleClick('/purchase')}>Purchase <GrMoney /> </button>
          <button className="btn" onClick={() => handleClick('/stock')}>Stock <MdProductionQuantityLimits /></button>
          <button className="btn logout" onClick={handleLogout}>Logout <LuLogOut /> </button>
        </div>
      ) : (
        <div>

          <div className='dms-dms'>
            <h1 className='dms-login' >  <GiCow />LOGIN<GiCow /> </h1>
            <div className='btn-btn'>
              <button className="btn staff" onClick={() => handleClick('/staff')}>Staff <GoPeople /></button>
              <button className="btn admin" onClick={() => handleClick('/admin')}>Admin <RiAdminLine /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/stock" element={<StockPage />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
