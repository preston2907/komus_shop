import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import officeIcon from "../../assets/office.svg";
import homeIcon from "../../assets/home.svg";
import selectedHomeIcon from "../../assets/homeSelected.svg";
import selectedOfficeIcon from "../../assets/officeSelected.svg";
import "./style.css";
import { Input, Textarea } from "@komus/design";
import { Layout } from "../../shared/layout";
import { CartContext } from "../../store/CartContext";

const DeliveryPage = () => {
  const [deliveryOption, setDeliveryOption] = useState("");
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    address: "",
    message: "",
  });
  const navigate = useNavigate();
  const { clearCart, sendDeliveryDetails, deliveryInfo } = useContext(CartContext);

  const handleOptionChange = e => {
    setDeliveryOption(e.target.value);
  };

  const handleInputChange = e => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const deliveryDetails = { deliveryOption, contactInfo };
    sendDeliveryDetails(deliveryDetails);
  };

  useEffect(() => {
    if (deliveryInfo) {
      clearCart();
      navigate("/komus-merch-shop/main");
    }
  }, [deliveryInfo]);

  return (
    <Layout>
      <form className="delivery-form" onSubmit={handleSubmit}>
        <h2>Доставка</h2>
        <div className="delivery-options">
          <label
            className={`option-card ${
              deliveryOption === "pickup" ? "selected" : ""
            }`}
          >
            <div style={{ position: "relative" }}>
              <input
                type="radio"
                name="delivery"
                value="pickup"
                onChange={handleOptionChange}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                }}
              />
              <img
                src={
                  deliveryOption === "pickup" ? selectedOfficeIcon : officeIcon
                }
                alt="officeIcon"
              />
            </div>
            <div className="delivery-text">
              <p>Заберу из офиса</p>
              <span></span>
            </div>
          </label>
          <label
            className={`option-card ${
              deliveryOption === "delivery" ? "selected" : ""
            }`}
          >
            <div style={{ position: "relative" }}>
              <input
                type="radio"
                name="delivery"
                value="delivery"
                onChange={handleOptionChange}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                }}
              />
              <img
                src={
                  deliveryOption === "delivery" ? selectedHomeIcon : homeIcon
                }
                alt="homeIcon"
              />
            </div>
            <div className="delivery-text">
              <p>Доставка курьером</p>
              <span>это бесплатно</span>
            </div>
          </label>
        </div>
        <p>
          Пожалуйста, оставьте свой мобильный телефон. Наш сотрудник свяжется с
          вами, чтобы уточнить детали.
        </p>
        <label htmlFor="phone">Телефон для связи *</label>
        <Input
          type="tel"
          name="phone"
          placeholder="Телефон для связи *"
          onChange={handleInputChange}
          required
        />
        <label htmlFor="address">Адрес доставки *</label>
        <Input
          type="text"
          name="address"
          placeholder="Адрес доставки *"
          onChange={handleInputChange}
          required
        />
        <label htmlFor="message">Сообщение</label>
        <Textarea
          type="text"
          name="message"
          placeholder="Сообщение"
          onChange={val =>
            handleInputChange({ target: { value: val, name: "message" } })
          }
        />
        <Button
          type="submit"
          mode="purple"
          disabled={
            !contactInfo.phone || !contactInfo.address || !deliveryOption
          }
        >
          Забрать
        </Button>
      </form>
    </Layout>
  );
};

export default DeliveryPage;
