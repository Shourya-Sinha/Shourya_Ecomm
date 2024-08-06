import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import RightSideCheckout from "../Components/RightSideCheckout";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress } from "../Feature/UserInfo/UserInfoSlice";
import { applyCoupononCart, applyShippingFee, getUserCartData } from "../Feature/Product/ProductSlice";

const Shipping = () => {
  const [shippingCost, setShippingCost] = useState(0); // default to Fast Delivery
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState(null);

  const cartData = useSelector((state) => state.product.cartData) || { products: [] };
  const totalAfterDiscount = useSelector((state) => state.product.coupon.totalAfterDiscount || 0);
  const discountAmount = useSelector((state) => state.product.coupon.discountAmount || 0);
  const address = useSelector((state)=> state.userInfo.allAddress);
  const defaultAddress = address.find((address) => address.isDefault);

  //const [shippingCost, setShippingCost] = useSelector((state)=>state.product.shippingCost);

  const { products } = cartData;
  const dispatch = useDispatch();

  // const handleShippingChange = (event) => {
  //   setShippingCost(parseFloat(event.target.value));
  //   dispatch(applyShippingFee(event.target.value));
  // }
  const handleShippingChange = (event) => {
    const cost = parseFloat(event.target.value);
    setShippingCost(cost);
    dispatch(applyShippingFee(cost));
  };

  const handleCouponChange = (event) => {
    setCoupon(event.target.value);
  };

  const handleApplyCoupon = async (event) => {
    event.preventDefault();
    try {
      await dispatch(applyCoupononCart(coupon));
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError("An error occurred while applying the coupon");
    }finally{
      dispatch(getUserCartData());
    }
  };
  
    useEffect(()=>{
      dispatch(getUserAddress());
    },[])
  
  return (
    <>
      <Meta title={"Shipping Method"} />
      <BreadCrumb title="Shipping Method" />

      <div className="checkout-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-7">
              <div
                className="checkout-left-data bg-white p-5"
                style={{ borderRadius: "10px" }}
              >
                <h3 className="website-name">Shourya Ecomm</h3>
                <nav
                  style={{
                    "--bs-breadcrumb-divider":
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E\")",
                  }}
                  aria-label="breadcrumb"
                >
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item ">
                      <Link to={"/cart"} className="text-dark">
                        {" "}
                        Cart
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {" "}
                      Information
                    </li>
                    <li className="breadcrumb-item " aria-current="page">
                      {" "}
                      Shipping
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {" "}
                      Payment
                    </li>
                  </ol>
                </nav>

                <div
                  className="d-flex flex-wrap gap-15 justify-content-between mt-4"
                >
                  <div
                    className="p-2 border w-100"
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="d-flex justify-content-between border-bottom p-2 mt-1 shipping-div">
                      <div className="d-flex gap-30">
                        <p className="total-price">Contact</p>
                        <p className="total-price">
                          {defaultAddress.email}
                        </p>
                      </div>
                      <div>
                        <Link className="text-dark" to={"/viewAddress"}>
                          Change{" "}
                        </Link>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between mt-3  px-2 shipping-div-2">
                        <div className="d-flex gap-30">
                          <p className="total-price">Ship to</p>
                          <p className="total-price">
                            {defaultAddress.address}
                          </p>
                        </div>
                        <div>
                          <Link className="text-dark" to={"/viewAddress"}>
                            Change{" "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shipping-Mehtod mt-4 w-100">
                    <h4 className="shipping-title">Shipping Method</h4>
                    <div
                      className="d-flex justify-content-between border p-2 align-items-center"
                      style={{ borderRadius: "8px" }}
                    >
                      <div className="form-check gap-15">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="fastDelivery"
                          value="30.67"
                          checked={shippingCost === 30.67}
                          onChange={handleShippingChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="fastDelivery"
                        >
                          Fast Delivery (Under 2 Days)
                        </label>
                      </div>
                      <div>
                        <p className="mb-0 total-price">$ 30.67</p>
                      </div>
                    </div>
                    <div
                      className="d-flex justify-content-between mt-3 border p-2 align-items-center"
                      style={{ borderRadius: "8px" }}
                    >
                      <div className="form-check gap-15">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="casualDelivery"
                          value="5.34"
                          checked={shippingCost === 5.34}
                          onChange={handleShippingChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="casualDelivery"
                        >
                          Casual Delivery (Under 5 Days)
                        </label>
                      </div>
                      <div>
                        <p className="mb-0 total-price">$ 5.34</p>
                      </div>
                    </div>
                    <div
                      className="d-flex justify-content-between border mt-3 p-2 align-items-center"
                      style={{ borderRadius: "8px" }}
                    >
                      <div className="form-check gap-15">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="freeDelivery"
                          value="0"
                          checked={shippingCost === 0}
                          onChange={handleShippingChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="freeDelivery"
                        >
                          Free Delivery
                        </label>
                      </div>
                      <div>
                        <p className="mb-0 total-price">$ 0.00</p>
                      </div>
                    </div>
                  </div>

                  <div className="shipping-Mehtod mt-4 w-100 " >
                    <h5 className="shipping-title">Have you any Coupon?</h5>
                    <form onSubmit={handleApplyCoupon} className="d-flex justify-content-between border mt-3 p-2 align-items-center gap-10" style={{ borderRadius: "8px" }}>
                    <div className="flex-grow-1 input-div">
                        <input
                          type="text"
                          name="coupon"
                          placeholder="Enter Coupon Code"
                          value={coupon}
                          onChange={handleCouponChange}
                          className="form-control"
                        />
                      </div>
                      <button type="submit" className="border-0 button">
                        Submit
                      </button>
                    </form>
                    {couponError && <p className="text-danger mt-2">{couponError}</p>}
                    </div>

                  <div className="d-flex justify-content-between w-100 mt-4">
                    <div className="d-flex align-items-center gap-10 arraowdiv">
                      <IoIosArrowBack />
                      <Link to={"/checkout"}>Return to Information</Link>
                    </div>
                    <div>
                      <Link to={"/payment"} className="button">
                        Coninue to Paymnet
                      </Link>
                    </div>
                  </div>
                  <div className="mt-5 border-top w-100 reserved-div">
                    <p className="mt-3">All rights reserved Shourya Ecomm.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5">
<RightSideCheckout
          cartItems={products}
          shippingCost={shippingCost}
          totalAfterDiscount={totalAfterDiscount}
          discountAmount={discountAmount}
        />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;
