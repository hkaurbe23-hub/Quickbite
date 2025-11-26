import React, { useState, useEffect } from 'react';
import styles from "./myOrder.module.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    // Sort by date (newest first)
    const sortedOrders = savedOrders.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });
    setOrders(sortedOrders);
    setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatItems = (items) => {
    if (!items || items.length === 0) return 'No items';
    return items.map((item, index) => {
      const itemName = item.name || 'Unknown Item';
      const quantity = item.quantity || 1;
      if (index === items.length - 1) {
        return `${itemName} × ${quantity}`;
      } else {
        return `${itemName} × ${quantity}, `;
      }
    }).join('');
  };

  if (loading) {
    return (
      <div className={styles.myorders}>
        <h2>My Orders</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.myorders}>
        <h2>My Orders</h2>
        <div className={styles.emptyContainer}>
          <p>You have no orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.myorders}>
      <h2>My Orders</h2>

      <div className={styles.container}>
        {orders.map((order, index) => {
          const orderNumber = order.id || order._id || `order_${index + 1}`;
          const orderIdDisplay = typeof orderNumber === 'string' && orderNumber.includes('order_') 
            ? orderNumber.slice(-6).toUpperCase() 
            : String(orderNumber).slice(-6).toUpperCase();
          const paymentMethod = order.paymentMethod || (order.payment ? 'UPI' : 'COD') || 'N/A';
          
          return (
            <div key={order.id || order._id || index} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <h3>Order #{orderIdDisplay}</h3>
              </div>
              
              <div className={styles.orderBody}>
                <div className={styles.orderRow}>
                  <span className={styles.label}>Status:</span>
                  <span className={styles.status}>{order.status || 'Preparing'}</span>
                </div>
                
                <div className={styles.orderRow}>
                  <span className={styles.label}>Items:</span>
                  <span className={styles.value}>{formatItems(order.items)}</span>
                </div>
                
                <div className={styles.orderRow}>
                  <span className={styles.label}>Total:</span>
                  <span className={styles.value}>${order.amount || order.total || 0}.00</span>
                </div>
                
                <div className={styles.orderRow}>
                  <span className={styles.label}>Payment Method:</span>
                  <span className={styles.value}>{paymentMethod}</span>
                </div>
                
                <div className={styles.orderRow}>
                  <span className={styles.label}>Date:</span>
                  <span className={styles.value}>{formatDate(order.date || order.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
