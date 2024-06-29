import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Row, Col } from "reactstrap";
import Cookies from 'js-cookie';
import axios from "axios";
import "./checkout-product.css";

const CheckoutProduct = () => {
    const VND = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    const [discounts, setDiscounts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0); // State for totalAmount

    const accessToken = Cookies.get('accessToken');

    let cartItems = [];

    if (accessToken) {
        cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
    } else {
        cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    }

    const getSessionStorageItem = (key) => {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    };

    const shippingFee = getSessionStorageItem("shippingFee") || 0;

    // Format the total amount including shipping
    const formattedTotalAmount = VND.format(totalAmount + getSessionStorageItem("shippingFee") || 0);

    // Define fetchDiscounts outside of useEffect
    const fetchDiscounts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/discount/get-all-discounts');
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid data format');
            }
            const filteredDiscounts = response.data.filter(discount => {
                return totalAmount >= discount.condition.orderTotalMin;
            });
            setDiscounts(filteredDiscounts);
        } catch (error) {
            console.error('Error fetching discounts:', error);
        }
    };


    useEffect(() => {

        fetchDiscounts();

        if (accessToken) {
            setTotalAmount(Number(sessionStorage.getItem("total")) || 0);
        } else {
            setTotalAmount(Number(sessionStorage.getItem("totalAmount")) || 0);
        }
        // eslint-disable-next-line
    }, [accessToken, totalAmount]);

    return (
        <Col lg="8">
            <div className="booking__bottom">
                <h3>Tóm tắt</h3>
                <ListGroup className="booking__bottom-total">
                    <ListGroupItem className="total__booking border-0 px-0 total">
                        <Row>
                            <Col md="8" className="total__booking-price">
                                <ul className="list-product">
                                    {cartItems.map((product, index) => (
                                        <p key={index}>{product.quantity} x {product.productName}</p>
                                    ))}
                                </ul>
                            </Col>
                            <Col md="4">
                                {cartItems.map((product, index) => (
                                    <p key={index}>{VND.format(product.price)}</p>
                                ))}
                            </Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem className="total__quantity border-0 px-0">
                        <Row>
                            <Col md="6">Số lượng:</Col>
                            <Col md="6">{cartItems.reduce((total, item) => total + item.quantity, 0)}</Col>
                        </Row>
                    </ListGroupItem>
                    <hr />
                    <ListGroupItem className="total__booking border-0 px-0 total">
                        <Row>
                            <Col md="5">Tổng đơn hàng:</Col>
                            <Col md="7" className="total__booking-price">
                                <p>{VND.format(totalAmount)}</p>
                            </Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem className="total__booking border-0 px-0 total">
                        <Row>
                            <Col md="5">Phí vận chuyển:</Col>
                            <Col md="7" className="total__booking-price">
                                <p>{VND.format(shippingFee)}</p>
                            </Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem className="total__booking border-0 px-0 total">
                        <Row>
                            <Col md="5">Tổng cộng:</Col>
                            <Col md="7" className="total__booking-price">
                                <p>{formattedTotalAmount}</p>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </ListGroup>
            </div>

            <div className="booking-discount__bottom">
                <h3>Phiếu giảm giá</h3>
                <ListGroup className="booking__bottom-total">
                    {discounts.map((discount, index) => (
                        <ListGroupItem key={index} className="discount-item border-0 px-0">
                            <Row>
                                <Col md="3">
                                    <img src={discount.imagePath} alt={discount.code} className="discount-image" />
                                </Col>
                                <Col md="9" className="discount-details">
                                    <p className="discount-code">Mã | <span className="code">{discount.code}</span></p>
                                    <span className="discount-amount">Tối thiểu: {VND.format(discount.condition.orderTotalMin)}</span>
                                    |
                                    <span className="discount-amount">Tối đa: {VND.format(discount.condition.orderTotalMax)}</span>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        </Col>
    );
};

export default CheckoutProduct;
