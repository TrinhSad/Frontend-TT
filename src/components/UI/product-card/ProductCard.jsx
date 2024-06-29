import React, { useEffect, useState } from "react";
import "../../../styles/product-card.css";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { Row, Col } from "reactstrap";
import "../../../styles/pagination.css";

const ProductCard = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <span
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "pagination__item active__page" : "pagination__item"}
        >
          {i}
        </span>
      );
    }
    return pages;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `${BASE_URL}/product/get-product-by-category/${category}`
          : `${BASE_URL}/product`;
        const response = await axios.get(url);
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const addToCart = (product) => {
    const { _id, productName, price, imagePath } = product;
    dispatch(
      cartActions.addItem({
        _id,
        productName,
        imagePath,
        price,
      })
    );
  };

  const renderProductCard = (product) => {
    return (
      <div key={product._id} className="product__item d-flex flex-column justify-content-between">
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
          <button className="addTOCART__btn" onClick={() => addToCart(product)}>
            Thêm
          </button>
        </div>
      </div>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Row className="product-card-page">
        <Col>
        {loading && (
        <div className="text-center pt-5">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}
      {error && <h4 className="text-center pt-5">{error}</h4>}

      {!loading && !error && (
        <Row >
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <Col lg="3" md="4" sm="6" xs="6" key={product._id} className="mb-4 mt-4">
                {renderProductCard(product)}
              </Col>
            ))
          ) : (
            <div className="text-center w-100">No products found</div>
          )}
        </Row>
      )}

      {!loading && !error && (
        <div className="pagination d-flex justify-content-center mt-4 mb-4" onClick={scrollToTop}>
          {renderPagination()}
        </div>
      )}
        </Col>
      </Row>
    </>
  );
};

export default ProductCard;
