import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/config";
import axios from "axios";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/product-card.css";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import Cookies from "js-cookie";

const CategoryPage = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentPath = window.location.pathname;
    const paths = currentPath.split("/");
    const categoryId = paths[paths.length - 1];

    useEffect(() => {
        const fetchCategoryById = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/product/get-product-by-category/${categoryId}`);
                console.log(response.data.products);
                setProducts(response.data.products);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching category:", error);
            }
        };

        fetchCategoryById();
    }, [categoryId]);

    const addToCart = async (product) => {
        const { _id, productName, price, imagePath } = product;
        const accessToken = Cookies.get('accessToken');

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

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const isAddressSaved = !!sessionStorage.getItem('savedAddresses');
    const buttonClass = isAddressSaved ? "addTOCART__btn" : "addTOCART__btn disabled";
    const buttonStyle = isAddressSaved ? {} : { cursor: "not-allowed" };

    return (
        <div className="category-page">
            <h4>Món ăn bạn đang tìm kiếm:</h4>
            <br />
            {loading && (
                <div className="text-center pt-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            )}
            {error && <h4 className="text-center pt-5">{error}</h4>}

            {!loading && !error && (
                <Row>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Col key={product._id} sm="12" md="6" lg="3">
                                <div className="product-card__page">
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
                                                onClick={() => isAddressSaved ? addToCart(product) : alert("Vui lòng cung cấp địa chỉ giao hàng! Cảm ơn quý khách!")}>
                                                Thêm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <div className="text-center w-100">Không có sản phẩm nào</div>
                    )}
                </Row>
            )}
        </div>
    );
};

export default CategoryPage;
