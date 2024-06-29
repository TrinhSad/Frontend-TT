import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "reactstrap";
import logo from "../../assets/images/res-logo.png";
import { NavLink } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../utils/config";
import "../../styles/header.css";

const nav__links = [
  {
    display: "TRANG CHỦ",
    path: "/home",
  },
  {
    display: "THỰC ĐƠN",
    path: "/pizzas",
  },
  {
    display: "GIỎ HÀNG",
    path: "/cart",
  },
  {
    display: "LIÊN HỆ",
    path: "/contact",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  // const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const [totalQuantity, setTotalQuantity] = useState(0);
  // const dispatch = useDispatch();
  let navigate = useNavigate();
  const Token = Cookies.get('accessToken');

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const toggleCart = () => {
    // dispatch(cartUiActions.toggle());
  navigate("/cart");
  };

  const getQuantity = async () => {
    try {
      if (Token) {
        const response = await axios.get(`${BASE_URL}/cart/get-cart`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const data = response.data.cart.products;
        const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setTotalQuantity(totalQuantity);
      } else {
        const storedTotalQuantity = sessionStorage.getItem("totalQuantity") || 0;
        setTotalQuantity(Number(storedTotalQuantity));
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    const getQuantityAndUpdate = async () => {
      try {
        await getQuantity();
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    getQuantityAndUpdate(); // Immediately invoke to fetch initial data

    const handleScroll = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
     // eslint-disable-next-line
  }, [Token, navigate]); 

  const handleUserClick = () => {
    if (Token) {
      navigate("/edit-profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo" onClick={() => navigate("/home")}>
            <img src={logo} alt="logo" />
            <h5>Tasty Treat</h5>
          </div>
          {/* ======= menu ======= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <div
              className="menu d-flex align-items-center gap-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="header__closeButton">
                <span onClick={toggleMenu}>
                  <i className="ri-close-fill"></i>
                </span>
              </div>
              {nav__links.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={(navClass) =>
                    navClass.isActive ? "active__menu" : ""
                  }
                  onClick={toggleMenu}
                >
                  {item.display}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ======== nav right icons ========= */}
          <div className="nav__right d-flex align-items-center gap-4">
            <span className="search__icon">
              Tiếng Việt
            </span>
            <span className="user__icon" onClick={handleUserClick}>
              <i className="ri-account-circle-line"></i>
            </span>
            <span className="cart__icon" onClick={toggleCart}>
              <i className="ri-shopping-basket-line"></i>
              <span className="cart__badge">{totalQuantity}</span>
            </span>
            <span className="mobile__menu" onClick={toggleMenu}>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
