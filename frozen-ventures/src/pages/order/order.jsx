import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/order.css";
import { OrderContext } from "../../context/order-context";
import { UserContext } from "../../context/user-context";
import { useNavigate } from "react-router-dom";

export const Order = () => {
  const { user } = useContext(UserContext);
  const { orderProducts, clearOrder } = useContext(OrderContext);
  const { products } = orderProducts || {};
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    barangay: "",
    municipality: "",
    province: "",
    zip: "",
  });
  const [isEditingShippingMode, setIsEditingShippingMode] = useState(false);
  const [isEditingShippingDate, setIsEditingShippingDate] = useState(false);
  const [shippingAddressError, setShippingAddressError] = useState(false);
  const [shippingMode, setShippingMode] = useState("pickup");

  let totalProductAmount = 0;

  if (products) {
    for (const productId in products) {
      const product = products[productId];
      totalProductAmount += product.productPrice * product.quantity;
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost/api/getPersonalAccountInfo.php?accountId=${user.accountId}`
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.accountId]);
  
  const shippingCost = shippingMode === "pickup" ? 0 : 10;
  const totalOrderCost =
    parseFloat(totalProductAmount) + parseFloat(shippingCost);

  const handleEditUserInfo = () => {
    navigate("/user-menu");
  };

  const handleEditShippingAddress = () => {
    navigate("/user-menu");
  };

  const handleConfirmOrderShow = () => {
    if (isShippingAddressEmpty()) {
      setShippingAddressError(true);

      setTimeout(() => {
        setShippingAddressError(false);
      }, 2000);
    } else {
      setShowConfirmOrder(true);
    }
  };

  const handleConfirmOrderClose = () => {
    setShowConfirmOrder(false);
  };

  const handleEditShippingMode = () => {
    setIsEditingShippingMode(!isEditingShippingMode);
  };

  const handleShippingModeChange = (mode) => {
    setShippingMode(mode);
    setIsEditingShippingMode(false);
  };

  const handleEditShippingDate = () => {
    setIsEditingShippingDate(!isEditingShippingDate);
  };

  const isShippingAddressEmpty = () => {
    const { street, barangay, municipality, province, zip } = formUserPersonal;
    return !street || !barangay || !municipality || !province || !zip;
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate;
  };

  const [shippingDate, setShippingDate] = useState(getCurrentDate());

  useEffect(() => {
    setShippingDate(getCurrentDate());
  }, []);

  const handleShippingDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setShippingDate(selectedDate);
    setIsEditingShippingDate(false);
  };

  console.log(shippingDate);
  return (
    <div className="container order">
      <header>
        <h2>Order Confirmation</h2>

        <div className="tb-container">
          {totalProductAmount > 0 ? (
            <>
              <p>
                Order Total: <span>Php {totalOrderCost.toFixed(2)}</span>
              </p>
              <button onClick={handleConfirmOrderShow}>Place Order</button>
            </>
          ) : null}
        </div>
      </header>

      <div className="informations">
        <div className="info">
          <div className="title-info">
            <h3>Your Information</h3>
            <button onClick={handleEditUserInfo}>Edit</button>
          </div>

          <h4>
            {userData.firstName} {userData.lastName}
          </h4>
          <p>{userData.email}</p>
        </div>

        <div className="info">
          <div className="title-info">
            <h3>Shipping Address</h3>
            <button onClick={handleEditShippingAddress}>Edit</button>
          </div>

          <p>{userData.street}</p>
          <p>{userData.barangay}</p>
          <p>{userData.municipality}</p>
          <p>{userData.province}</p>
          <p>{userData.zip}</p>
        </div>

        <div className="info">
          <div className="title-info">
            <h3>Shipping Mode</h3>
            <button onClick={handleEditShippingMode}>Edit</button>
          </div>
          {isEditingShippingMode ? (
            <div className="ship-group">
              <button
                className="ship-btn"
                onClick={() => handleShippingModeChange("pickup")}
              >
                Pickup
              </button>
              <button
                className="ship-btn"
                onClick={() => handleShippingModeChange("delivery")}
              >
                Delivery
              </button>
            </div>
          ) : (
            <p>
              {shippingMode.charAt(0).toUpperCase() + shippingMode.slice(1)}
            </p>
          )}
        </div>

        <div className="info">
          <div className="title-info">
            <h3>
              {shippingMode.charAt(0).toUpperCase() + shippingMode.slice(1)}{" "}
              Date
            </h3>
            <button onClick={handleEditShippingDate}>Edit</button>
          </div>
          {isEditingShippingDate ? (
            <input
              className="ship-date"
              type="date"
              min={getCurrentDate().toISOString().split("T")[0]}
              max={getMaxDate().toISOString().split("T")[0]}
              value={shippingDate.toISOString().split("T")[0]}
              onChange={handleShippingDateChange}
            />
          ) : (
            <p>{shippingDate.toISOString().split("T")[0]}</p>
          )}
        </div>
      </div>

      <div className="item-container">
        <h2>Order Items</h2>

        <div className="order-item">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Retailer</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                Object.entries(products).map(([productId, product]) => (
                  <tr key={productId}>
                    <td>
                      <img
                        src={`http://localhost/api/productImages/${product.productImage}`}
                        alt={product.productName}
                      />
                      <div className="description">
                        <p>{product.productName}</p>
                        <p>{product.productFlavor}</p>
                        <p>{product.productSize}</p>
                        <p>Php {product.productPrice}</p>
                      </div>
                    </td>
                    <td>
                      <p>{product.shopName}</p>
                    </td>
                    <td>
                      <p>{product.quantity}</p>
                    </td>
                    <td>
                      <p>
                        Php{" "}
                        {(product.productPrice * product.quantity).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="t-container">
        <div className="total-container">
          <h2>Total Cost</h2>
          <div className="sub-total">
            <p className="label">Sub Total</p>
            <p className="price">Php {totalProductAmount.toFixed(2)}</p>
          </div>
          <div className="shipping">
            <p className="label">Shipping</p>
            <p className="price">Php {shippingCost.toFixed(2)}</p>
          </div>
          <div className="line"></div>
          <div className="total">
            <p className="label">Total</p>
            <p className="price">Php {totalOrderCost.toFixed(2)}</p>
          </div>
          <button onClick={handleConfirmOrderShow}>Place Order</button>{" "}
        </div>
      </div>
    </div>
  );
};
