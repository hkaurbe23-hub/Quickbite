import { useContext, useEffect, useState } from 'react';
import style from './placeorder.module.css';
import style1 from '../Cart/cart.module.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleProceedToPayment = (event) => {
    event.preventDefault();
    
    // Navigate to payment demo page with address data
    navigate("/payment-demo", {
      state: {
        addressData: data
      }
    });
  };

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  return (
    <form onSubmit={handleProceedToPayment} className={style.placeOrder}>
      <div className={style.placeOrderLeft}>
        <p className={style.title}>Delivery Details</p>

        <div className={style.multiInputs}>
          <input type="text" name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First Name" required />
          <input type="text" name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Last Name" required />
        </div>

        <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="Email Address" required />
        <input type="text" name="street" onChange={onChangeHandler} value={data.street} placeholder="Street" required />

        <div className={style.multiInputs}>
          <input type="text" name="city" onChange={onChangeHandler} value={data.city} placeholder="City" required />
          <input type="text" name="state" onChange={onChangeHandler} value={data.state} placeholder="State" required />
        </div>

        <div className={style.multiInputs}>
          <input type="text" name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder="Zip Code" required />
          <input type="text" name="country" onChange={onChangeHandler} value={data.country} placeholder="Country" required />
        </div>

        <input type="text" name="phone" onChange={onChangeHandler} value={data.phone} placeholder="Phone Number" required />
      </div>

      <div className={style.placeOrderRight}>
        <div className={style1.CartTotal}>
          <h2>Cart Total</h2>

          <div>
            <div className={style1.CartTotalDetails}>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className={style1.CartTotalDetails}>
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>

            <hr />

            <div className={style1.CartTotalDetails}>
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b>
            </div>
          </div>

          <button type="submit">Proceed To Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
