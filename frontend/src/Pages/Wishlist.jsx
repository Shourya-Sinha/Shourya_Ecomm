import React, { useEffect } from "react";
import BreadCrumb from "../Components/BreadCrumb";
import Meta from "../Components/Meta";
import { useDispatch, useSelector } from "react-redux";
import { addtocartProduct, deleteWishlistItem, getUserWishlistData } from "../Feature/Product/ProductSlice";
import NotificationComponent from "../Components/NotificationComponent";

const Wishlist = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserWishlistData());
  }, [dispatch]);
  const wishlist = useSelector((state) => state.product.wishListItem || []);
  //console.log("wishlist product in page", wishlist);
  const handleDeleteWishlistItem=(prodId,e)=>{
    e.preventDefault();
    //console.log('delete id wishlisht in page',prodId);
    dispatch(deleteWishlistItem(prodId));
  }

  const handleAddToCart=(id, quantity, color,e)=>{
    e.preventDefault();
    //console.log('add to cart wishlist in page',id, quantity, color);
    dispatch(addtocartProduct(id, quantity, color));
  }

  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <NotificationComponent />
      <div className="wishlist-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            {wishlist.length > 0 ? wishlist.map((product) => (
              <div className="col-3" key={product._id}>
                <div className="wishlist-card position-relative" >
                  <button className="border-0 " onClick={(e)=>handleDeleteWishlistItem(product._id,e)}>
                  <img
                  style={{top:'40px'}}
                    src="https://ik.imagekit.io/p66ljstle/images/cross.svg?updatedAt=1710580553527"
                    alt="cross"
                    className="position-absolute cross img-fluid"
                  />
                  </button>
                 
                  <div className="wishlist-card-image text-center bg-white p-5" >
                    <img
                    style={{height:'200px',width:'200px',objectFit:'contain'}}
                      src={product.images[0]?.url}
                      className="img-fluid"
                      alt="watch image"
                    />
                  </div>
                  <div className="py-3">
                    <h5 className="title">
                      {product.title}
                    </h5>
                    <h6 className="price">${product.price}</h6>
                  </div>
                  <div className="">
                    <button className="border-0 button" onClick={(e)=>handleAddToCart(product._id,1,product.color.title,e)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            )) : (
              <div>
                <p>No any Product in Wishlist Page </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
