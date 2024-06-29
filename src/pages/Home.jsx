import React from "react";
import Helmet from "../components/Helmet/Helmet.js";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import guyImg from "../assets/images/delivery-guy.png";
import pizzaImg from "../assets/images/poster2.jpg";
import "../styles/hero-section.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryCard from "../components/Category/CategoriesCard.jsx";
import ProductFeature from "../components/UI/product-card/ProductFeature.jsx";

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <>
      <Helmet title="Home">
        <section>
          <Container>
            <Slider {...settings}>
              <div>
                <Row>
                  <Col lg="6" md="6">
                    <div className="hero__content">
                      <h5 className="mb-3">ĐẶT HÀNG VÀ GIAO HÀNG NHANH CHÓNG</h5>
                      <h1 className="mb-4 hero__title">
                        <span>THƯỞNG THỨC</span> CÁC MÓN ĂN YÊU THÍCH
                      </h1>
                      <button className="order__btn d-flex align-items-center justify-content-between">
                        <Link to="/pizzas">
                          Thực Đơn <i className="ri-arrow-right-s-line"></i>
                        </Link>
                      </button>
                    </div>
                  </Col>
                  <Col lg="6" md="6">
                    <div className="hero__img">
                      <img src={guyImg} alt="delivery-guy" className="w-75" />
                    </div>
                  </Col>
                </Row>
              </div>

              <div>
                <Row>
                  <Col lg="6" md="6">
                    <div className="hero__content">
                      <h5 className="mb-3">Another Slide Title</h5>
                      <h1 className="mb-4 hero__title">
                        <span>Delicious</span> Fast Food Options
                      </h1>
                      <button className="order__btn d-flex align-items-center justify-content-between">
                        <Link to="/pizzas">
                          Check Our Menu <i className="ri-arrow-right-s-line"></i>
                        </Link>
                      </button>
                    </div>
                  </Col>
                  <Col lg="6" md="6">
                    <div className="fast-food__img">
                      <img src={pizzaImg} alt="pizza" className="w-75" />
                    </div>
                  </Col>
                </Row>
              </div>

            </Slider>
          </Container>
          <br />
          <Container>
            <Row>
              <Col className="categories-home">
                <h4>DANH MỤC MÓN ĂN</h4>
                < CategoryCard />
              </Col>
            </Row>
            <br /><br />
            <Row>
              <Col className="categories-home">
                <h4>SẢN PHẨM NỔI BẬT</h4>
                < ProductFeature />
              </Col>
            </Row>
          </Container>
        </section>
      </Helmet>
    </>

  );
};

export default Home;
