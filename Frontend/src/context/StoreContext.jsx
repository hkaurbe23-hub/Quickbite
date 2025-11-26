import { createContext, useEffect, useState } from "react";
import axios from "axios";
import URl from "../config";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});   // ✅ FIXED (renamed)
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Add to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
    }));

    if (token) {
      await axios.post(
        `${URl}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {

    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1
    }));

    if (token) {
      await axios.post(
        `${URl}/api/cart/remove`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // Calculate total
  const getTotalCartAmount = () => {
    let total = 0;

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find(
          (product) => product._id === itemId
        );

        if (itemInfo) {
          total += itemInfo.price * cartItems[itemId];
        }
      }
    }

    return total;
  };

  // Fetch food list
  const fetchFoodList = async () => {
    const response = await axios.get(`${URl}/api/food/list`);
    setFoodList(response.data.data);
  };

  // Load user cart
  const loadCartData = async (token) => {
    const response = await axios.post(
      `${URl}/api/cart/get`,
      {},
      { headers: { token } }
    );

    setCartItems(response.data.cartData || {});
  };

  // Load everything on refresh
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,     // ✅ FIXED KEY
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
