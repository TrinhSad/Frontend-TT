import React from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import "./menu.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/res-logo.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Menu = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.reload(navigate("/home"));
    };

    return (
        <>
            <div className="menu-edit">
                <div className="align-items-center menu-left">
                    <span className="menu-item logo-container">
                        <img className="logo" src={logo} alt="logo" />
                    </span>
                    <span className="menu-item" onClick={handleLogout}>
                        <RiLogoutBoxLine />
                        <p>Đăng Xuất</p>
                    </span>
                    <span className="menu-item">
                        <Link to="/history"><h4>Đơn Hàng Đã Đặt</h4></Link>
                    </span>
                    <span className="menu-item">
                        <Link to="/edit-profile"><h4>Chi Tiết Tài Khoản</h4></Link>
                    </span>
                    <span className="menu-item">
                        <Link to="/change-password"><h4>Đặt Lại Mật Khẩu</h4></Link>
                    </span>
                </div>
            </div>
        </>
    );
};

export default Menu;
