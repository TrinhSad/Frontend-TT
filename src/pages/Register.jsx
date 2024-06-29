import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Button, Label } from "reactstrap";
import posterImage from "../assets/images/poster.jpg";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { FaEye, FaEyeSlash, FaRedo } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const Register = () => {
    const [credentials, setCredentials] = useState({
        fullName: "",
        email: "",
        phone: "",
        userName: "",
        password: ""
    });

    const [userId, setUserId] = useState("");

    const [otp, setOtp] = useState({
        otp: "",
    })

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showEmailOTP, setShowEmailOTP] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    };

    const handleChangeOTP = (e) => {
        setOtp({
            ...otp,
            [e.target.id]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${BASE_URL}/auth/register`,
                credentials
            );
            const result = response.data.user._id;
            setUserId(result);
            // console.log(result);
            setShowEmailOTP(true);
        } catch (res) {
            if (res.status === 400) {
                setErrorMessage(`User with email  ${credentials.email} already exists`);
            } else {
                setErrorMessage("Một lỗi đã xảy ra.");
            }
            console.error("Registration error:", res.data);
        }
    };

    const handleSubmitOTP = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${BASE_URL}/auth/verify-otp?userId=${userId}`,
                otp
            );
            window.alert("Xác thực đăng ký thành công");
            window.location.reload(navigate("/login"));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Một lỗi đã xảy ra.");
            }
            console.error("OTP verification error:", error.response.data);
        }
    };

    const handleResendOTP = async () => {
        try {
            await axios.post(
                `${BASE_URL}/auth/resend-otp?userId=${userId}`
            );
            window.alert("OTP mới đã được gửi đến email của bạn.");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Một lỗi đã xảy ra khi gửi lại OTP.");
            }
            console.error("Resend OTP error:", error.response.data);
        }
    };

    const handleClickEmailOTP = () => {
        setShowEmailOTP(false);
    };

    const scollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="login-row">
            <Row className="w-100">
                <Col lg={{ size: 5, offset: 1 }} className="login__img">
                    <img src={posterImage} alt="Poster" />
                </Col>
                <Col>
                    <div className="login-container">
                        {isLoggedIn ? (
                            <div className="login-form">
                                <h2>Bạn đã đăng nhập</h2>
                                <p>Bạn đã đăng nhập vào hệ thống.</p>
                                <Button className="button__login" onClick={() => navigate("/")}>Về Trang Chủ</Button>
                            </div>
                        ) : (
                            <div className="login-form">
                                <h2>TẠO TÀI KHOẢN</h2>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup className="login__input">
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={credentials.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="fullName">Họ và tên của bạn <span>*</span></Label>
                                    </FormGroup>
                                    <FormGroup className="login__input">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="email">Địa chỉ email của bạn <span>*</span></Label>
                                    </FormGroup>
                                    <FormGroup className="login__input">
                                        <input
                                            type="phone"
                                            id="phone"
                                            name="phone"
                                            value={credentials.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="phone">Số điện thoại <span>*</span></Label>
                                    </FormGroup>
                                    <FormGroup className="login__input">
                                        <input
                                            type="text"
                                            id="userName"
                                            name="userName"
                                            value={credentials.userName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="userName">Tên tài khoản <span>*</span></Label>
                                    </FormGroup>
                                    <FormGroup className="login__input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="password">Mật khẩu <span>*</span></Label>
                                        <span className="d-flex show-password" onClick={togglePasswordVisibility}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </FormGroup>
                                    <Button className="button__register" onClick={handleSubmit}>Tạo tài khoản</Button>
                                </Form>
                                <p className="btn-register">Bạn đã có tài khoản <Link to='/login' onClick={scollToTop}>Đăng nhập</Link></p>
                            </div>
                        )}
                    </div>
                    {showEmailOTP && (
                        <div className="overlay" style={{ bottom: showEmailOTP ? 0 : "-100%" }}>
                            <div className="otp-email__form mx-auto">
                                <div className="close-btn" onClick={handleClickEmailOTP}>
                                    <span aria-hidden="true">&times;</span>
                                </div>
                                <h2>Xác thực OTP</h2>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <Form>
                                    <FormGroup className="login__input d-flex align-items-center">
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            value={otp.otp}
                                            onChange={handleChangeOTP}
                                            required
                                        />
                                        <Label className="input__place" for="otp">Nhập mã OTP <span>*</span></Label>
                                        <span className="d-flex show-password ml-2" onClick={handleResendOTP} title="Resend OTP">
                                            <FaRedo />
                                        </span>
                                    </FormGroup>
                                    <p>OTP đã được gửi về địa chỉ email đăng ký. Quý khách vui lòng nhập mã OTP để tiếp tục thực hiện đăng ký tài khoản.</p>
                                    <Button className="button__forgot" onClick={handleSubmitOTP}>Gửi</Button>
                                </Form>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Register;
