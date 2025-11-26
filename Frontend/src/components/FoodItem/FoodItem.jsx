import React, { useContext } from 'react';
import style from './fooditem.module.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import URl from "../../config";   // ✅ FIXED — import URL correctly

const FoodItem = ({ id, name, price, description, image }) => {

    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);  
    // ✅ FIXED — use cartItems (correct name)

    return (
        <div className={style.FoodItem}>
            <div className={style.FoodItemImageContainer}>
                
                {/* FOOD IMAGE */}
                <img
                    className={style.FoodItemImage}
                    src={`${URl}/images/${image}`}
                    alt=""
                />

                {/* ADD / REMOVE BUTTONS */}
                {!cartItems[id] ? (
                    <img
                        className={style.add}
                        onClick={() => addToCart(id)}
                        src={assets.add_icon_white}
                        alt=""
                    />
                ) : (
                    <div className={style.FoodItemCount}>
                        <img
                            src={assets.remove_icon_red}
                            onClick={() => removeFromCart(id)}
                            alt=""
                        />
                        <p>{cartItems[id]}</p>
                        <img
                            src={assets.add_icon_green}
                            onClick={() => addToCart(id)}
                            alt=""
                        />
                    </div>
                )}
            </div>

            <div className={style.FoodItemInfo}>
                <div className={style.FoodItemName}>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>

                <p className={style.FoodItemDescription}>
                    {description}
                </p>

                <p className={style.FoodItemPrice}>${price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
