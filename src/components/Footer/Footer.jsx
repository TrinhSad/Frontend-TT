import React from "react";
import { ListGroup } from "reactstrap";

import logo from "../../assets/images/res-logo.png";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <>
      <footer>
      {/* <div className="footer__logo">
          <img src={logo} alt="logo" />
          <h5>Tasty Treat</h5>
        </div> */}
      </footer>
      <footer className="footer">
        <div className="footer__logo">
          <img src={logo} alt="logo" />
          <h5>Tasty Treat</h5>
          <p>Địa chỉ: 17 Trần Thiện Chánh, quận 10, TP.HCM</p>
        </div>
        <div>
          <h5 className="footer__title mb-3">Delivery Time</h5>
          <ListGroup>
            <div className="delivery__time-item border-0 ps-0">
              <span>Friday - Tuesday</span>
              <p>10:00am - 11:00pm</p>
            </div>
            <div className="delivery__time-item border-0 ps-0">
              <span>Wednesday - Thursday</span>
              <p>Off day</p>
            </div>
          </ListGroup>
        </div>
      </footer>
    </>
  );
};

export default Footer;
