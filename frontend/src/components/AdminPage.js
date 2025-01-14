import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import './AdminPage.css';
import { baseURL } from '../url';

import { IoPeople } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";


function AdminPage() {
    const [staffList, setStaffList] = useState([]);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if the admin is logged in by verifying the token
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const onLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    // Fetch all staff details
    const fetchStaff = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/staff`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch staff');
            }

            const data = await response.json();
            setStaffList(data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching staff data');
            setLoading(false);
        }
    };

    // Handle delete staff
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/staff/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete staff');
            }

            setStaffList((prevList) => prevList.filter(staff => staff._id !== id));
        } catch (err) {
            setError('Error deleting staff');
        }
    };

    // If not logged in, show the login form
    if (!isLoggedIn) {
        return <AdminLogin onLoginSuccess={onLoginSuccess} />;
    }

    // If logged in, show the staff management page
    return (
        <div className="admin-page">
            <h1>Admin Dashboard<IoPeople /></h1>
            {error && <p>{error}</p>}

            <button onClick={fetchStaff}>View All Staff <IoIosPeople /></button>

            {loading && <p>Loading...</p>}
            {staffList.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map((staff) => (
                            <tr key={staff._id}>
                                <td>{staff.name}</td>
                                <td>{staff.contact}</td>
                                <td>
                                    <button onClick={() => handleDelete(staff._id)}>Delete <MdDeleteForever />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No staff members found.</p>
            )}
        </div>
    );
}

export default AdminPage;
