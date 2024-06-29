import React, { useState } from "react";
import { Row } from "reactstrap";
import { Form, FormGroup, Label, Button } from "reactstrap";
import "../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useNavigate, useParams} from "react-router-dom";

const ResetPassword = () => {
    const [credentials, setCredentials] = useState({
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const resetToken = useParams().resetToken;

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (credentials.password !== credentials.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp.");
            setTimeout(() => {}, 2000);
            return;
        }
        try {
            await axios.patch(
                `${BASE_URL}/auth/reset-password/${resetToken}`, 
                { password: credentials.password },
                { headers: { Authorization: `Bearer ${resetToken}` } }
            );

            alert("Mật khẩu đã được thay đổi.");
            setTimeout(() => {}, 2000);
    
            setCredentials(prev => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));
            window.location.reload(navigate("/login"))
    
        } catch (res) {
            if(res.status === 400) {
                console.log(res);
            } else {
                alert("Một lỗi đã xảy ra.");
            }
        }
    }

    const togglePasswordVisibility = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    return (
        <div className="login-row">
            <Row>

                <div className="login-container">
                    <div className="mx-auto reset__password-form">
                        <h2>CẬP NHẬT MẬT KHẨU CỦA BẠN</h2>
                        <p>Đừng lo lắng, bạn có thể đặt lại dễ dàng.</p>
                        <Form>
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
                                <span className="d-flex show-password" onClick={() => togglePasswordVisibility('password')}>
                                    {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </FormGroup>
                            <FormGroup className="login__input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={credentials.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <Label className="input__place" for="password"> Xác nhận Mật khẩu <span>*</span></Label>
                                <span className="d-flex show-password" onClick={() => togglePasswordVisibility('confirmPassword')}>
                                    {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </FormGroup>
                            <Button className="button__register" onClick={handleSubmit}>Đổi mật khẩu</Button>
                        </Form>

                    </div>
                </div>
            </Row>
        </div>
    );
};

export default ResetPassword;
