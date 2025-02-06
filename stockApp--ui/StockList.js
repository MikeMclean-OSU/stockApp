import React from "react";
import StockItem from "./StockItem";

function StockList({stocks}){
    return(
        <table>
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Price</th>
                    <th>Ticker Symbol</th>
                </tr>
            </thead>
            <tbody>
                {stocks.map((stock, i) => <StockItem stock={stock}
                    key={i} />)}
            </tbody>
        </table>
    );
}

export default StockList;