import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Feature/Auth/AuthSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokenSent = useSelector((state)=>state.auth.isTokenSent);
  const [formValues,setFormValues]=useState({
    email:''
  });
  const handleChange=(e)=>{
    setFormValues({...formValues,[e.target.name]:e.target.value});
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(forgotPassword(formValues));
  }
  useEffect(()=>{
    if(tokenSent){
      navigate("/login");
    }
  },[])
  return (
    <>
      <Meta title={"Account"} />
      <BreadCrumb title="Account" />

      <div className="login-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <div className="logoin-card">
                  <h3 className="text-center mb-3">Forget Password</h3>
                  <p className="text-center mb-3 mt-2">
                    We will send you an Email to reset Your Passwprd
                  </p>
                  <form onSubmit={handleSubmit} className="d-flex flex-column gap-30">
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <div className="d-flex justify-content-center flex-column gap-15 align-items-center">
                        <button className="button border-0" type="submit">
                          Submit
                        </button>
                        <Link to={"/login"}>Login</Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
