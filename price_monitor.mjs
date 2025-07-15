import fetch from 'node-fetch';
import { executeOrder, findUnexecutedOrder } from './orders_model.mjs';

async function getPrice(title) {
    const response = await fetch(`http://localhost:3000/stocks/${title}`);
    const data = await response.json();
    return data.price;
}

async function getSym(title) {
    const response = await fetch(`http://localhost:3000/stocks/${title}`);
    const data = await response.json();
    return data.sym;
}

async function getFunds(userName){
    const response = await fetch(`http://localhost:3075/funds/${userName}`)
    const data = await response.json();
    return data.funds;
}

async function getQuantity(userName, title) {
    const response = await fetch(`http://localhost:3050/user/${userName}/${title}`)
    const data = await response.json();
    return data.amountOwned;
}

async function checkOrders() {
    const orders = await findUnexecutedOrder();

    for(const order of orders){
       const price = await getPrice(order.stock_title);
       const funds = await getFunds(order.userName);
       const quantity = await getQuantity(order.userName, order.stock_title);
       const sym = await getSym(order.stock_title)

       if ((order.orderType === "buy-limit" && price <= order.strike_price && funds >= (price * order.quantity)) || 
            (order.orderType === "buy-stop" && price >= order.strike_price && funds >= (price * order.quantity))){
                const updatedFunds = Number(funds - (price * order.quantity)).toFixed(2);
                const newOwned = Number(quantity) + Number(order.quantity);
                const response = await fetch(`http://localhost:3075/funds/${order.userName}`, {
                    method: "PUT",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({funds: updatedFunds})
                });
                const updateQuantity = await fetch(`http://localhost:3050/user/${order.userName}/${order.stock_title}`, {
                    method: "PUT",
                    headers:{"Content-Type": "application/json",},
                    body: JSON.stringify({amountOwned: newOwned})
                });
                const updateHistory = await fetch(`http://localhost:3050/history/${order.userName}`, {
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({userName: order.userName,
                                        stock_title: order.stock_title,
                                        stock_sym: sym,
                                        amount: order.quantity,
                                        transactionType: "Buy",
                                        price: price          
                                        })
                });

                await executeOrder(order._id);
            }
        if (((order.orderType === "sell-limit" && price >= order.strike_price && quantity >= order.quantity)) ||
            (order.orderType === "sell-stop" && price <= order.strike_price && quantity >= order.quantity)){
                const updatedFunds = Number(funds + (price * order.quantity)).toFixed(2);
                const newOwned = Number(quantity) - Number(order.quantity);
                const response = await fetch(`http://localhost:3075/funds/${order.userName}`, {
                    method: "PUT",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({funds: updatedFunds})
                });
                const updateQuantity = await fetch(`http://localhost:3050/user/${order.userName}/${order.stock_title}`, {
                    method: "PUT",
                    headers:{"Content-Type": "application/json",},
                    body: JSON.stringify({amountOwned: newOwned})
                });
                const updateHistory = await fetch(`http://localhost:3050/history/${order.userName}`, {
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({userName: order.userName,
                                        stock_title: order.stock_title,
                                        stock_sym: sym,
                                        amount: order.quantity,
                                        transactionType: "Sell",
                                        price: price          
                                        })
                });

                await executeOrder(order._id);
            }

    }
}

setInterval(checkOrders, 5000);