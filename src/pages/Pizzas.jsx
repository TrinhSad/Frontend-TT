import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/config";
import "../styles/cart-page.css";
import "../styles/pagination.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";

const Pizzas = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const categoryRefs = useRef({});
  const dispatch = useDispatch();

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product`);
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category`);
        setCategories(response.data.categories);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    if (categoryRefs.current[category._id]) {
      const yOffset = -220; 
      const y = categoryRefs.current[category._id].getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

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

  const renderProductCard = (product) => {
    const isAddressSaved = !!sessionStorage.getItem('savedAddresses');
    const buttonClass = isAddressSaved ? "addTOCART__btn" : "addTOCART__btn disabled";
    const buttonStyle = isAddressSaved ? {} : { cursor: "not-allowed" };

    return (
      <div key={product._id} className="product__item d-flex flex-column justify-content-between">
        <div className="product__content">
          <Link to={`/pizzas/${product._id}`}><img className="product__img w-50" src={product.imagePath} alt={product.productName} /></Link>
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
    );
  };

  const renderCategoryWithProducts = () => {
    return categories.map((category) => {
      const filteredProducts = products.filter(product => product.categoryId === category._id);
      return (
        <div key={category._id} ref={el => (categoryRefs.current[category._id] = el)}>
          <h4 className="category-product__page">{category.categoryName}</h4>
          <Row>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Col lg="3" md="4" sm="6" xs="6" key={product._id} className="mb-4 mt-4">
                  {renderProductCard(product)}
                </Col>
              ))
            ) : (
              <div className="text-center w-100"><p>Không có sản phẩm phù hợp!</p></div>
            )}
          </Row>
        </div>
      );
    });
  };

  const renderCategories = () => {
    return categories.map((category) => (
      <span
        key={category._id}
        className= "category-item"
        onClick={() => handleCategoryClick(category)}
      >
        {category.categoryName}
      </span>
    ));
  };

  return (
    <>
      <Helmet title="All Product">
        <Container>
          <div className="header-categories">Danh mục: {renderCategories()}</div>
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
            <>
              {renderCategoryWithProducts()}
            </>
          )}
        </Container>
      </Helmet>
    </>
  );
};

export default Pizzas;
