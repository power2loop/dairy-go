import React, { useState } from 'react';
import { HiOutlineLogin } from "react-icons/hi";
import { baseURL } from '../url';

function AdminLogin({ onLoginSuccess }) {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseURL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID, password })
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            const token = data.token;

            // Store the token in localStorage
            localStorage.setItem('token', token);

            // Call the callback function to indicate login success
            onLoginSuccess();
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="admin-login-box">
            <h1>Admin Login</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login <HiOutlineLogin /></button>
            </form>
        </div>
    );
}

export default AdminLogin;
