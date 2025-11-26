import { useNavigate } from 'react-router-dom';
import style from './ordersuccess.module.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className={style.successContainer}>
      <div className={style.successCard}>
        <div className={style.checkmarkIcon}>✓</div>
        <h1 className={style.heading}>Order Successfully Placed!</h1>
        <p className={style.subText}>Your order is being prepared. Thank you for shopping!</p>
        <button 
          onClick={() => navigate('/')} 
          className={style.homeButton}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;


