import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import BuyStockPage from './pages/BuyStockPage';
import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/buy-stock" element={<BuyStockPage />}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
