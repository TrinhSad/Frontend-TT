import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Label, Button } from "reactstrap";
import posterImage from "../assets/images/poster.jpg";
import GoogleImg from "../assets/images/google-icon.webp"
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import Cookies from "js-cookie";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        userName: "",
        password: "",
        email: ""
    });

    const [showForgotPassword, setForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, credentials);

            const _id = res.data.userObj._id;
            // console.log(_id);

            // Set cookies with expiration (e.g., 7 days)
            Cookies.set('userId', _id, { expires: 7, path: '/' });
            Cookies.set('accessToken', res.data.Token.accessToken, { expires: 7, path: '/' });
            Cookies.set('refreshToken', res.data.Token.refreshToken, { expires: 7, path: '/' });

            setTimeout(() => {
                window.location.reload(navigate("/home"));
            }, 500);
        } catch (res) {
            if (res.status === 400) {
                setErrorMessage("Một lỗi đã xảy ra.");
            } else {
                setErrorMessage("Wrong username or password. Please try again.");
            }
            console.error("Login error:", res);
        }
    };

    const handleGoogleLogin = async () => {
        window.location.href = `${BASE_URL}/auth/google`;
    };

    const handleClickForgotPassword = () => {
        setForgotPassword(!showForgotPassword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const HandleForgot = async e => {
        e.preventDefault();
        if (credentials.email.trim() === "") {
            alert("Vui lòng nhập email!");
            setTimeout(() => {}, 2000);
            return;
        }
        try {
            const res = await axios.post(`${BASE_URL}/auth/forgot-password`, credentials);
            console.log(res);
            alert("Email đã được gửi đi! Vui lòng kiểm tra email của bạn.");
            setCredentials(prev => ({ ...prev, email: "" }));
            setTimeout(() => {}, 2000);
            return;
        } catch (err) {
            console.log(err);
            alert("User không tồn tại. Vui lòng nhập đúng email của bạn đã đăng ký");
            setTimeout(() => {}, 2000);
        }
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
                                <h2>ĐĂNG NHẬP</h2>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <Form>
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
                                    <p className="forgot-password" onClick={handleClickForgotPassword}>Bạn quên mật khẩu?</p>
                                    <Button className="button__login" onClick={handleSubmit}>Đăng nhập</Button>
                                    <span>Hoặc tiếp tục với</span>
                                    <Button className="button__login-google" onClick={handleGoogleLogin}>
                                        <img src={GoogleImg} className="google-img"
                                        alt="" />
                                        Đăng nhập bằng Google
                                        </Button>
                                    <p className="btn-register">Bạn chưa có tài khoản? <Link to='/register' onClick={scollToTop}>Đăng ký</Link></p>
                                </Form>
                            </div>
                        )}
                    </div>
                    {showForgotPassword && (
                        <div className="overlay" style={{ bottom: showForgotPassword ? 0 : "-100%" }}>
                            <div className="forgot-password__form">
                                <div className="close-btn" onClick={handleClickForgotPassword}>
                                    <span aria-hidden="true">&times;</span>
                                </div>
                                <h2>Bạn quên mật khẩu?</h2>
                                <h4>Đừng lo lắng, bạn có thể đặt lại dễ dàng.</h4>
                                <p>Chúng tôi sẽ gửi cho bạn một email có liên kết để đặt lại mật khẩu của bạn.</p>
                                <Form>
                                    <FormGroup className="login__input">
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Label className="input__place" for="username">Địa chỉ email của bạn *</Label>
                                    </FormGroup>
                                    <Button className="button__forgot" onClick={HandleForgot}>Gửi Email Đặt lại Mật khẩu</Button>
                                </Form>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Login;
