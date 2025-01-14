import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sales.css';
import { format } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { baseURL } from '../url';

import { FaHome } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { GiArchiveRegister } from "react-icons/gi";


function SalesPage() {
    const [formData, setFormData] = useState({
        date: '',
        staff_id: '',
        customer_name: '',
        product_name: '',
        rate: '',
        quantity: '',
        total: '',
        products: []
    });

    const [sales, setSales] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setFormData((prevData) => ({
                    ...prevData,
                    staff_id: payload.staff_id || '',
                }));
            } else {
                toast.error("Session expired. Please log in again.");
                navigate('/login');
            }
        } catch (err) {
            console.error('Error decoding token:', err);
            navigate('/login');
        }

        fetch(`${baseURL}/api/sales`)
            .then((res) => res.json())
            .then((data) => {
                setSales(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error('Error fetching sales data:', err));
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };

            if (name === 'rate' || name === 'quantity') {
                const rate = parseFloat(updatedData.rate || 0);
                const quantity = parseFloat(updatedData.quantity || 0);
                updatedData.total = parseFloat((rate * quantity).toFixed(2));
            }

            return updatedData;
        });
    };

    const handleAddProduct = () => {
        if (!formData.product_name || !formData.rate || !formData.quantity) {
            toast.error("Please fill in all product details before adding.");
            return;
        }

        if (formData.products.some((p) =>
            p.product_name === formData.product_name &&
            p.rate === parseFloat(formData.rate) &&
            p.quantity === parseInt(formData.quantity)
        )) {
            toast.warning("This product with the same rate and quantity is already added.");
            return;
        }

        const product = {
            product_name: formData.product_name,
            rate: parseFloat(formData.rate),
            quantity: parseInt(formData.quantity),
            total: parseFloat(formData.total)
        };

        setFormData((prevData) => ({
            ...prevData,
            products: [...prevData.products, product],
            product_name: '',
            rate: '',
            quantity: '',
            total: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.products.length) {
            toast.info("Please select a date and add at least one product.");
            return;
        }

        const total_amount = formData.products.reduce((sum, product) => sum + product.total, 0);

        const dataToSubmit = {
            date: formData.date,
            customer_name: formData.customer_name,
            products: formData.products,
            total_amount: total_amount
        };

        try {
            const response = await fetch(`${baseURL}/api/sales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            const newSale = await response.json();
            setSales((prevSales) => [...prevSales, newSale]);

            setFormData({
                date: '',
                staff_id: formData.staff_id,
                customer_name: '',
                product_name: '',
                rate: '',
                quantity: '',
                total: '',
                products: []
            });

            toast.success('Sale submitted successfully!');
        } catch (err) {
            console.error('Submission Error:', err);
            toast.error('Failed to submit the sale. Please try again.');
        }
    };

    const handleSearch = async () => {
        if (!formData.date) {
            toast.info("Please select a date to search.");
            return;
        }


        try {
            const response = await fetch(`${baseURL}/api/sales?date=${formData.date}`);
            const data = await response.json();
            if (!data.length) {
                toast.error("No sales data found for the selected date.");
            }
            setSales(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching sales data for the selected date:', err);
        }
    };

    return (
        <div className="sales-page">
            <form onSubmit={handleSubmit} className="sales-form">
                <div id="Sales">
                    <h1>Sales Information</h1>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="Date"
                        className="form-input"
                    />
                    <input
                        type="number"
                        name="staff_id"
                        value={formData.staff_id}
                        disabled
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        placeholder="Customer Name"
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        className="form-input"
                    />
                    <input
                        type="number"
                        step="0.25"
                        name="rate"
                        value={formData.rate}
                        onChange={handleInputChange}
                        placeholder="Rate"
                        className="form-input"
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="Quantity"
                        className="form-input"
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="total"
                        value={formData.total}
                        disabled
                        placeholder="Total"
                        className="form-input"
                    />
                    <button type="button" onClick={handleAddProduct} className="add-product-button">
                        Add Product
                    </button>
                </div>
                <button type="submit" className="submit-button">
                    Submit <IoIosSend />
                </button>
            </form>

            <hr />
            <button onClick={handleSearch} className="search-button">All Sales Detail <GiArchiveRegister /></button>

            <table className="sales-table">
                <thead>
                    <tr>
                        <th>Staff ID</th>
                        <th>Customer Name</th>
                        <th>Date</th>
                        <th>Product Name</th>
                        <th>Rate</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map((sale) =>
                            sale.products.map((product, index) => (
                                <tr key={`${sale._id}-${index}`}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={sale.products.length}>{sale.staff_id}</td>
                                            <td rowSpan={sale.products.length}>{sale.customer_name}</td>
                                            <td rowSpan={sale.products.length}>{format(new Date(sale.date), 'MM/dd/yyyy')}</td>
                                        </>
                                    )}
                                    <td>{product.product_name}</td>
                                    <td>{product.rate}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.total}</td>
                                </tr>
                            ))
                        )
                    ) : (
                        <tr>
                            <td colSpan="7">No sales data available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <footer className="sales-footer">
                <button onClick={() => navigate('/')} className="home-button">
                    Home <FaHome />
                </button>
            </footer>
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

export default SalesPage;
