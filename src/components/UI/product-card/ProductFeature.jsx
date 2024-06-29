import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { BASE_URL } from "../../../utils/config";
// import "../../styles/product-feature.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";

const ProductFeature = () => {
    const [products, setProducts] = useState([]);

    const dispatch = useDispatch();
    const [setError] = useState("");

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/product/featured-products`);
                const fetchedProducts = response.data.products;

                const shuffledProducts = fetchedProducts.sort(() => 0.5 - Math.random());

                setProducts(shuffledProducts.slice(0, 4));
            } catch (error) {
                console.error("Error fetching featured products:", error);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const VND = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    const addToCart = async (product) => {
        const { _id, productName, price, imagePath } = product;
        const accessToken = Cookies.get('accessToken');

        if (!sessionStorage.getItem('savedAddresses')) {
            alert("Vui lòng cung cấp địa chỉ");
            return;
        }

        if (accessToken) {
            try {
                await axios.post(
                    `${BASE_URL}/cart/add-to-cart`,
                    {
                        productId: _id,
                        quantity: 1
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );
                window.location.reload();
            } catch (error) {
                setError(error.message);
            }
        } else {
            dispatch(
                cartActions.addItem({
                    _id,
                    productName,
                    imagePath,
                    price,
                })
            );
            window.location.reload();
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const isAddressSaved = !!sessionStorage.getItem('savedAddresses');
    const buttonClass = isAddressSaved ? "addTOCART__btn" : "addTOCART__btn disabled";
    const buttonStyle = isAddressSaved ? {} : { cursor: "not-allowed" };

    return (
        <Container className="product-feature">
            <Row className="product-feature__card">
                {products.map((product) => (
                    <Col className="mb-4 mt-4" key={product._id} lg="3" md="4" sm="6" xs="6">
                        <div>
                            <div className="product__item d-flex flex-column justify-content-between">
                                <div className="product__content">
                                    <Link to={`/pizzas/${product._id}`}>
                                        <img className="product__img w-50" src={product.imagePath} alt={product.productName} />
                                    </Link>
                                    <h5>
                                        <Link to={`/pizzas/${product._id}`}>{product.productName}</Link>
                                    </h5>
                                </div>
                                <div className="product__description">
                                    <span>{product.productSubtitles}</span>
                                </div>
                                <div className="d-flex flex-column align-items-center justify-content-between">
                                    <span className="product__price mb-2">{VND.format(product.price)}</span>
                                    <button
                                        className={buttonClass}
                                        style={buttonStyle}
                                        onClick={() => isAddressSaved ? addToCart(product) : alert("Vui lòng cung cấp địa chỉ giao hàng! Cảm ơn quý khách!")}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ProductFeature;
