import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Stock.css';
import { baseURL } from '../url';

import { FaHome } from "react-icons/fa";

function StockPage() {
    const [stockList, setStockList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${baseURL}/api/stock`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);  // Log the data to inspect its structure
                setStockList(data);
            })
            .catch((err) => console.error('Error fetching stock data:', err));
    }, []);


    return (
        <div className="stock-page">
            <h1>Stock Table</h1>

            <div className="table-wrapper">
                <table className="fl-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockList.map((stock, index) => (
                            <tr key={index}>
                                <td>{stock.product_name}</td>
                                <td>{stock.quantity}</td>
                                <td>{stock.rate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer>
                <button onClick={() => navigate('/')} className="home-button">
                    Home <FaHome />
                </button>
            </footer>
        </div>
    );
}

export default StockPage;
