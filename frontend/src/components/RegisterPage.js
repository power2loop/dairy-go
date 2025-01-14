import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { baseURL } from '../url';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { SiTheregister } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";

function RegisterPage() {
    const [formData, setFormData] = useState({
        staff_id: '',
        name: '',
        age: '',
        gender: '',
        contact: '',
        address: '',
        password: '',
    });

    const navigate = useNavigate();  // Initialize navigate hook

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRegister = (e) => {
        e.preventDefault();

        axios.post(`${baseURL}/api/register`, formData)
            .then((response) => {
                console.log(response.data.message);
                toast.success('Registration successful!');
                navigate('/staff');
            })
            .catch((error) => {
                console.error('Error registering staff:', error.response || error.message);
                // window.alert(error.response?.data?.message || 'Failed to register staff.');
            });
    };

    return (
        <div className="register-page">
            <form onSubmit={handleRegister} className="login-form">
                <h1>Staff Registration <FaPeopleGroup /> </h1>
                <input
                    type="text"
                    name="staff_id"
                    value={formData.staff_id}
                    onChange={handleInputChange}
                    placeholder="Staff ID"
                />
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                />
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                />

                <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Contact"
                />
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                />
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select><br></br>
                <button type="submit">Register <SiTheregister /></button>
            </form>
            <ToastContainer
                position="top-center"
                autoClose={900}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"

            />

        </div>
    );
}

export default RegisterPage;
