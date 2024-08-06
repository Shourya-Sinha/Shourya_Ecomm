import { Search } from "@mui/icons-material";
import { GithubLogo, InstagramLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react";
import React from "react";
import { Link } from "react-router-dom";

const Fotter = () => {
  return (
    <>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <h2 className="mb-0 text-white signuptext">
                  Sign Up for NewsLetter
                </h2>
              </div>
            </div>
            <div className="col-7">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-1"
                  placeholder="Your Email Address"
                  aria-label="Your Email Address"
                  aria-describedby="basic-addon2"
                />
                <span className="input-group-text p-2" id="basic-addon2">
                  SubsCribe
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-4">
              <h4 className="text-white mb-4">Contact Us</h4>
              <div>
                <address className="text-white fs-6">
                  Hno : 277 Near Vill Chopal,
                  <br /> Sonipat, Hryana <br />
                  PinCode: 563421
                </address>
                <a
                  href="tel:+91 8976452390"
                  className="mt-3 d-block mb-1 text-white"
                >
                  +91 8976452390
                </a>
                <a
                  href="mailto:shouryasinha.c@gmail.com"
                  className="mt-2 d-block mb-0 text-white"
                >
                  shouryasinha.c@gmail.com
                </a>
                <div className="social_icons d-flex align-items-center gap-30 mt-4">
                    <a href="#">
                        <LinkedinLogo size={25} color="white" />
                    </a>
                    <a href="#">
                        <InstagramLogo size={25} color="white" />
                    </a>
                    <a href="#">
                        <GithubLogo size={25} color="white" />
                    </a>
                    <a href="#">
                        <YoutubeLogo size={25} color="white" />
                    </a>
                </div>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Information</h4>
              <div className="footer-links d-flex flex-column">
                <Link to={'/policy'} className="text-white py-2 mb-1">Privacy Policy</Link>
                <Link to={'/refund'} className="text-white py-2 mb-1">Refund Policy</Link>
                <Link to={'/condition'} className="text-white py-2 mb-1">Terms & Condition</Link>
                <Link to={'/shiping'} className="text-white py-2 mb-1">Shipping Policy</Link>
                <Link to={'/blogs'} className="text-white py-2 mb-1">Blogs</Link>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Accounts</h4>
              <div className="footer-links d-flex flex-column">
                <Link to={'/about'} className="text-white py-2 mb-1">About Us</Link>
                <Link className="text-white py-2 mb-1">Faq</Link>
                <Link to={'/contact'} className="text-white py-2 mb-1">Contact</Link>
                <Link className="text-white py-2 mb-1">Search</Link>
              </div>
            </div>
            <div className="col-2">
              <h4 className="text-white mb-4">Quick Links</h4>
              <div className="footer-links d-flex flex-column">
                <Link className="text-white py-2 mb-1">Laptops</Link>
                <Link className="text-white py-2 mb-1">HeadPhones</Link>
                <Link className="text-white py-2 mb-1">Tablets</Link>
                <Link className="text-white py-2 mb-1">Watch</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <p className="text-center mb-0 text-white">
                &copy; {new Date().getFullYear()}; Powered by Developer's
                Shourya
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Fotter;
