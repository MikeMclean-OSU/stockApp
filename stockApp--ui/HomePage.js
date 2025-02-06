import React from 'react';
import { Link } from 'react-router-dom';
import StockList from '../components/StockList';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({}) {
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();

    const loadStocks = async () => {
        const response = await fetch('/stocks');
        const data = await response.json();
        setStocks(data);
    }

    useEffect(() => {
        loadStocks();
    }, []);

    return (
        <>
            <h2>Popular Stocks</h2>
            <StockList stocks={stocks}></StockList>
            <Link to="/buy-stock">Buy this Stock</Link>
        </>
    );
}

export default HomePage;