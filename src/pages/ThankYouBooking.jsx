import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../utils/config";
import "../styles/hero-section.css"
import FastImg2 from '../assets/images/fast.png';

const ThankYouBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const confirmCheckout = async () => {
            try {
                await axios.get(`${BASE_URL}/checkout/confirm-checkout${location.search}`);
            } catch (error) {
                console.error("Error confirming checkout:", error.message);
            }
        };
        confirmCheckout();
    }, [location.search]);

    useEffect(() => {
        const timer =
            countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
        if (countdown === 0) {
            navigate('/');
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return () => clearInterval(timer);
    }, [countdown, navigate]);

    return (
        <div className="success-form">
            <img src={FastImg2} alt="" />
            <h2>Đặt món thành công!</h2>
            <h6>Món ăn sẽ được chuẩn bị và giao đến bạn nhanh nhất có thể. Hãy chờ đợi nhé!</h6>
            <h6>Đang chuyển hướng về trang chủ trong {countdown} giây...</h6>
        </div>
    );
};

export default ThankYouBooking;
