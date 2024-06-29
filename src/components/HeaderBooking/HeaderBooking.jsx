import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label } from "reactstrap";
import axios from "axios";
import { RiTakeawayFill } from "react-icons/ri";
import { BASE_URL } from "../../utils/config"; 
import "./header-booking.css";

const HeaderBooking = () => {
    const [credentials, setCredentials] = useState({
        address: "",
    });

    const [showSelection, setShowSelection] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isAddressSaved, setIsAddressSaved] = useState(false);

    useEffect(() => {
        const savedAddressesFromSessionStorage = sessionStorage.getItem("savedAddresses");
        if (savedAddressesFromSessionStorage) {
            const parsedAddresses = JSON.parse(savedAddressesFromSessionStorage);
            setSavedAddresses(parsedAddresses);
            if (parsedAddresses.length > 0) {
                setIsAddressSaved(true);
            }
        }
    }, []);

    const handleShowSelection = () => {
        setShowSelection(!showSelection);
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value,
        });
    };

    const handleEditAddress = () => {
        setShowSelection(true);
    };

    const handleConfirmAddress = async () => {
        const query = credentials.address;
        if (!query) {
            alert("Please enter an address.");
            return;
        }

        try {
            const encodedQuery = encodeURIComponent(query).trim();
            const url = `${BASE_URL}/address/get-coordinates?q=${encodedQuery}`;

            const response = await axios.get(url);
            const data = response.data;
            
            if (!data.coordinates) {
                alert('No coordinates found for the given address');
                return;
            }

            const currentAddress = `${data.address}`;
            setCredentials({ address: currentAddress });

            sessionStorage.setItem("shippingFee", data.shippingFee || 0);
            sessionStorage.setItem("nearestShopId", data.nearestShopId || 0);

            sessionStorage.removeItem("savedAddresses");
            const updatedAddresses = [currentAddress];
            setSavedAddresses(updatedAddresses);
            sessionStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
            setIsAddressSaved(true);

            setShowSelection(false);
            window.location.reload();
        } catch (error) {
            console.error('Error fetching coordinates:', error.message);
            alert('Failed to fetch coordinates');
        }
    };

    return (
        <>
            <div className="align-items-center booking-header">
                {isAddressSaved ? (
                    <>
                        <i className="ri-map-pin-2-fill"></i>
                        <h4>Được giao từ: Tasty Treat Trần Thiện Chánh</h4>
                        <i className="ri-time-fill"></i>
                        <h5>Giao Ngay</h5>
                        <Button className="button-booking__change" onClick={handleEditAddress}>Thay đổi</Button>
                    </>
                ) : (
                    <>
                        <h4>Đặt Ngay</h4>
                        <span><RiTakeawayFill /></span>
                        <h4>Giao Hàng</h4>
                        <i className="ri-gift-line"></i>
                        <h4>Hoặc mang đi</h4>
                        <Button className="button-booking__header" onClick={handleShowSelection}>Bắt đầu đặt hàng</Button>
                    </>
                )}
            </div>
            {showSelection && (
                <div className="overlay" style={{ bottom: showSelection ? 0 : "-100%" }}>
                    <div className="forgot-password__form">
                        <div className="close-btn" onClick={handleShowSelection}>
                            <span aria-hidden="true">&times;</span>
                        </div>
                        <h4>CHỌN ĐỊA CHỈ ĐÃ LƯU</h4>
                        <p>Cho chúng tôi biết vị trí hiện tại của bạn.</p>
                        <div className="address-selection">
                            {savedAddresses.map((savedAddress, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-center address__item">
                                    <p className="address-session"><i className="ri-map-pin-line"></i> {savedAddress}</p>
                                </div>
                            ))}
                        </div>
                        <Form>
                            <FormGroup className="login__input">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={credentials.address}
                                    onChange={handleChange}
                                    required
                                />
                                <Label className="input__place" htmlFor="address">Nhập địa chỉ của bạn hoặc nơi gần bạn *</Label>
                            </FormGroup>
                        </Form>
                        <Button className="button__forgot" onClick={handleConfirmAddress}>
                            Xác nhận địa chỉ của tôi <i className="ri-arrow-right-s-line"></i>
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeaderBooking;
