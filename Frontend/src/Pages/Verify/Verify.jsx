import React, { useEffect } from 'react';
import styles from './verify.module.css';
import { useNavigate } from 'react-router-dom';

const Verify = () => {

    const navigate = useNavigate();

    useEffect(() => {
        // Fake payment verification delay for demo
        setTimeout(() => {
            navigate("/myorders");
        }, 1000);
    }, []);

    return (
        <div className={styles.verify}>
            <div className={styles.spinner}></div>
            <p style={{ color: "white", marginTop: "20px" }}>Processing your order...</p>
        </div>
    );
};

export default Verify;
