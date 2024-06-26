import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/shop.css";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import carrousel from "../../assets/images/0.jpg";
import { Products } from "../../products";
import { useLocation } from "react-router-dom";

export const Shop = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");

  let shopType = "";
  if (user?.userRole === "customer" || user?.userRole === "") {
    shopType = "retailer";
  } else if (user?.userRole === "retailer") {
    shopType = "distributor";
  } else if (user?.userRole === "distributor") {
    shopType = "manufacturer";
  } else {
    shopType = "retailer";
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/prosen_bentures/api/getProductsByRole.php?shopType=${shopType}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [shopType]);

  const filterProductsNoNuts = () => {
    const filtered = products.filter(
      (product) => !product.productAllergen.toLowerCase().includes("nuts")
    );
    setFilteredProducts(filtered);
    setActiveFilter("No Nuts");
  };

  console.log(products)
  const filterProductsNoMilk = () => {
    const filtered = products.filter(
      (product) =>
        !product.productAllergen
          .toLowerCase()
          .split(",")
          .map((allergen) => allergen.trim())
          .includes("milk")
    );
    setFilteredProducts(filtered);
    setActiveFilter("No Milk");
  };

  const filterProductsNoEggs = () => {
    const filtered = products.filter(
      (product) => !product.productAllergen.toLowerCase().includes("eggs")
    );
    setFilteredProducts(filtered);
    setActiveFilter("No Eggs");
  };

  const filterProductsNoWheat = () => {
    const filtered = products.filter(
      (product) => !product.productAllergen.toLowerCase().includes("wheat")
    );
    setFilteredProducts(filtered);
    setActiveFilter("No Wheat");
  };

  return (
    <div
      className={`container shop${
        location.pathname === "/home-seller" ? " no-padding" : ""
      }`}
    >
      {location.pathname !== "/home-seller" && (
        <div className="carrousel">
          <img src={carrousel} alt="" />
        </div>
      )}

      <div className="text-container">
        <h2>Check out the shop</h2>
        <p>Find the flavor that suits you</p>
      </div>

      <div className="button-container">
        <button
          className={activeFilter === "" ? "active" : ""}
          onClick={() => {
            setFilteredProducts([]);
            setActiveFilter("");
          }}
        >
          All
        </button>
        <button
          className={activeFilter === "No Nuts" ? "active" : ""}
          onClick={filterProductsNoNuts}
        >
          No Nuts
        </button>
        <button
          className={activeFilter === "No Milk" ? "active" : ""}
          onClick={filterProductsNoMilk}
        >
          Non Dairy
        </button>
        <button
          className={activeFilter === "No Eggs" ? "active" : ""}
          onClick={filterProductsNoEggs}
        >
          No Eggs
        </button>
        <button
          className={activeFilter === "No Wheat" ? "active" : ""}
          onClick={filterProductsNoWheat}
        >
          No Wheat
        </button>
      </div>

      <div className="products-container">
        <Products
          products={filteredProducts.length > 0 ? filteredProducts : products}
        />
      </div>
    </div>
  );
};
