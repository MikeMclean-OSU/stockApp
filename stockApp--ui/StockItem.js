import React from "react";

function StockItem({stock}){
    return(
        <tr>
            <td>{stock.title}</td>
            <td>{stock.price}</td>
            <td>{stock.sym}</td>
        </tr>
    );
}

export default StockItem;