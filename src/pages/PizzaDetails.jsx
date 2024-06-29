import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import axios from "axios";
import "../styles/product-details.css";
import "../styles/product-card.css";
// import ProductCard from "../components/UI/product-card/ProductCard";
import { BASE_URL } from "../utils/config";
import Cookies from "js-cookie";

const PizzaDetails = () => {
  const currentPath = window.location.pathname;
  const paths = currentPath.split("/");
  const _id = paths[paths.length - 1];

  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [isUpdateNotificationDisplayed, setIsUpdateNotificationDisplayed] = useState(false);
  // const cartProducts = useSelector((state) => state.cart.cartItems);
  // const [products ] = useState([]);

  // useEffect(() => {
  //   const fetchFeaturedProducts = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/product/featured-products`);
  //       setProducts(response.data.products);
  //     } catch (error) {
  //       console.error("Error fetching featured products:", error);
  //     }
  //   };

  //   fetchFeaturedProducts();
  // }, []);

  useEffect(() => {
    if (!_id) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product/get-product/${_id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error loading product details:", error);
      }
    };

    fetchData();
  }, [_id]);

  if (!product) return <p>Loading...</p>;

  const addItem = () => {
    if (!sessionStorage.getItem('savedAddresses')) {
      alert("Vui lòng cung cấp địa chỉ giao hàng! Cảm ơn quý khách!");
      return;
    }

    setIsUpdateNotificationDisplayed(true);
    setTimeout(function () {
      setIsUpdateNotificationDisplayed(false);
    }, 1500);

    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
      try {
        axios.post(
          `${BASE_URL}/cart/add-to-cart`,
          {
            productId: product._id,
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
        console.error("Error adding item to cart:", error);
      }
    } else {
      dispatch(
        cartActions.addItem({
          _id: product._id,
          productName: product.productName,
          price: product.price,
          imagePath: product.imagePath,
        })
      );
      window.location.reload();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // const getRandomProduct = (AllProduct) => {
  //   if (!AllProduct || AllProduct.length === 0) {
  //     return [];
  //   }

  //   const getRandomIndex = () => Math.floor(Math.random() * AllProduct.length);

  //   const selectedProducts = [];
  //   const selectedIndexes = new Set();

  //   while (selectedProducts.length < 4) {
  //     const randomIndex = getRandomIndex();
  //     if (!selectedIndexes.has(randomIndex)) {
  //       selectedProducts.push(AllProduct[randomIndex]);
  //       selectedIndexes.add(randomIndex);
  //     }
  //   }

  //   return selectedProducts;
  // };

  const { productName, price, productSubtitles } = product;
  // const randomProduct = getRandomProduct(products);

  const isAddressSaved = !!sessionStorage.getItem('savedAddresses');
  const buttonClass = isAddressSaved ? "addTOCART__btn" : "addTOCART__btn disabled";
  const buttonStyle = isAddressSaved ? {} : { backgroundColor: "", cursor: "not-allowed" };

  return (
    <Helmet title="Product-details">
      {isUpdateNotificationDisplayed && (
        <div className="updateCartNotifiation">
          <span>Đã thêm món vào giỏ hàng!</span>
        </div>
      )}

      <section>
        <Container>
          <Row>
            <Col lg="4" className="d-flex mx-auto">
              <div className="product__images">
                <img src={product.imagePath} alt="" className="w-75" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__name mb-3">{productName}</h2>
                <h6 className="description">Combo món của bạn: </h6>
                <div className="description__content">
                  <p>{productSubtitles}</p>
                </div>
                <p className="product__price">
                  Giá tiền: <span>{VND.format(price)}</span>
                </p>
                <br />

                <button
                  onClick={addItem}
                  className={buttonClass}
                  style={buttonStyle}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default PizzaDetails;
