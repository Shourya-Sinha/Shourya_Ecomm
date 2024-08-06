import React from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  return (
    <>
      <Meta title={"Reset Account Password"} />
      <BreadCrumb title="Reset Account Password" />

      <div className="login-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <div className="logoin-card">
                  <h3 className="text-center mb-3">Reset Your Password</h3>
                  <form action="" className="d-flex flex-column gap-30">
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confpassword"
                        className="form-control"
                        placeholder="Confirm Password"
                      />
                    </div>
                    <div>
                      <div className="d-flex justify-content-center gap-15 align-items-center">
                        <button className="button border-0" type="submit">
                          Save
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

export default ResetPassword;
