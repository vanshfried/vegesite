import React from 'react';
import "../css/PreviousOrders.css";

// This is where your sample data would be imported.
// For a real app, this would be fetched from an API.
const sampleOrders = [
  {
    id: "ORD-987654321",
    orderDate: "2024-09-15",
    totalAmount: 180.50,
    status: "Delivered",
    items: [
      { productName: "Tomatoes", quantity: 1.5, price: 60.00 },
      { productName: "Onions", quantity: 2, price: 40.00 },
    ],
  },
  {
    id: "ORD-123456789",
    orderDate: "2024-09-10",
    totalAmount: 250.00,
    status: "Delivered",
    items: [
      { productName: "Spinach", quantity: 0.5, price: 30.00 },
      { productName: "Brinjal", quantity: 1, price: 70.00 },
    ],
  },
  {
    id: "ORD-789012345",
    orderDate: "2024-09-05",
    totalAmount: 120.00,
    status: "Cancelled",
    items: [
      { productName: "Carrots", quantity: 2, price: 50.00 },
      { productName: "Potatoes", quantity: 1.5, price: 30.00 },
    ],
  },
];

const PrevOrders = () => {
  return (
    <div className="previous-orders-container">
      <div className="previous-orders-content">
        <h1>Your Previous Orders</h1>
        {sampleOrders.length > 0 ? (
          <div className="order-list">
            {sampleOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order ID: {order.id}</h3>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p><strong>Order Date:</strong> {order.orderDate}</p>
                <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>

                <h4>Items:</h4>
                <ul className="item-list">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} kg of {item.productName} (₹{item.price.toFixed(2)}/kg)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-orders-message">You have no previous orders.</p>
        )}
      </div>
    </div>
  );
};

export default PrevOrders;