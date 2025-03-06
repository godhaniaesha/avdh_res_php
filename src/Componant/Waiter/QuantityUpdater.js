import React, { useState } from 'react';

const QuantityUpdater = () => {
  const [orderItems, setOrderItems] = useState([
    { id: 1, quantity: 1, sellingPrice: 100, totalPrice: 100 },
    { id: 2, quantity: 2, sellingPrice: 150, totalPrice: 300 }, // Example additional item
  ]);

  const updateQuantity = (index, change) => {
    setOrderItems((prev) => {
      const updatedItems = [...prev];
      const currentItem = updatedItems[index];

      const newQuantity = currentItem.quantity + change;

      if (newQuantity < 1) return prev; // Prevent quantity from going below 1

      currentItem.quantity = newQuantity;
      currentItem.totalPrice = currentItem.sellingPrice * currentItem.quantity; // Update total price

      return updatedItems;
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Counter Section for each item */}
      {orderItems.map((item, index) => (
        <div key={item.id} style={{ marginBottom: '20px' }}>
          <h1>{item.quantity}</h1> {/* Display the quantity for each item */}
          <button
            onClick={() => updateQuantity(index, 1)}
            style={{ fontSize: '20px', marginRight: '10px' }}
          >
            +
          </button>
          <button
            onClick={() => updateQuantity(index, -1)}
            style={{ fontSize: '20px' }}
          >
            -
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuantityUpdater;