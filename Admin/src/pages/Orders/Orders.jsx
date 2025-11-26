import React, { useState, useEffect } from 'react';
import './orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from "../../assets/assets";
import URl from "../../config";   // ✅ Correct import

const Orders = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = () => {
    // Read orders from sharedOrders localStorage
    const adminOrders = JSON.parse(localStorage.getItem("sharedOrders")) || [];
    
    // Transform orders to match expected structure
    const transformedOrders = adminOrders.map((order) => ({
      _id: order.id || order._id,
      items: order.items || [],
      amount: order.amount || order.total || 0,
      status: order.status || "Food is Getting Ready!",
      address: order.address || {
        firstName: "Demo",
        lastName: "User",
        street: "Demo Address",
        city: "Demo City",
        state: "Demo State",
        country: "Demo Country",
        zipcode: "00000",
        phone: "0000000000"
      },
      date: order.date || order.createdAt,
      isLocalStorage: true
    }));

    setOrders(transformedOrders);
  };

  const statusHandler = (event, orderId) => {
    // Update order status in sharedOrders localStorage
    const adminOrders = JSON.parse(localStorage.getItem("sharedOrders")) || [];
    const updatedOrders = adminOrders.map(order => {
      const orderIdToMatch = order.id || order._id;
      if (orderIdToMatch === orderId || String(orderIdToMatch) === String(orderId)) {
        return { ...order, status: event.target.value };
      }
      return order;
    });
    localStorage.setItem("sharedOrders", JSON.stringify(updatedOrders));
    toast.success("Order status updated");
    fetchAllOrders(); // Refresh the list
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.map((order, index) => (
          <div key={order._id || index} className="order-item">
            
            <img src={assets.parcel_icon} alt="" />

            <div>
              {/* FOOD LIST */}
              <p className="order-item-food">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, itemIndex) => {
                    return itemIndex === order.items.length - 1
                      ? item.name + " x " + item.quantity
                      : item.name + " x " + item.quantity + ", ";
                  })
                ) : (
                  "No items"
                )}
              </p>

              {/* CUSTOMER NAME */}
              <p className="order-item-name">
                {order.address ? (order.address.firstName + " " + (order.address.lastName || "")) : "Demo User"}
              </p>

              {/* ADDRESS */}
              <div className="order-item-address">
                {order.address ? (
                  <>
                    <p>{order.address.street + ","}</p>
                    <p>
                      {order.address.city + ", " + order.address.state + ", " +
                       order.address.country + ", " + order.address.zipcode}
                    </p>
                  </>
                ) : (
                  <p>Demo Address</p>
                )}
              </div>

              {/* PHONE */}
              <p className="order-item-phone">{order.address ? order.address.phone : "N/A"}</p>
            </div>

            <p>Items: {order.items ? order.items.length : 0}</p>
            <p>${order.amount || 0}</p>

            {/* STATUS DROPDOWN */}
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status || "Food is Getting Ready!"}
            >
              <option value="Food is Getting Ready!">Food is Getting Ready!</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
