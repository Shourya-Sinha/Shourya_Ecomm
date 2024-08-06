import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { HiCreditCard } from "react-icons/hi2";
import { FaLock } from "react-icons/fa";
import { AiFillQuestionCircle } from "react-icons/ai";
import { FaAmazonPay } from "react-icons/fa6";
import { FaCcPaypal } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { createFinalUserOrder } from "../Feature/Product/ProductSlice";
import { v4 as uuidv4 } from 'uuid';
import NotificationComponent from "../Components/NotificationComponent";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalPrice,setTotalPrice] = useState(null);
  const cartData = useSelector((state) => state.product.cartData) || {
    products: [],
  };
  const allAddresses = useSelector((state) => state.userInfo.allAddress);
  useEffect(() => {
    if (cartData.totalAfterDiscount && cartData.totalAfterDiscount > 0) {
      setTotalPrice(cartData.totalAfterDiscount + cartData.shippingFee );
    } else {
      setTotalPrice(cartData.cartTotal + cartData.shippingFee );
    }
  }, [cartData.totalAfterDiscount, cartData.cartTotal]);
  const { products } = cartData;
  const [selectedpaymentMethod, setSelectPaymentMethod] = useState("COD");
  const [useNewAddress, setNewAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleChangeAddresss = (event) => {
    setSelectedAddress(event.target.value);
  };
  
  const handlepaymentChange = (event) => {
    setSelectPaymentMethod(event.target.value);
  };

  useEffect(() => {
    const defaultAddress = allAddresses.find(address => address.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id);
    }
  }, [allAddresses]);


  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const totalAfterDiscount = cartData.totalAfterDiscount ?? 0; // Default to 0 if undefined
  const cartTotal = cartData.cartTotal ?? 0; // Default to 0 if undefined
  const shippingFee = cartData.shippingFee ?? 0; // Default to 0 if undefined

  const totalPrice = totalAfterDiscount > 0 
    ? totalAfterDiscount + shippingFee 
    : cartTotal + shippingFee;

  // console.log('totalPrice:', totalPrice); // Debugging line
  // console.log('cartData:', cartData); // Debugging line
 
    const orderData = {
      products: cartData.products,
      paymentIntent: {
        id: uuidv4(), // Generate a unique ID
        method: selectedpaymentMethod,
        amount: totalPrice,
        status: "Processing",
        created: Date.now(),
        currency: "USD",
        orderStatus: "Processing",
      },
      // orderBy: cartData.orderBy,
      // address: selectedAddress,
      // totalAfterDiscount: cartData.totalAfterDiscount,
      // discountAmount: cartData.discountAmount,
      // shippingFee: cartData.shippingFee,
      // cartTotalNotDiscount: cartData.cartTotal,
      // COD: selectedpaymentMethod,
      // totalPaymentPaidByUser: totalPrice
      orderBy: cartData.orderBy,
    address: selectedAddress,
    totalAfterDiscount: totalAfterDiscount, // Ensure default value is used
    discountAmount: cartData.discountAmount ?? 0, // Providing default value
    shippingFee: shippingFee, // Ensure default value is used
    cartTotalNotDiscount: cartTotal, // Ensure default value is used
    COD: selectedpaymentMethod,
    totalPaymentPaidByUser: totalPrice,
    };
  
    //console.log('orderData:', orderData);
   dispatch(createFinalUserOrder(orderData,navigate));
  };
  
  return (
    <>
      <Meta title={"Payment Method"} />
      <BreadCrumb title="Payment Method" />

      <section className="payment-wrapper py-5 home-wrapper-2">
        <div className="container px-5 ">
          <div className="row">
            <div className="col-6">
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
                    <li className="breadcrumb-item active" aria-current="page">
                      {" "}
                      Shipping
                    </li>
                    <li className="breadcrumb-item " aria-current="page">
                      {" "}
                      Payment
                    </li>
                  </ol>
                </nav>
                <div>
                  <h5 className="payment-head mb-1">Products</h5>
<NotificationComponent />
                  <div className="d-flex w-100 overflow-auto">
                    {products.map((item) => (
                      <div
                        key={item.product._id}
                        className="d-flex flex-column align-items-center position-relative p-1"
                      >
                        <span
                          style={{ top: "5px", right: "9px" }}
                          className="badge bg-secondary text-white rounded-circle position-absolute"
                        >
                          {item.count}
                        </span>
                        <img
                          src={item.product.images[0]?.url} // Added optional chaining to prevent errors
                          alt={item.product.title}
                          className="img-fluid rounded"
                          style={{
                            width: "100px",
                            height: "80px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-1 payment-header ">
                  <h4 className="payment-head mb-1">Payment Methods</h4>
                  <p className="payment-note">
                    Note: All Transactions are secure and encryted!
                  </p>
                </div>
                <div className="mb-3">
                <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value={"COD"}
                      checked={selectedpaymentMethod === "COD"}
                      onChange={handlepaymentChange}
                    />
                    <label className="form-check-label" for="flexRadioDefault2">
                      Cash On Delivery
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value={"credit"}
                      checked={selectedpaymentMethod === "credit"}
                      onChange={handlepaymentChange}
                    />
                    <label className="form-check-label" for="flexRadioDefault2">
                      Credit / Debit /Rupay Card
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      value="upi"
                      checked={selectedpaymentMethod === "upi"}
                      onChange={handlepaymentChange}
                    />
                    <label className="form-check-label" for="flexRadioDefault2">
                      Indian UPI Payment System
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault3"
                      value="paypal"
                      checked={selectedpaymentMethod === "paypal"}
                      onChange={handlepaymentChange}
                    />
                    <label className="form-check-label" for="flexRadioDefault2">
                      Paypal Payment System
                    </label>
                  </div>
                </div>
                <div className="debit-credit-system">
                  <form
                    className={`payment-form ${
                      selectedpaymentMethod === "credit" ? "show" : "hide"
                    }`}
                    action=""
                  >
                    <div
                      className="payent-main-div border w-100"
                      style={{
                        borderRadius: "6px",
                        backgroundColor: "#eeeeee",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center bg-white p-3">
                        <div>
                          <p className="mb-0 card-header-res">
                            All Card Supported
                          </p>
                        </div>

                        <HiCreditCard />
                      </div>
                      <div className="card-details-div m-3">
                        <div
                          className="d-flex align-items-center "
                          style={{ position: "relative" }}
                        >
                          <input
                            type="text"
                            className="form-control "
                            placeholder="Card Number"
                          />

                          <FaLock
                            style={{
                              position: "absolute",
                              right: "10px", // Adjust as needed
                              top: "15%",
                              marginTop: "5px", // Adjust as needed
                              color: "#6c757d", // Adjust as needed
                            }}
                          />
                        </div>
                      </div>
                      <div className="card-details-div m-3">
                        <div className="d-flex align-items-center ">
                          <input
                            type="text"
                            className="form-control "
                            placeholder="Card Holder Name"
                          />
                        </div>
                      </div>
                      <div className="d-flex m-3 gap-15">
                        <div className="card-details-div flex-grow-1">
                          <div className="d-flex align-items-center ">
                            <input
                              type="text"
                              className="form-control "
                              placeholder="Expiration date (MM/YY)"
                            />
                          </div>
                        </div>
                        <div className="card-details-div  flex-grow-1">
                          <div
                            className="d-flex align-items-center "
                            style={{ position: "relative" }}
                          >
                            <input
                              type="text"
                              className="form-control "
                              placeholder="Security Code"
                            />
                            <AiFillQuestionCircle
                              style={{
                                position: "absolute",
                                right: "10px", // Adjust as needed
                                top: "15%",
                                marginTop: "5px", // Adjust as needed
                                color: "#6c757d", // Adjust as needed
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="debit-credit-system">
                  <form
                    className={`payment-form ${
                      selectedpaymentMethod === "upi" ? "show" : "hide"
                    }`}
                    action=""
                  >
                    <div
                      className="payent-main-div border w-100"
                      style={{
                        borderRadius: "6px",
                        backgroundColor: "#eeeeee",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center bg-white p-3">
                        <div>
                          <p className="mb-0 card-header-res">
                            Googleay/PhonePay Supported
                          </p>
                        </div>

                        <FaAmazonPay />
                      </div>
                      <div className="card-details-div m-3">
                        <div
                          className="d-flex align-items-center "
                          style={{ position: "relative" }}
                        >
                          <input
                            type="text"
                            className="form-control "
                            placeholder="Upi Id"
                          />

                          <FaLock
                            style={{
                              position: "absolute",
                              right: "10px", // Adjust as needed
                              top: "15%",
                              marginTop: "5px", // Adjust as needed
                              color: "#6c757d", // Adjust as needed
                            }}
                          />
                        </div>
                        <p className="text-center mt-3">OR</p>
                      </div>
                      <div className="card-details-div m-3">
                        <div className="d-flex align-items-center ">
                          <input
                            type="tel"
                            className="form-control "
                            placeholder="Upi Number"
                          />
                        </div>
                      </div>
                      <div className="d-flex m-3 gap-15">
                        <div className="card-details-div  flex-grow-1"></div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="debit-credit-system">
                  <form
                    className={`payment-form ${
                      selectedpaymentMethod === "paypal" ? "show" : "hide"
                    }`}
                    action=""
                  >
                    <div
                      className="payent-main-div border w-100"
                      style={{
                        borderRadius: "6px",
                        backgroundColor: "#eeeeee",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center bg-white p-3">
                        <div>
                          <p className="mb-0 card-header-res">
                            PayPal Supported
                          </p>
                        </div>

                        <FaCcPaypal />
                      </div>
                      <div className="card-details-div m-3">
                        <div
                          className="d-flex align-items-center "
                          style={{ position: "relative" }}
                        >
                          <input
                            type="text"
                            className="form-control "
                            placeholder="Enter Paypal Id"
                          />

                          <FaLock
                            style={{
                              position: "absolute",
                              right: "10px", // Adjust as needed
                              top: "15%",
                              marginTop: "5px", // Adjust as needed
                              color: "#6c757d", // Adjust as needed
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-6 bg-white">
              <div className="billing-address p-4">
                <div>
                  <h5 className="website-name">Billing Details</h5>
                  <p className="note">
                    {" "}
                    Select the adddress that matches your card or payment method
                    to Tax Return
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <h5 className="website-name">Total price</h5>
                  <p className="note">
                    {totalPrice}
                  </p>
                </div>

                <div className="w-100 country-div mb-3">
                    <label className="form-label">Selected Address change if want</label>
                    <select
                      name="country"
                     value={selectedAddress}
                     onChange={handleChangeAddresss}
                      className="form-control form-select"
                    >
                      <option value="">Select Address</option>
                      {allAddresses.map((address, index) => (
            <option key={index} value={address._id}>
              {address.firstName + " " + address.lastName} + {address.email}
            </option>
          ))}
                    </select>
                  </div>
                <form action="">
                  <div
                    className="border bg-white"
                    style={{ borderRadius: "6px" }}
                  >
                    <div className="p-2 border-bottom">
                      <div
                        className="form-check custom-form-ch"
                        style={{ marginLeft: "15px" }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"same"}
                          id="flexRadioDefault2"
                          checked={!useNewAddress}
                          // onChange={handleChangeAddress}
                        />
                        <label
                          className="form-check-label"
                          for="flexRadioDefault2"
                        >
                          Same as Shipping Address
                        </label>
                      </div>
                    </div>
                    <div className="p-2">
                      <div
                        className="form-check custom-form-ch"
                        style={{ marginLeft: "15px" }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          disabled
                          value={"new"}
                          checked={useNewAddress}
                          // onChange={handleChangeAddress}
                          id="flexRadioDefault2"
                        />
                        <label
                          className="form-check-label"
                          for="flexRadioDefault2"
                        >
                          Use New Shipping Address
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`mt-3 border new-address-div ${
                      useNewAddress ? "show" : "hide"
                    }`}
                    style={{
                      padding: "5px 25px 5px 25px",
                      backgroundColor: "#eeeeee",
                    }}
                  >
                    <p className="mt-2">New Shipping Address</p>
                    <div className="d-flex gap-15">
                      <div className="mb-3 flex-grow-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="mb-3 flex-grow-1">
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Phone No."
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <div className="d-flex gap-15">
                      <div className="mb-3 flex-grow-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Street Address"
                        />
                      </div>
                      <div className="mb-3 flex-grow-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Zip"
                        />
                      </div>
                    </div>

                    <div className="d-flex w-100 gap-15">
                      <div className="mb-3 flex-grow-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="City"
                        />
                      </div>
                      <div className="mb-3 flex-grow-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="State"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3 buttonship-div ">
                    <div className="d-flex align-items-center gap-15">
                      <IoIosArrowBack />
                      <Link to={"/ship"}>Return to shipping</Link>
                    </div>
                    <button onClick={(e)=>handlePlaceOrder(e)} className="button border-0">
                      Pay Now
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="border-top billing-address"
                style={{ padding: "5px 2px 2px 24px" }}
              >
                <p>All rights reserved Shourya Ecomm</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Payment;
