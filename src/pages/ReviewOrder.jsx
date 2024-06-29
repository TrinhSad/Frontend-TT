import React, { useState, useEffect } from "react";
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import '../styles/review-order.css';
import { BASE_URL } from "../utils/config";
import Menu from "../components/Menu/Menu";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const ReviewOrder = () => {
    const [transactions, setTransactions] = useState([]);
    const [productNames, setProductNames] = useState({});

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const accessToken = Cookies.get('accessToken');
                const refreshToken = Cookies.get('refreshToken');

                const response = await axios.get(`${BASE_URL}/order/get-history`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'refresh-token': refreshToken
                    }
                });

                setTransactions(response.data.orders);

                const productNamesMap = {};
                await Promise.all(
                    response.data.orders.map(async (order) => {
                        await Promise.all(
                            order.products.map(async (product) => {
                                if (!productNamesMap[product.productId]) {
                                    const productResponse = await axios.get(`${BASE_URL}/product/get-product/${product.productId}`);
                                    productNamesMap[product.productId] = productResponse.data.product.productName;
                                }
                            })
                        );
                    })
                );
                setProductNames(productNamesMap);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);


    const handleViewDetail = async (orderId) => {
        try {
            const res = await axios.post(`${BASE_URL}/checkout/create-checkout/${orderId}`);

            if (res.data && res.data.data) {
                window.location.href = res.data.data;
            }
        } catch (error) {
            console.error("Error initiating checkout:", error);
        }
    };

    return (
        <div className="login-row">
            <Row className="w-100">
                <Col md="4" className="mx-auto d-flex">
                    <Menu />
                </Col>
                <Col md="8" className="purchase-list__item mx-auto">
                    <h2 className="purchase-list__title">Đang giao dịch ({transactions.length})</h2>
                    {transactions && transactions.length === 0 ? (
                        <div className="purchase-list__empty">
                            <br />
                            <p>Không có giao dịch nào</p>
                        </div>
                    ) : (
                        <>
                            {transactions.map(transaction => (
                                <Row key={transaction._id} className="mb-4 purchase-list-card">
                                    <Col md="12">
                                        <div className="purchase__list-name">
                                            <div className="purchase__booking-id">
                                                Mã đặt món Tasty Treat | <span>{transaction._id}</span>
                                            </div>
                                            <div className="purchase__product">
                                                <div className="selected-transaction-details">
                                                    <ul>
                                                        {transaction.products.map(product => (
                                                            <li key={product._id}>
                                                                {productNames[product.productId]} | Số lượng: {product.quantity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="purchase__tourName"><i className="ri-map-pin-2-fill"></i>Địa chỉ giao hàng: <span>{transaction.address}</span></div>
                                            <div className="purchase__payment-status" >
                                                <p style={{ backgroundColor: transaction.payment.status === 'FAILED' ? 'red' : 'blue' }}>Trạng thái thanh toán: {transaction.payment.status}</p>
                                                <p>Phương thức thanh toán: {transaction.paymentMethod}</p>
                                            </div>
                                            <div className="purchase-right-content">
                                                <div className="purchase__totalAmount">{transaction.totalAmount.toLocaleString()} VND</div>
                                                {(transaction.payment.status === 'PENDING' && transaction.paymentMethod === 'ONLINE') && (
                                                    <Link to="#" onClick={() => handleViewDetail(transaction._id)}>
                                                        <p className="purchase-details">Thanh toán</p>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ReviewOrder;
