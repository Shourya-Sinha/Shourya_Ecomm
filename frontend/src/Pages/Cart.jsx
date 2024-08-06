import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletecartsingleProduct, getUserCartData } from "../Feature/Product/ProductSlice";

const Cart = () => {
  const cartData = useSelector((state)=> state.product.cartData);
  const isLoading = useSelector((state) => state.product.isLoading);
  const error = useSelector((state) => state.product.error);
  const [itemDeleted, setItemDeleted] = useState(false);

  const handleDeleteProduct = (productId) => {
    //console.log('delete product id',productId );
    dispatch(deletecartsingleProduct(productId)).then(() => {
      setItemDeleted((prev) => !prev); // Toggle the state to trigger re-fetch
    })
    .catch((error) => {
      console.error('Error deleting product:', error);
    });;
  };

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getUserCartData())
  },[dispatch,itemDeleted]);

  if (isLoading) {
    return <div>No Items In Cart...</div>;
}

if (error) {
    return <div>Error: {error}</div>;
}
 

if (!cartData || !Array.isArray(cartData.products) || cartData.products.length === 0) {
  return <> 

<Meta title={"My Shopping Bag"} />
      <BreadCrumb title="My Shopping Bag" />

      <section className="cart-wrapper home-wrapper-2 py-">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="cart-header py-3 d-flex justify-content-between align-items-center">
                <h4 className="cart-col-1">Product</h4>
                <h4 className="cart-col-2">Price</h4>
                <h4 className="cart-col-3">Quantity</h4>
                <h4 className="cart-col-4">Total</h4>

              
              </div>
              <div className="d-flex p-5" style={{justifyContent:"center",alignItems:'center'}}>
    <p >

    No items available in the cart.
    <p style={{fontSize:'100px'}} className="px-5">😭 </p>
    </p>
    </div>
              </div>
              </div>
              </div>
              </section>


  
   </>
}

  return (
    <>
      <Meta title={"My Shopping Bag"} />
      <BreadCrumb title="My Shopping Bag" />

      <section className="cart-wrapper home-wrapper-2 py-">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="cart-header py-3 d-flex justify-content-between align-items-center">
                <h4 className="cart-col-1">Product</h4>
                <h4 className="cart-col-2">Price</h4>
                <h4 className="cart-col-3">Quantity</h4>
                <h4 className="cart-col-4">Total</h4>
              </div>

              {cartData.products.map((item) => (
              <div className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"  key={item._id}>
              <div className="cart-col-1 gap-15 d-flex align-items-center">
                <div className="w-25">
                  {item.product.images && item.product.images.length > 0 ? (
                        <img
                          className="img-fluid"
                          style={{ borderRadius: "15px" }}
                          src={item.product.images[0]?.url}
                          alt="Cart Product Image"
                        />
                      ) : (
                        <div className="no-image">No Image Available</div>
                      )}
                </div>
                <div className="w-75">
                <p>{item.product.title}</p>
                      <p>Size: {item.product.size || 'N/A'}</p>
                      <div className="d-flex gap-10"> <p className="display-inline">Color: </p>
                      {item.product.color.map((color) => (
              <p key={color._id}>{color.title}</p>
            ))}  </div>                    
                </div>
              </div>
              <div className="cart-col-2">
              <h5 className="price">${item.price}</h5>
              </div>
              <div className="cart-col-3 d-flex align-items-center gap-15">
                <div className="quantity-input">
                  <p className="mb-0">{item.count} </p>
                </div>
                <div>
                  <RiDeleteBin2Fill className="fs-5 text-danger"  onClick={() => handleDeleteProduct(item.product._id)} />
                </div>
              </div>
              <div className="cart-col-4">
              <h5 className="price">${(item.price * item.count).toFixed(2)}</h5>
              </div>
            </div>
              ))}

            </div>
            <div className="col-12 py-2 mt-4">
              <div className="d-flex justify-content-between align-items-baseline">
                {" "}
                <Link to={"/store"} className="button">
                  Continue to Shopping
                </Link>
                <div className="d-flex flex-column">
                <p> Taxes and shipping calculated at checkout</p>
                <h4>SubTotal: ${(cartData.cartTotal.toFixed(2))}</h4>
                {/* <h4>
                    SubTotal: ${cartData.products.reduce(
                      (total, item) => total + item.price * item.count,
                      0
                    ).toFixed(2)}
                  </h4> */}
                  <Link to="/checkout" className="button w-50">
                    {" "}
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
