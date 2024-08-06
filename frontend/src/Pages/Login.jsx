import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../Feature/Auth/AuthSlice";
import NotificationComponent from "../Components/NotificationComponent";

const Login = () => {
  const isLoggedIn  = useSelector((state)=> state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn ) {
        navigate('/');
    }
}, [isLoggedIn , navigate]);
  const [formValues,setFormValues] =useState({
    email: '',
    password: ''
  });

  const handleChange=(e)=>{
    const {name,value} = e.target;
    setFormValues({...formValues,[name]:value});
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(LoginUser(formValues));
  }



  return (
    <>
      <Meta title={"Login"} />
      <BreadCrumb title="Login" />

      <div className="login-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <div className="logoin-card">
                  <h3 className="text-center mb-3">Login</h3>
                  <NotificationComponent />
                  <form onSubmit={handleSubmit} className="d-flex flex-column gap-30">
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Email"
                        autoComplete="off"
                      />
                    </div>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Password"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Link to={"/forgot-password"}>Forgot Password?</Link>
                      <div className="d-flex justify-content-center gap-15 align-items-center">
                        <button className="button border-0" type="submit">
                          Login
                        </button>
                        <Link to={"/signup"} className="button signup">
                          SignUp
                        </Link>
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

export default Login;
