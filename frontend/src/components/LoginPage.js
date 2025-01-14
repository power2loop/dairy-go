import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { baseURL } from '../url';

import { HiOutlineLogin } from "react-icons/hi";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { MdProductionQuantityLimits } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";



function LoginPage() {
    const [formData, setFormData] = useState({ staff_id: '', password: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post(`${baseURL}/api/login`, formData)
            .then((response) => {
                const { staff_id, token, role } = response.data;
                localStorage.setItem('staff_id', staff_id);
                localStorage.setItem('token', token)

                // window.alert('Login successful!');
                setIsLoggedIn(true); // Update the state to show buttons
            })
            .catch((error) => {
                console.error('Login error:', error.response ? error.response.data : error.message);
                // window.alert(error.response?.data?.message || 'Failed to login. Please try again.');
            });
    };

    const handleNavigation = (page) => {
        if (page === 'sales') {
            navigate('/sales');
        } else if (page === 'purchase') {
            navigate('/purchase');
        } else if (page === 'stock') {
            navigate('/stock');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        setIsLoggedIn(false); // Update state
        navigate('/');
    };

    return (
        <div>
            {!isLoggedIn ? (
                <form onSubmit={handleLogin} className="login-form">
                    <h1>Staff Login</h1>
                    <input
                        type="text"
                        name="staff_id"
                        value={formData.staff_id}
                        onChange={handleInputChange}
                        placeholder="Staff ID"
                        required

                    />

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Login<HiOutlineLogin />
                    </button>
                </form>
            ) : (
                <div>
                    <button className="btn" onClick={() => handleNavigation('sales')}>Sales  <LuReceiptIndianRupee /> </button>
                    <button className="btn" onClick={() => handleNavigation('purchase')}>Purchase  <GrMoney /></button>
                    <button className="btn" onClick={() => handleNavigation('stock')}>Stock <MdProductionQuantityLimits /></button>
                    <button className="btn logout" onClick={handleLogout}>Logout<LuLogOut />
                    </button>

                </div>
            )}
        </div>
    );
}

export default LoginPage;
