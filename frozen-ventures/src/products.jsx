import React, { useState, useEffect } from "react";
import "./assets/styles/products.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost/api/getProductsForCustomer.php"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const intervalId = setInterval(fetchProducts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleProductClick = (productID) => {
    navigate(`/individual-product/${productID}`);
  };

  return (
    <>
      {products.map((product) => (
        <div
          className="product-item"
          key={product.productID}
          onClick={() => handleProductClick(product.productID)}
        >
          <img
            src={`http://localhost/api/productImages/${product.productImage}`}
            alt={product.productName}
          />
          <div className="product-details">
            <p className="product-name">{product.productName}</p>
            <p>
              <span>Available: </span>
              {product.totalStock}
            </p>
            <p>
              <span>Shop: </span>
              {product.shopName}
            </p>
            <div className="details">
              <p>{product.productSize}</p>
              <p>Php {product.productPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};