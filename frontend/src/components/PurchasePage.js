import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Purchase.css';
import { baseURL } from '../url';

import { FaHome } from "react-icons/fa";

function PurchasePage() {
    const [formData, setFormData] = useState({
        date: '',
        seller_name: '',
        product_name: '',
        rate: '',
        quantity: '',
        total: '',
    });
    const [purchases, setPurchases] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Retrieve token for authorization

    useEffect(() => {
        fetchPurchases(); // Initial fetch of purchase data
        fetchStock(); // Fetch stock data initially
    }, [token]);

    const fetchPurchases = () => {
        fetch(`${baseURL}/api/purchases`, {
            headers: { Authorization: `Bearer ${token}` }, // Include the token
        })
            .then((res) => res.json())
            .then((data) => setPurchases(data))
            .catch((err) => console.error('Error fetching purchases:', err));
    };

    const fetchStock = () => {
        fetch(`${baseURL}/api/stock`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Stock data:', data); // Log stock data
                setStockList(data);
            })
            .catch((err) => console.error('Error fetching stock data:', err));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };

            if (name === 'rate' || name === 'quantity') {
                updatedData.total = updatedData.rate * updatedData.quantity;
            }
            return updatedData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error messages

        if (!token) {
            setError('User is not authenticated. Please log in.');
            return;
        }

        fetch(`${baseURL}/api/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to submit purchase');
                }
                return res.json();
            })
            .then((data) => {
                console.log('Fetched Purchases:', data);
                setPurchases(data);
            })
            .catch((err) => {
                console.error('Error fetching purchases:', err);
            })
            .then((newPurchase) => {
                console.log('New Purchase Added:', newPurchase); // Log the new purchase data
                // Refresh purchase list after successful submission
                fetchPurchases();
                // Update stock immediately after the purchase
                updateStock(formData.product_name, formData.quantity, formData.rate);
                setFormData({
                    date: '',
                    seller_name: '',
                    product_name: '',
                    rate: '',
                    quantity: '',
                    total: '',
                });
            })
            .catch((err) => {
                console.error('Error fetching purchases:', err);
                setError(err.message);
            });
    };

    const updateStock = (product_name, quantity, rate) => {
        fetch(`${baseURL}/api/stock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_name, quantity, rate }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Stock updated:', data);
                fetchStock(); // Refresh stock list after updating
            })
            .catch((err) => console.error('Error updating stock:', err));
    };

    return (
        <div id="form">
            <form onSubmit={handleSubmit}>
                <h1 className="info">Purchase Information</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="date"
                    id="date"
                    name="date"
                    className="Text"
                    value={formData.date}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    id="seller_name"
                    name="seller_name"
                    className="Text"
                    placeholder="Seller Name"
                    value={formData.seller_name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    id="product_name"
                    name="product_name"
                    className="Text"
                    placeholder="Product Name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    step="0.25"
                    id="rate"
                    name="rate"
                    className="Text"
                    placeholder="Rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    className="Text"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    step="0.25"
                    id="total"
                    name="total"
                    className="Text"
                    placeholder="Total"
                    value={formData.total}
                    disabled
                />

                <input id="Submit1" className="btn" type="submit" value="Submit" />
            </form>
            <footer>
                <button onClick={() => navigate('/')} id="Home" className="btn">Home <FaHome /> </button>
            </footer>
        </div>
    );
}

export default PurchasePage;
