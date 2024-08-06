import React from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import RightSideCheckout from "../Components/RightSideCheckout";
import { useSelector } from "react-redux";

const Checkout = () => {
  const address = useSelector((state)=> state.userInfo.allAddress);
  const navigate = useNavigate();
  const defaultAddress = address.find((address) => address.isDefault);
  const cartData = useSelector((state) => state.product.cartData) || { products: [] };
  const { products } = cartData;

  const handleAddressChabge=(e)=>{
    const selectedValue = e.target.value;
    if(selectedValue === 'new_address'){
      navigate('/address');
    }
  }

  return (
    <>
      <Meta title={"Checkout"} />
      <BreadCrumb title="Checkout" />

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
                    <li className="breadcrumb-item " aria-current="page">
                      {" "}
                      Information
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {" "}
                      Shipping
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {" "}
                      Payment
                    </li>
                  </ol>
                </nav>
                <div className="contract-info">
                  <h4 className="title">Contact Information</h4>
                  <div className="form-check ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                      checked
                    />
                    <label className="form-check-label" for="flexCheckChecked">
                      Subscribe to Recieve our news and offers
                    </label>
                    <p className="note-p">Note: If Contact Information Not fill then automatic select from user login information!</p>
                  </div>
                  <Link to={'/viewAddress'}>Select Address </Link>

                  {
                    defaultAddress ? 
                    <div
                      className="d-flex flex-wrap gap-15 justify-content-between mt-4"
                    >
                      <div className="flex-grow-1 country-div">
                        <label className="form-label" >Fist Name</label>
                        <input
                          type="text"
                          placeholder="First Name"
                          className="form-control pt-3"
                          value={defaultAddress.firstName}
                        />
                      </div>
                      <div className="flex-grow-1 country-div">
                        <label className="form-label" >Last Name</label>
                        <input
                          type="text"
                          placeholder="Last Name."
                          className="form-control pt-3"
                          value={defaultAddress.lastName}
                        />
                      </div>
                      <div className="flex-grow-1 country-div">
                        <label className="form-label" >Mobile No.</label>
                        
                        <input
                          type="tel"
                          placeholder="Mobile No."
                          value={defaultAddress.mobileNo}
                          className="form-control pt-3"
                        />
                      </div>
                      <div className="flex-grow-1 country-div">
                        <label className="form-label" >Alternate No.</label>
                        
                        <input
                          type="tel"
                          placeholder="Alternate No."
                          value={defaultAddress.alternateNo}
                          className="form-control pt-3"
                        />
                      </div>
                      <div className="flex-grow-1 country-div">
                      <label className="form-label" >Email.</label>
                        <input
                          type="email"
                          placeholder="Email"
                          value={defaultAddress.email}
                          className="form-control pt-3"
                        />
                      </div>
                  <div className="d-flex flex-wrap gap-15 justify-content-between mt-4">
                    <div className="form-title-div">
                      <h4 className="form-title">Shipping Address</h4>
                    </div>
                    <div className="w-100 country-div">
                      <label className="form-label">Saved Address</label>
                      <select name="" className="form-control form-select" id="" onChange={handleAddressChabge}>
                        <option value={''} selected disabled>Default Address Selected</option>
                       <option value={"new_address"} > 
                          New Address 
                        </option>
                        
                      </select>
                    </div>
                    <div className="w-100 country-div">
                      <label className="form-label" >Country.</label>
                    <input
                        type="text"
                        placeholder="Country"
                        className="form-control pt-3"
                        value={defaultAddress.country}
                      />
                    </div>
                    <div className="flex-grow-1 country-div">
                      <label className="form-label" >NearBy Location.</label>
                      <input
                        type="text"
                        placeholder="Nearby"
                        className="form-control pt-3"
                        value={defaultAddress.nearby}
                      />
                    </div>
                    <div className="flex-grow-1 country-div">
                      <label className="form-label" >ZipCode</label>
                    <input
                        type="text"
                        placeholder="Zip Code"
                        className="form-control pt-3"
                        value={defaultAddress.zipCode}
                      />
                    </div>
                    <div className="w-100 country-div">
                      <label className="form-label" >Address.</label>
                      <input
                        type="text"
                        placeholder="Address"
                        className="form-control pt-3"
                        value={defaultAddress.address}
                      />
                    </div>
                    <div className="w-100 country-div">
                    <label className="form-label" >House No.</label>
                      <input
                        type="text"
                        placeholder="Apartments, suite, etc."
                        className="form-control pt-3"
                        value={defaultAddress.apartment}
                      />
                    </div>
                    <div className="flex-grow-1 country-div">
                    <label className="form-label" >Your City</label>
                      <input
                        type="text"
                        placeholder="City"
                        className="form-control pt-3"
                        value={defaultAddress.city}
                      />
                    </div>
                    <div className="flex-grow-1 country-div">
                      <label className="form-label" >State</label>
                      <input
                        type="text"
                        placeholder="State"
                        className="form-control pt-3"
                        value={defaultAddress.state}
                      />
                    </div>                  
                    <div className="d-flex justify-content-between w-100 mt-4">
                      <div className="d-flex align-items-center gap-10 arraowdiv">
                        <IoIosArrowBack />
                        <Link to={"/cart"}>Return to cart</Link>
                      </div>
                      <div>
                        <Link to={"/ship"} className="button">
                          Coninue to shipping
                        </Link>
                      </div>
                    </div>
                    <div className="mt-5 border-top w-100 reserved-div">
                      <p className="mt-3">All rights reserved Shourya Ecomm.</p>
                    </div>
                    </div>
                  </div> : <p style={{color:'red',textDecoration:'capitalize'}}> No Default Address Selected Check in Address Page</p>
                  }
                </div>
              </div>
            </div>
            <div className="col-5">
<RightSideCheckout cartItems={products} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
