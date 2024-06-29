import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Form, FormGroup, Button, Label } from "reactstrap";
import "../styles/login.css";
import Menu from "../components/Menu/Menu";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Cookies from "js-cookie";

const EditProfile = () => {
    const navigate = useNavigate();

    const Token = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    const [isInfoChanged, setIsInfoChanged] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [credentials, setCredentials] = useState({
        userName: "",
        fullName: "",
        phone: "",
        email: ""
    });

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
        setIsInfoChanged(true);
    }

    const getInfoUser = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/get-info-user`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                        'refresh-token': refreshToken
                    }
                }
            );
    
            const userData = res.data.user;
            setCredentials({
                userName: userData.userName || '',
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || ''
            });
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getInfoUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await axios.put(`${BASE_URL}/auth/update-profile`, 
                credentials, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                    'refresh-token': refreshToken
                }
            });

            if (!isInfoChanged) {
                toggleConfirmation();
                return;
            }
            alert("Thông tin đã được cập nhật thành công.");
    
            setTimeout(() => {
                window.location.reload( navigate("/"));
            }, 500);
        } catch (err) {
            console.log(err);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    }

    const handleConfirmationYes = () => {
        toggleConfirmation();
        setIsInfoChanged(true);
        alert("Thông tin đã được cập nhật thành công.");
        setTimeout(() => {
            navigate("/");
            window.location.reload();
        }, 500);
    };

    const handleConfirmationNo = () => {
        toggleConfirmation();
    };

    const toggleConfirmation = () => {
        setShowConfirmation(!showConfirmation);
    };

    return (
        <div className="login-row">
            <Row className="w-100">
                <Col lg="4" className="mx-auto d-flex">
                    <Menu />
                </Col>
                <Col>
                    <div className="login-container">
                        <div className="login-form">
                            <h2>CHI TIẾT TÀI KHOẢN</h2>
                            <Form onSubmit={handleSubmit}>
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
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                        disabled
                                        className="disabled-input"
                                    />
                                    <Label className="input__place-email" for="email">Địa chỉ email của bạn <span>*</span></Label>
                                </FormGroup>
                                <Button className="button__register" type="submit">Cập nhật tài khoản</Button>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal isOpen={showConfirmation} toggle={toggleConfirmation}>
                <ModalHeader toggle={toggleConfirmation}>Xác nhận</ModalHeader>
                <ModalBody>
                    Hiện không có thông tin nào thay đổi, quý khách có đồng ý vẫn lưu thông tin này không?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleConfirmationYes}>
                        Có
                    </Button>{' '}
                    <Button color="secondary" onClick={handleConfirmationNo}>
                        Không
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default EditProfile;
