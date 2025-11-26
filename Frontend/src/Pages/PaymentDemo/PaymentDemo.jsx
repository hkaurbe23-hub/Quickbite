import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import style from './paymentdemo.module.css';

const PaymentDemo = () => {
  const navigate = useNavigate();
  const { cartItems, food_list, getTotalCartAmount } = useContext(StoreContext);
  
  const [method, setMethod] = useState('upi');
  const [status, setStatus] = useState('select'); // select, processing

  const handleConfirm = () => {
    if (!method) {
      return;
    }

    // Set status to processing
    setStatus('processing');

    // Simulate payment processing delay - navigate after 3 seconds
    setTimeout(() => {
      // Prepare order items from cart
      const orderItems = [];
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          orderItems.push({
            name: item.name,
            quantity: cartItems[item._id],
            price: item.price
          });
        }
      });

      // Calculate total
      const totalAmount = getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 5);

      // Create new order object
      const newOrder = {
        id: Date.now(),
        _id: `order_${Date.now()}`,
        items: orderItems,
        amount: totalAmount,
        total: totalAmount,
        paymentMethod: method.toUpperCase(),
        status: "Preparing",
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      existingOrders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      // Save to user localStorage
      localStorage.setItem("sharedOrders", JSON.stringify(existingOrders));

      // Also write into admin localStorage using an iframe trick
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "http://localhost:5174";  // ADMIN APP ORIGIN
      document.body.appendChild(iframe);

      iframe.onload = () => {
        try {
          iframe.contentWindow.localStorage.setItem("sharedOrders", JSON.stringify(existingOrders));
        } catch (err) {
          console.log("Cross-port storage sync failed:", err);
        }
        document.body.removeChild(iframe);
      };

      // Navigate to success page
      navigate('/order-success');
    }, 3000);
  };

  return (
    <div className={style.paymentDemo}>
      <div className={style.paymentContainer}>
        {status === 'select' && (
          <>
            <h1 className={style.heading}>Payment Processing</h1>
            
            <div className={style.radioGroup}>
              <label className={style.radioLabel}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={method === 'upi'}
                  onChange={(e) => setMethod(e.target.value)}
                  className={style.radioInput}
                />
                <span className={style.radioText}>UPI</span>
              </label>

              <label className={style.radioLabel}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={method === 'cod'}
                  onChange={(e) => setMethod(e.target.value)}
                  className={style.radioInput}
                />
                <span className={style.radioText}>Cash on Delivery (COD)</span>
              </label>
            </div>

            <button onClick={handleConfirm} className={style.confirmButton}>
              Confirm & Pay
            </button>
          </>
        )}

        {status === 'processing' && (
          <div className={style.processingContainer}>
            <div className={style.spinner}></div>
            <p className={style.processingText}>Payment is being processed…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDemo;

