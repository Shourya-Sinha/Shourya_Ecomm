import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";  
import { Link, useLocation } from "react-router-dom";
import { addtocartProduct, addToWishlist, compareProduct } from "../Feature/Product/ProductSlice";
import { ToastContainer, toast } from 'react-toastify';

const ProductCard = ({grid,products}) => {
  let location = useLocation();
  const dispatch = useDispatch();
  

  const handletoAddToCart=(id,quantity,color,e)=>{
    e.preventDefault();
    try{
      dispatch(addtocartProduct(id, quantity, color))
   }catch{
     //console.log('erorr in page adfd to cart button');
   }
  }

  const handleAddToWishlist=(prodId,e)=>{
    e.preventDefault();
    //console.log('prodId in page ',prodId)
    dispatch(addToWishlist(prodId));
  }

  const handleCompareProduct = (product,e) => {
    try {
      e.preventDefault();
    dispatch(compareProduct(product));
    toast.success('Product Successfully Added for Comparision')
    } catch (error) {
      toast.error('Something Error for Comparision');
    }
    
  };

  return (
    <>
    <ToastContainer />
    {Array.isArray(products) && products.map((product) => (
      <div key={product._id}
      className={`${location.pathname == "/store" ? `gr-${grid} ` : "col-3"}`}
    >
      <Link to={`/product/${product._id}`} className="product-card position-relative">
        <div className="wishlist-icon position-absolute">
          <button className="border-0 bg-none" style={{background:'content-box'}} onClick={(e)=>handleAddToWishlist(product._id,e)}>
            <img
              src="https://ik.imagekit.io/p66ljstle/images/wish.svg?updatedAt=1710580567227"
              alt="wishlist-icon"
            />
          </button>
        </div>
        <div className="produc-image text-center" style={{height:'220px'}}>
        {product.images && product.images.length > 0 ? (
                        <img
                          className=" text-center"
                          style={{ borderRadius: "15px",height:'200px',width:'200px',objectFit:'contain', }}
                          src={product.images[0]?.url}
                          alt="Cart Product Image"
                        />
                      ) : (
                        <div className="no-image">No Image Available</div>
                      )}
          <img
            className="img-fluid"
            src="https://ik.imagekit.io/p66ljstle/images/laptop.jpg?updatedAt=1710580560123"
            alt="watch"
          />
        </div>
        <div className="product-deails px-2">
          <h6 className="brand">{product.brand.title}</h6>
          <h5 className="product-title">
            {product.title}
          </h5>
          <ReactStars
            count={5}
            size={25}
            value={product.ratings.length ? (product.ratings.reduce((acc, rating) => acc + rating, 0) / product.ratings.length) : 0}
            edit={false}
            activeColor={"#ffd700"}
          />
           <p className={`description ${grid ===12 ? 'd-block': 'd-none'}`}>
            {product.description}
          </p>
          <p className="price">${product.price}</p>
        </div>
        <div className="action-bar position-absolute">
          <div className="d-flex flex-column gap-15">
            <button className="border-0 bg-transparent " onClick={(e) => handleCompareProduct(product,e)}>
              <img
                src="https://ik.imagekit.io/p66ljstle/images/prodcompare.svg?updatedAt=1710580561519"
                alt="compare"
              />
            </button>
            <button className="border-0 bg-transparent " onClick={(e)=>handletoAddToCart(product._id,1,product.color.title,e)}>
              <img
                src="https://ik.imagekit.io/p66ljstle/images/add-cart.svg?updatedAt=1710580551489"
                alt="addcart"
              />
            </button>
            <Link to={`/product/${product._id}`} className="border-0 bg-transparent ">
              <img
                src="https://ik.imagekit.io/p66ljstle/images/view.svg?updatedAt=1710580567073"
                alt="view"
              />
            </Link>
          </div>
        </div>
      </Link>
    </div>
    ))}
    </>
  );
};

export default ProductCard;
