import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser } from "../Feature/Auth/AuthSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isRegeistered = useSelector((state)=> state.auth.isRegistered);

  useEffect(()=>{
    if(isRegeistered){
      navigate('/login');
    }
  },[isRegeistered])

  const [formValues,setFormValues] = useState({
    firstName:'',
    lastName:'',
    phoneNo:'',
    email:'',
    password:''
  });
  const handleChage=(e)=>{
    setFormValues({...formValues, [e.target.name]:e.target.value});
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(RegisterUser(formValues));
  };

  return (
    <>
      <Meta title={"Create Account"} />
      <BreadCrumb title="Create Account" />

      <div className="login-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <div className="logoin-card">
                  <h3 className="text-center mb-3">Create Account</h3>
                  <form onSubmit={handleSubmit} className="d-flex flex-column gap-15">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleChage}
                        className="form-control"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formValues.lastName}
                        onChange={handleChage}
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phoneNo"
                        value={formValues.phoneNo}
                        onChange={handleChage}
                        className="form-control"
                        placeholder="Phone No."
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChage}
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleChage}
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <Link to={"/login"}>Already Have an Account?</Link>
                      <div className="d-flex justify-content-center gap-15 align-items-center">
                        <button className="button border-0" type="submit">
                          Register
                        </button>
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

export default Signup;
