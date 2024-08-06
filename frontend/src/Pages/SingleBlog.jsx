import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { Link, useLocation, useParams } from "react-router-dom";
import { TbArrowLeft } from "react-icons/tb";
import { FaFacebook } from "react-icons/fa6";
import { IoLogoTwitter } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import { Base_Url2 } from "../Feature/Product/ProductSlice";
import axios from "axios";
const SingleBlog = () => {
  const { id } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState(location.state?.blog || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blog) {
      const fetchBlog = async () => {
        try {
          //console.log(`Fetching blog with ID: ${id}`); // Log the blog ID
          const response = await axios.get(`${Base_Url2}/blog/getaBlog/${id}`);
          //console.log(response.data);
          setBlog(response.data.blog);
          
        } catch (error) {
          //console.error("Error fetching the blog data", error);
          setError("Blog not found.");
        }
      };
      fetchBlog();
    }
  }, [blog, id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>Loading...</div>;
  }
  //console.log('blog',blog);

  // Placeholder image URL
  const placeholderImage = 'https://via.placeholder.com/300x200';

  return (
    <>
      {/* <Meta title={"Dynamic Blog name"} />
      <BreadCrumb title="Dynamic Blog name" /> */}
      <Meta title={blog.title} />
      <BreadCrumb title={blog.title} />

      <div className="blog-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="single-blog-card">
                <h3 className="title">
                  {blog.title}
                </h3>
                <img
                  className="img-fluid w-100 my-4"
                  src={blog.images.length > 0 ? blog.images[0].url : placeholderImage}
                  alt="Blog Image"
                />
                 <p>{blog.description}</p>

                {/* <p>11 JUN, 2022 Shourya Sinha</p> */}<p>{new Date(blog.createdAt).toLocaleDateString()} {blog.author}</p>

                <div className="sendond-div-blog d-flex justify-content-between mt-5 p-3">
                  <div className="d-flex">
                    <Link to="/blogs">
                      <TbArrowLeft
                        className="fs-5"
                        style={{ marginRight: "10px" }}
                      />
                      Back to Blogs
                    </Link>
                  </div>
                  <div className="d-flex  gap-15">
                    <FaFacebook />
                    <IoLogoTwitter />
                    <RiInstagramFill />
                  </div>
                </div>
                <div className="comment-div p-3 bg-white shadow mt-3">
                  <h5>Leave A Comment</h5>
                  <form action="" className="d-flex flex-column gap-15">
                    <div className="row">
                      <div className="col-6">
                        <div>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Name *"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email *"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <textarea
                        placeholder="Comments *"
                        name=""
                        id=""
                        cols={20}
                        rows={3}
                        className="w-100 form-control"
                      />{" "}
                    </div>
                    <div className="d-flex">
                    <button type="submit" className="button border-0 ">
                      Post Comment
                    </button>
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

export default SingleBlog;
