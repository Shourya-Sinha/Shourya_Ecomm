import { Email, LinkedIn, LocationCityRounded } from "@mui/icons-material";
import {
  FacebookLogo,
  InstagramLogo,
  Phone,
  TwitterLogo,
} from "@phosphor-icons/react";
import React from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { IoHomeOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import { IoMailUnreadOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";

const Contact = () => {
  return (
    <>
      <Meta title={"Contact Us"} />
      <BreadCrumb title="Contact Us" />
      <div className="contact-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7643.580434330142!2d98.495531!3d16.687378!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sth!4v1719991848755!5m2!1sen!2sth"
                width="600"
                height="450"
                className="border-0 w-100"
                allowFullScreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="col-12 mt-5">
              <div className="contact-inner-wrapper d-flex justify-content-between">
                <div>
                  <h3 className="contact-title mb-4">Contact</h3>
                  <form action="" className="d-flex flex-column gap-15">
                    <div>
                      {" "}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                      />{" "}
                    </div>

                    <div>
                      {" "}
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                      />{" "}
                    </div>
                    <div>
                      {" "}
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Mobile No."
                      />{" "}
                    </div>
                    <div>
                      {" "}
                      <textarea
                        placeholder="Comments"
                        name=""
                        id=""
                        cols={30}
                        rows={4}
                        className="w-100 form-control"
                      />{" "}
                    </div>
                    <div>
                      <button className="button border-0">Submit</button>
                    </div>
                  </form>
                </div>
                <div>
                  <h3 className="contact-title mb-4">Get in touch with us</h3>
                  <div>
                    <ul className="ps-0">
                      <li className="mb-3 d-flex gap-15 align-items-center"><IoHomeOutline className="fs-5"/>
                      <address className="mb-0">Hno:234, Near StateBank Patna Bihar</address>
                      </li>
                      <li className="mb-3 d-flex gap-15 align-items-center"><IoCallOutline className="fs-5"/>
                      <a href="tel: +91 7856348967">+91 7856348967 </a>
                      </li>
                      <li className="mb-3 d-flex gap-15 align-items-center"> <IoMailUnreadOutline className="fs-5"/>
                      <a href="mailto:shouryasinha.c@gmail.com">shouryasinha.c@gmail.com</a>
                      </li>
                      <li className="mb-3 d-flex gap-15 align-items-center"><IoMdInformationCircleOutline className="fs-5"/>
                      <p className="mb-0">Monday - Friday 10AM - 8 PM</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
