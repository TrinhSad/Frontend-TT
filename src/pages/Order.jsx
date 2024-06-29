import React, { useState, useEffect } from "react";
import { Form, FormGroup } from "reactstrap";
import { Button } from "reactstrap";
import { Col, Row } from "reactstrap";
import axios from "axios";
import "../styles/checkout.css";
import { BASE_URL } from "../utils/config";
import VNPAYImg from "../assets/images/vnpayrow.png"
import CheckoutProduct from "../components/CheckoutProduct/CheckoutProduct";
import Cookies from "js-cookie";

const Order = () => {
  const [isUserDataFilled, setIsUserDataFilled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const savedAddressesFromSessionStorage = sessionStorage.getItem("savedAddresses");
  let addressString = "";
  if (savedAddressesFromSessionStorage) {
    const parsedAddresses = JSON.parse(savedAddressesFromSessionStorage);
    if (Array.isArray(parsedAddresses) && parsedAddresses.length > 0) {
      addressString = parsedAddresses[0];
    }
  }

  const accessToken = Cookies.get("accessToken");
  const shippingFee = parseFloat(sessionStorage.getItem("shippingFee")) || 0;
  const nearestShopId = sessionStorage.getItem("nearestShopId") || "";

  const getCartProducts = () => {
    let cart = [];
    if (accessToken) {
      cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    } else {
      cart = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    }

    return cart.map(item => ({
      productId: item._id,
      quantity: item.quantity,
    }));
  };


  const [order, setOrder] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: addressString,
    shopId: nearestShopId,
    paymentMethod: "",
    voucherCode: "",
    shippingFee: shippingFee,
    products: getCartProducts(),
  });

  console.log("order:", order);

  useEffect(() => {
    if (accessToken) {
      const getUserInfo = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/user/get-info-user`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              }
            }
          );
          const userData = res.data.user;
          setOrder((prevOrder) => ({
            ...prevOrder,
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
          }));
          setIsUserDataFilled(false);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      getUserInfo();
    }
  }, [accessToken]);

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setOrder((prevOrder) => ({ ...prevOrder, paymentMethod: method }));
  };

  const handleChange = (e) => {
    if (!isUserDataFilled) {
      setOrder((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!order.paymentMethod) {
      return alert("Vui lòng chọn phương thức thanh toán");
    }

    try {
      let res;
      if(accessToken) {
        res = await axios.post(
          `${BASE_URL}/order/create-order`, 
          order,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        res = await axios.post(`${BASE_URL}/order/create-order`, order);
      }

      const orderId = res.data.newOrder._id;

      if (order.paymentMethod === "CASH") {
        alert("Đặt hàng thành công");
        window.location.href = "/thank-you";
        sessionStorage.removeItem("cartItems");
        sessionStorage.removeItem("totalQuantity");
        sessionStorage.removeItem("totalAmount");
      } else if (order.paymentMethod === "ONLINE" && !accessToken) {
        try {
          const res = await axios.post(
            `${BASE_URL}/checkout/create-checkout/${orderId}`,
          );

          if (res.data && res.data.data) {
            window.location.href = res.data.data;
          } else {
            alert("Không thể lấy URL thanh toán. Vui lòng thử lại sau.");
          }
        } catch (error) {
          console.error("Error processing VNPAY payment:", error);
          alert("Thanh toán thất bại. Vui lòng thử lại sau");
        }
        sessionStorage.removeItem("cartItems");
        sessionStorage.removeItem("totalQuantity");
        sessionStorage.removeItem("totalAmount");
      } else if (order.paymentMethod === "ONLINE" && accessToken) {
        try {
          const res = await axios.post(
            `${BASE_URL}/checkout/create-checkout/${orderId}`,
            {},
          );

          if (res.data && res.data.data) {
            window.location.href = res.data.data;
          } else {
            alert("Không thể lấy URL thanh toán. Vui lòng thử lại sau.");
          }
        } catch (error) {
          console.error("Error processing VNPAY payment:", error);
          alert("Thanh toán thất bại. Vui lòng thử lại sau");
        }
      }

    } catch (error) {
      console.error("Error in handleClick:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại sau");
    }
  };

  return (
    <>
      <Row className="w-100">
        <Col lg="7">
          <div className="booking">
            <div className="booking__form">
              <h3>Thông tin Thanh toán</h3>
              <Form className="booking__info-form"> 
                <h6>Thông tin liên hệ (nhận vé/phiếu thanh toán)</h6>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Họ và tên*"
                    id="fullName"
                    required
                    onChange={handleChange}
                    value={order.fullName || ""}
                  />
                </FormGroup>
                <p>như trên CMND (không dấu)</p>
                <FormGroup>
                  <input
                    type="email"
                    placeholder="Email*"
                    id="email"
                    required
                    onChange={handleChange}
                    value={order.email || ""}
                  />
                </FormGroup>
                <p>VD: email@example.com</p>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Số điện thoại*"
                    id="phone"
                    required
                    onChange={handleChange}
                    value={order.phone || ""}
                  />
                </FormGroup>
                <p>
                  VD: +84 901234567 trong đó (+84) là mã quốc gia và 901234567
                  là số di động
                </p>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Địa chỉ*"
                    id="address"
                    required
                    onChange={handleChange}
                    value={order.address || ""}
                  />
                </FormGroup>
                <p>VD: 123 Nguyễn Chí Thanh, Hà Nội</p>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Mã giảm giá*"
                    id="voucherCode"
                    required
                    onChange={handleChange}
                    value={order.voucherCode || ""}
                  />
                </FormGroup>
                <p>VD: ANGACUNGTRINHSAD</p>
              </Form>
            </div>
            <br />
            <div className="payment-method">
              <h6>Phương thức thanh toán:</h6>
              <Button
                className={`btn-payment ${paymentMethod === "CASH" ? "active" : ""}`}
                onClick={() => handlePaymentMethod("CASH")}
              >
                Thanh toán bằng tiền mặt
              </Button>

              <Button
                className={`btn-payment ${paymentMethod === "ONLINE" ? "active" : ""}`}
                onClick={() => handlePaymentMethod("ONLINE")}
              >
                Thanh toán bằng ví VNPAY
                <img src={VNPAYImg} alt="VNPay" />
              </Button>
            </div>
            <div className="button__booking-payment" onClick={handleClick}>
              <Button className="button__continue">Đặt Hàng</Button>
            </div>
          </div>
        </Col>
        <Col lg="5">
          <CheckoutProduct />
        </Col>
      </Row>
    </>
  );
};

export default Order;
