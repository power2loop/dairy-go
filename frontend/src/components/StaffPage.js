import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


import { SiTheregister } from "react-icons/si";
import { HiLogin } from "react-icons/hi";


function StaffPage() {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="staff-page">
            <div className="login-form">
                <h1>Staff Login / Registration </h1>
                <button className="btn-login-1" onClick={navigateToLogin}>Login <HiLogin /> </button>
                <br></br>
                <button onClick={navigateToRegister}>Register<SiTheregister /></button>
            </div>
        </div>
    );
}

export default StaffPage;
