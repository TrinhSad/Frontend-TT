import React, { useEffect, useState, useCallback } from "react";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/config";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const accessToken = Cookies.get("accessToken");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getCart = useCallback(async () => {
    if (accessToken) {
      try {
        const response = await axios.get(`${BASE_URL}/cart/get-cart`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = response.data.cart.products;
        const cart = data.map((item) => ({
          _id: item.product._id,
          productName: item.product.productName,
          price: item.product.price,
          imagePath: item.product.imagePath,
          quantity: item.quantity,
          // totalPrice: item.product.price * item.quantity,
        }));

        const totalAmount = response.data.cart.totalAmount;
        setLoading(false);
        setCart(cart);
        setTotalAmount(totalAmount);
        sessionStorage.setItem("cart", JSON.stringify(cart));
        sessionStorage.setItem("total", JSON.stringify(totalAmount));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching cart data:", error);
      }
    } else {
      const cart = JSON.parse(sessionStorage.getItem("cartItems")) || [];
      const totalAmount = JSON.parse(sessionStorage.getItem("totalAmount")) || 0;
      setLoading(false);
      setCart(cart);
      setTotalAmount(totalAmount);
    }
  }, [accessToken]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const deleteItem = async (_id) => {
    if (accessToken) {
      try {
        await axios.post(`${BASE_URL}/cart/remove-from-cart`, {
          productId: _id,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        getCart();
        window.location.reload();
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    } else {
      dispatch(cartActions.deleteItem(_id));
      getCart();
      window.location.reload();
      scrollToTop();
    }
  };

  const incrementQuantity = async (_id, currentQuantity) => {
    if (accessToken) {
      try {
        await axios.put(
          `${BASE_URL}/cart/update-cart-item`,
          {
            productId: _id,
            quantity: currentQuantity + 1,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        getCart();
        window.location.reload();
      } catch (error) {
        console.error("Error increasing quantity:", error);
      }
    } else {
      dispatch(cartActions.addItem({
        _id,
      }));
      getCart();
      window.location.reload();
      scrollToTop();
    }
  };

  const decrementQuantity = async (_id, currentQuantity) => {
    if (accessToken && currentQuantity > 1) {
      try {
        await axios.put(
          `${BASE_URL}/cart/update-cart-item`,
          {
            productId: _id,
            quantity: currentQuantity - 1,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        getCart();
        window.location.reload();
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    }
    else if (!accessToken && currentQuantity > 1) {
      dispatch(cartActions.removeItem(_id));
      getCart();
      window.location.reload();
      scrollToTop();
    } else if (!accessToken && currentQuantity === 1) {
      dispatch(cartActions.deleteItem(_id));
      getCart();
      window.location.reload();
      scrollToTop();
    }
  };

  return (
    <>
      <Helmet title="Cart">
        <section>
          <Container>
            <Row>
              <Col lg="12" className="cart-page">
                {loading && (
                  <div className="text-center pt-5">
                    <div className="spinner-border" role="status">
                      <span className="sr-only"></span>
                    </div>
                  </div>
                )}
                {error && <h4 className="text-center pt-5">{error}</h4>}

                {!loading && !error && (
                  <>
                    {cart.length === 0 ? (
                      <div className="text-center pt-5">
                        <h5>GIỎ HÀNG BẠN ĐANG RỖNG</h5>
                        <Link to="/pizzas">
                          <button className="addTOCart__btn mt-4" onClick={scrollToTop}>
                            Tiếp tục Mua Hàng
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <h5 className="mb-4">GIỎ HÀNG CỦA TÔI</h5>
                        <table className="table table-borderless mb-5 align-middle">
                          <tbody>
                            {cart.map((item) => (
                              <Tr
                                item={item}
                                key={item._id}
                                deleteItem={deleteItem}
                                incrementQuantity={incrementQuantity}
                                decrementQuantity={decrementQuantity}
                              />
                            ))}
                          </tbody>
                        </table>
                        <div className="cart__total mt-4">
                          <h6>
                            Tổng đơn hàng:
                            <span className="cart__subtotal"> {VND.format(totalAmount)}</span>
                          </h6>
                          <p>Thuế và phí vận chuyển sẽ được tính khi thanh toán.</p>
                          <div className="cart__page-btn">
                            <Link to="/pizzas">
                              <button className="addTOCart__btn me-4" onClick={scrollToTop}>
                                Tiếp tục Mua Hàng
                              </button>
                            </Link>
                            <Link to="/order">
                              <button className="addTOCart__btn" onClick={scrollToTop}>
                                Chuyển đến Đặt hàng
                              </button>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </Helmet>
    </>
  );

};

const Tr = ({ item, deleteItem, incrementQuantity, decrementQuantity }) => {
  const { _id, imagePath, productName, price, quantity } = item;

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <tr>
      <td className="text-center cart__img-box">
        <img src={imagePath} alt="" />
      </td>
      <td className="text-center">{productName}</td>
      <td className="text-center">{VND.format(price)}</td>
      <td className="text-center">
        <button className="quantity-btn" onClick={() => decrementQuantity(_id, quantity)} disabled={quantity === 1}>
          -
        </button>
        <span className="quantity">{quantity}</span>
        <button className="quantity-btn" onClick={() => incrementQuantity(_id, quantity)}>+</button>
      </td>
      <td className="text-center cart__item-del">
        <i className="ri-delete-bin-line" onClick={() => deleteItem(_id)}></i>
      </td>
    </tr>
  );
};

export default Cart;
