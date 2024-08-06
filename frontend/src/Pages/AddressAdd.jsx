import React, { useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addUserAddress } from "../Feature/UserInfo/UserInfoSlice";
import NotificationComponent from "../Components/NotificationComponent";


const AddressAdd = () => {
    const dispatch = useDispatch();
    const [addressData,setAddressData]=useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNo: "",
        alternateNo:"",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        nearby:"",
        apartment:"",
        country: "",
        isDefault: true
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressData({
          ...addressData,
          [name]: type === "checkbox" ? checked : value,
        });
      };

      const handleSubmit = async(e) => {
        try {
            e.preventDefault();
            await dispatch(addUserAddress(addressData));
        } catch (error) {
            console.log(error);
        }finally{
            // Reset form
            setAddressData({
                firstName: "",
                lastName: "",
                email: "",
                mobileNo: "",
                alternateNo:"",
                address: "",
                city: "",
                state: "",
                zipCode: "",
                nearby:"",
                apartment:"",
                country: "",
                isDefault: true
            });
        }
      }; 
  return (
    <>
      <Meta title={"Add Address"} />
      <BreadCrumb title="Add New Address" />

      <div className="checkout-wrapper home-wrapper-2 py-5">
        <div className="container mx-auto" style={{ maxWidth: "900px" }}>
          <div className="row">
            <div className="col-12">
                <NotificationComponent />
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-wrap gap-15 justify-content-between mt-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isDefault"
                      checked={addressData.isDefault}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Set as default address
                    </label>
                  </div>
                  <div className="form-title-div">
                    <h4 className="form-title">Contact Information</h4>
                  </div>
                  <div className="w-100 d-flex flex-wrap gap-10">
                    <div className="flex-grow-1 input-div">
                      <input
                        type="text"
                        name="firstName"
                        value={addressData.firstName}
                        onChange={handleChange}
                        placeholder="First Name "
                        className="form-control"
                      />
                    </div>
                    <div className="flex-grow-1 input-div">
                      <input
                        type="text"
                        name="lastName"
                        value={addressData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="w-100 d-flex flex-wrap gap-10">
                    <div className="flex-grow-1 input-div">
                      <input
                        type="number"
                        name="mobileNo"
                        value={addressData.mobileNo}
                        onChange={handleChange}
                        placeholder="Mobile No. "
                        className="form-control"
                      />
                    </div>
                    <div className="flex-grow-1 input-div">
                      <input
                        type="number"
                        name="alternateNo"
                        value={addressData.alternateNo}
                        onChange={handleChange}
                        placeholder="Alternate No."
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="w-100 input-div">
                    <input
                      type="text"
                      name="email"
                        value={addressData.email}
                        onChange={handleChange}
                      placeholder="Your Email "
                      className="form-control"
                    />
                  </div>
                  <div className="form-title-div w-100 ">
                    <h4 className="form-title">Shipping Information</h4>
                  </div>
                  <div className="w-100 ">
                    <div className="flex-grow-1 input-div">
                      <input
                        type="text"
                        name="address"
                        value={addressData.address}
                        onChange={handleChange}
                        placeholder="Address "
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="w-100 d-flex flex-wrap gap-10">
                    <div className="flex-grow-1 input-div">
                      <input
                        type="text"
                        name="nearby"
                        value={addressData.nearby}
                        onChange={handleChange}
                        placeholder="Near By " 
                        className="form-control"
                      />
                    </div>
                    <div className="flex-grow-1 input-div">
                      <input
                        type="text"
                        name="apartment"
                        value={addressData.apartment}
                        onChange={handleChange}
                        placeholder="Apartments No., suite, etc. "
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="w-100 country-div">
                    <label className="form-label">Country/Region</label>
                    <select
                      name="country"
                      value={addressData.country}
                      onChange={handleChange}
                      className="form-control form-select"
                    >
                      <option value="">Select Country</option>
                      <option value="india">INDIA</option>
                      <option value="usa">USA</option>
                      <option value="uk">UK</option>
                      <option value="australia">Australia</option>
                      <option value="canada">Canada</option>
                    </select>
                  </div>
                  <div className="flex-grow-1 input-div">
                    <input
                      type="text"
                      name="city"
                        value={addressData.city}
                        onChange={handleChange}
                      placeholder="City"
                      className="form-control"
                    />
                  </div>
                  <div className="flex-grow-1 country-div">
                    <label className="form-label">State</label>
                    <select
                      name="state"
                      value={addressData.state}
                      onChange={handleChange}
                      className="form-control form-select"
                    >
                      <option value="">Select State</option>
                      <option value="bihar">Bihar</option>
                      <option value="up">U.P</option>
                      <option value="delhi">New Delhi</option>
                      <option value="odissa">Odisha</option>
                      <option value="punjab">Punjab</option>
                    </select>
                  </div>
                  <div className="flex-grow-1 input-div">
                    <input
                      type="text"
                      name="zipCode"
                        value={addressData.zipCode}
                        onChange={handleChange}
                      placeholder="Zip Code"
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex justify-content-between w-100 mt-4">
                    <div className="d-flex align-items-center gap-10 arraowdiv">
                      <IoIosArrowBack />
                      <Link to={"/"}>Return to Home</Link>
                    </div>
                    <div className="d-flex align-items-center gap-10 arraowdiv">
                      <IoIosArrowBack />
                      <Link to={"/viewAddress"}>See Saved Address</Link>
                    </div>
                    <div>
                      <button type="submit" className="button border-0">
                        Save Address
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 border-top w-100 reserved-div">
                    <p className="mt-3">All rights reserved Shourya Ecomm.</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressAdd;
