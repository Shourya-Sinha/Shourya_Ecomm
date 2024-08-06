import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import ProductCard from "../Components/ProductCard";
import ReactStars from "react-rating-stars-component";
import ImageZoom from "react-image-zooom";
import Color from "../Components/Color";
import { Link, useParams } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdOutlineLocalShipping } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { DiMaterializecss } from "react-icons/di";
import { GiConsoleController, GiResize } from "react-icons/gi";
import { IoIosLink } from "react-icons/io";
import { FaCcVisa } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa6";
import { SiAmericanexpress } from "react-icons/si";
import { FaCcPaypal } from "react-icons/fa";
import { FaCcDiscover } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getproductById } from "../Feature/Product/ProductSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { Toast } from "react-bootstrap";

const Base_Url = "https://shourya-ecomm.onrender.com";
const Singlrroduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const [quantity, setQuantity] = useState(1);
  const [orderProduct, setOrderProduct] = useState(true);
  const [showReviewform, setShowReviewform] = useState(false);
  const [showShip, setShowShip] = useState(false);
  const [showmaterial, setShowMaerial] = useState(false);
  const [showresize, setShowResize] = useState(false);
  const [showcare, setShowCare] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    revTitle: '',
    comment: '',
    email: '',
    star: 0,
    name: '',
    postedBy: '',
  });
  const userId = useSelector((state)=> state.auth.user.userId);
  // console.log('user id',userId);
  // console.log('productid',id);

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleStarChange = (newRating) => {
    setReviewForm({ ...reviewForm, star: newRating });
  };

  const handleSubmitReview = async (e) => {
    //console.log('revewform daraty',reviewForm);
    e.preventDefault();
    const token = localStorage.getItem('uoi-did');
    if (!token) {
      throw new Error('User not Authenticated');
    }
    try {
      const response = await axios.put(
        `${Base_Url}/product/ratings`,
        {
          prodId: id,
          star: reviewForm.star,
          comment: reviewForm.comment,
          email: reviewForm.email,
          name: reviewForm.name,
          revTitle: reviewForm.revTitle,
          postedBy: userId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success('Review submitted successfully');
      //console.log('response', response);
      setReviewForm({
        revTitle: '',
        comment: '',
        email: '',
        star: 0,
        name: '',
        postedBy: '',
      });
      setShowReviewform(false);
    } catch (error) {
      toast.error('Something went wrong. Try again later.');
      console.log('error', error);
    }
  };

  const product =useSelector((state)=>state.product.proId);
  const error = useSelector((state) => state.product.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      //console.log('product id in page',id)
      dispatch(getproductById(id));
    } else {
      //console.error('Product ID is undefined',id);
    }
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    try {
      //const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('uoi-did')
      //const token = user?.token;
      
      if (!token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.post(
        `${Base_Url}/auth/user/cart`,
        {
          cart: [
            {
              id: id,
              count: quantity,
              color: product.color.title
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        }
      );
      toast.success('Product added to cart!');
    } catch (error) {
      console.log('error in sibgloe product pagte ',error);
      toast.error('Failed to add product to cart.');
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;
  

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleToggleshipping = (e) => {
    e.preventDefault();
    setShowShip((prev) => !prev);
  };
  const handleTogglematerial = (e) => {
    e.preventDefault();
    setShowMaerial((prev) => !prev);
  };
  const handleToggleresize = (e) => {
    e.preventDefault();
    setShowResize((prev) => !prev);
  };
  const handleTogglecare = (e) => {
    e.preventDefault();
    setShowCare((prev) => !prev);
  };

  const handleToggleReviewForm = (e) => {
    e.preventDefault();
    setShowReviewform((prev) => !prev);
  };
  const copyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  return (
    <>
      <Meta title={"Product Name"} />
      <BreadCrumb title="Product Name" />
         <ToastContainer />
      <div className="main-product-wrapper home-wrapper-2 py-5">
        <div className="container-xxl ">
          <div className="row">
            <div className="col-6">
              <div className="main-product-image">
                <div className="d-flex justify-content-center">
                  <ImageZoom
                  className="img-fluid"
                    //src="https://ik.imagekit.io/p66ljstle/images/watch.jpg?updatedAt=1710580566989"
                    src={product.images[0]?.url || "default_image_url"}
                    alt={product.title}
                    zoom="200"
                  />
                </div>
              </div>
              <div className="other-product-images d-flex flex-wrap gap-15">
                <div>
                  <img
                    src={product.images[0]?.url || "default_image_url"}
                    alt="other image"
                    className="img-fluid"
                  />
                </div>
                <div>
                  <img
                    src={product.images[0]?.url || "default_image_url"}
                    alt="other image"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="main-product-details">
                <div className="border-bottom">
                  <h3 className="title">
                    {product.title}
                  </h3>
                </div>
                <div
                  className=" py-3"
                  style={{
                    borderBottom: "1px solid #eeeeee",
                    paddingBottom: 1,
                  }}
                >
                  <p className="price">$ {product.price}</p>
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      count={5}
                      size={15}
                      value={3}
                      edit={false}
                      activeColor={"#FFD700"}
                    />
                    <p className="mb-0 t-review">(2 Reviews)</p>
                  </div>
                  <a className="review-btn" href="#review">
                    Write a Review
                  </a>
                </div>
                <div className=" border-bottomm py-3 mb-2 ">
                  <div className="d-flex gap-10 align-items-center my-3">
                    <h3 className="product-heading">Type :</h3>
                    <p className="product-data">Watch</p>
                  </div>
                  <div className="d-flex gap-10 align-items-center my-3">
                    <h3 className="product-heading mb-0">Brand :</h3>
                    <p className="product-data mb-0">{product.brand.title}</p>
                  </div>
                  <div className="d-flex gap-10 align-items-center my-3">
                    <h3 className="product-heading">Category :</h3>
                    <p className="product-data">{product.category.title}</p>
                  </div>
                  <div className="d-flex gap-10 align-items-center my-3">
                    <h3 className="product-heading">Tags :</h3>
                    <p className="product-data">{product.tags}</p>
                  </div>
                  <div className="d-flex gap-10 align-items-center my-3">
                    <h3 className="product-heading">SKU :</h3>
                    <p className="product-data">SKU237</p>
                  </div>
                  <div className="d-flex gap-10 align-items-center my-3">
                    <h3 className="product-heading">Availability :</h3>
                    <p className="product-data">{product.quantity} In Stock</p>
                  </div>
                  <div className="d-flex gap-10 flex-column mt-2 mb-3 bordersize">
                    <h3 className="product-heading">Size :</h3>
                    <div className="d-flex flex-wrap gap-15">
                      <span className="badge border border-1 bg-white text-dark border-secondary">
                        S
                      </span>
                      <span className="badge border border-1 bg-white text-dark border-secondary">
                        M
                      </span>
                      <span className="badge border border-1 bg-white text-dark border-secondary">
                        L
                      </span>
                      <span className="badge border border-1 bg-white text-dark border-secondary">
                        XL
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-10 flex-column mt-2 mb-3 bordersize">
                    <h3 className="product-heading text-capitalize">Color :{product.color.title} </h3>
                    <Color />
                  </div>
                  <div className="d-flex gap-10 flex-row mt-2 mb-3 align-items-center">
                    <h3 className="product-heading">Quantity : </h3>
                    <div className="">
                      <input
                        type="number"
                        name="count"
                        value={quantity}
                        min={1}
                        max={10}
                        className="form-control"
                        style={{ width: '50px' }}
                        onChange={handleQuantityChange}
                        id=""
                      />
                    </div>
                    <div className="d-flex align-items-center gap-30 ms-5 buttondiv">
                      <button className="button border-0" onClick={handleAddToCart}>Add To Cart</button>
                      <button className="button border-0 signup2">
                        Buy It Now
                      </button>
                    </div>
                  </div>
                  <div
                    className="d-flex align-items-center gap-15 py-2"
                    style={{ borderBottom: "1px solid #eeeeee" }}
                  >
                    <div>
                      <a>
                        <FaRegHeart className="fs-6 me-2" /> Add to Wishlist
                      </a>
                    </div>
                    <div>
                      <a>
                        {" "}
                        <IoIosGitCompare className="fs-6 me-2" /> Add to
                        Comapare
                      </a>
                    </div>
                  </div>
                  <div>
                    <div
                      className=" d-flex align-items-center justify-content-between mt-4"
                      style={{
                        borderBottom: showShip ? "" : "1px solid #eeeeee",
                        paddingBottom: 10,
                      }}
                    >
                      <div className="d-flex align-items-center gap-15">
                        <MdOutlineLocalShipping />
                        <p className="mb-0">Shipping & Returns</p>
                      </div>
                      <a onClick={handleToggleshipping}>
                        <MdKeyboardArrowDown />{" "}
                      </a>
                    </div>
                    <div
                      className={`shipping-info ${
                        showShip ? "open" : "closed"
                      }`}
                      style={{
                        borderBottom: showShip ? "1px solid #eeeeee" : "",
                        marginLeft: "30px",
                      }}
                    >
                      <p className="mb-0">
                        Free shipping and returns available on all orders
                      </p>
                      <p>
                        We ship all US domestic orders within{" "}
                        <strong>5-10 Business days!</strong>
                      </p>
                    </div>
                  </div>
                  <div>
                    <div
                      className=" d-flex align-items-center justify-content-between  mt-4"
                      style={{
                        borderBottom: showmaterial ? "" : "1px solid #eeeeee",
                        paddingBottom: 10,
                      }}
                    >
                      <div className="d-flex align-items-center gap-15">
                        <DiMaterializecss />
                        <p className="mb-0">Materials</p>
                      </div>
                      <a onClick={handleTogglematerial}>
                        <MdKeyboardArrowDown />{" "}
                      </a>
                    </div>
                    <div
                      className={`shipping-info ${
                        showmaterial ? "open" : "closed"
                      }`}
                      style={{
                        borderBottom: showmaterial ? "1px solid #eeeeee" : "",
                        marginLeft: "30px",
                      }}
                    >
                      <p className="mb-0">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsa eveniet iure reiciendis deserunt qui nam quibusdam
                        excepturi minima, ipsum neque eius nesciunt? Fugit
                        accusantium !
                      </p>
                    </div>
                  </div>
                  <div>
                    <div
                      className=" d-flex align-items-center justify-content-between  mt-4"
                      style={{
                        borderBottom: "1px solid #eeeeee",
                        paddingBottom: 10,
                      }}
                    >
                      <div className="d-flex align-items-center gap-15">
                        <GiResize />
                        <p className="mb-0">Dimensions</p>
                      </div>
                      <a onClick={handleToggleresize}>
                        {" "}
                        <MdKeyboardArrowDown />
                      </a>
                    </div>
                    <div
                      className={`shipping-info ${
                        showresize ? "open" : "closed"
                      }`}
                      style={{
                        borderBottom: showresize ? "1px solid #eeeeee" : "",
                        marginLeft: "30px",
                      }}
                    >
                      <div className="w-100 p-2 tableborder">
                        <table class="table table-bordered">
                          <thead className="border">
                            <tr>
                              <th>Size</th>
                              <th>chest</th>
                              <th>Neck</th>
                              <th>Sleev</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Small</td>
                              <td>30-35"</td>
                              <td>14-14.6"</td>
                              <td>32.5"</td>
                            </tr>
                            <tr>
                              <td>Medium</td>
                              <td>35-40"</td>
                              <td>15-15.6"</td>
                              <td>35.7"</td>
                            </tr>
                            <tr>
                              <td>Large</td>
                              <td>40-45"</td>
                              <td>16-16.6"</td>
                              <td>38.9"</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      className=" d-flex align-items-center justify-content-between  mt-4"
                      style={{
                        borderBottom: "1px solid #eeeeee",
                        paddingBottom: 10,
                      }}
                    >
                      <div className="d-flex align-items-center gap-15">
                        <FaRegHeart />
                        <p className="mb-0">Care Instructions</p>
                      </div>
                      <a onClick={handleTogglecare}>
                        <MdKeyboardArrowDown />{" "}
                      </a>
                    </div>
                    <div
                      className={`shipping-info ${
                        showcare ? "open" : "closed"
                      }`}
                      style={{
                        borderBottom: showcare ? "1px solid #eeeeee" : "",
                        marginLeft: "30px",
                      }}
                    >
                      <p className="mb-0">
                        Use a soft damp cloth and a drop of mild soap to remove
                        any haze. Air dry!
                      </p>
                    </div>
                  </div>

                  <div className=" d-flex align-items-center justify-content-between  mt-4 ">
                    <div className="d-flex align-items-center gap-15">
                      <IoIosLink />
                      <p className="mb-0">Share</p>
                    </div>
                    <div className="cpulinkdiv">
                      <a
                        href="javascript:void(0);"
                        onClick={(e) => {
                          e.preventDefault();
                          copyToClipboard(
                            "https://ik.imagekit.io/p66ljstle/images/watch.jpg?updatedAt=1710580566989"
                          );
                        }}
                        className="d-flex gap-15"
                      >
                        Copy Product Link
                      </a>
                    </div>
                  </div>
                 
                </div>
                <div className="payment-div p-4" style={{backgroundColor:'#eeeeee'}}>
                    <h4 className="text-center">Payment Methods</h4>
                    <div className="d-flex gap-15 align-items-center justify-content-center pt-2">
                    <FaCcVisa  style={{ color: '#2196f3' }} />
                    <FaCcMastercard style={{ color: '#fb8c00' }} />
                    <SiAmericanexpress style={{ color: '#2196f3' }} />
                    <FaCcPaypal style={{ color: '#2196f3' }} />
                    <FaCcDiscover style={{ color: '#2196f3' }} />
                    <FaCreditCard style={{ color: '#fb8c00' }} />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="descritption-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h4>Description</h4>
              <div className="bg-white p-3" style={{ borderRadius: 10 }}>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempora, dolorum.Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Tempora, dolorum.Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Tempora, dolorum.Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Tempora,
                  dolorum.Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Tempora, dolorum.Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Tempora, dolorum.Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Tempora, dolorum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="reviews-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h4>Reviews</h4>
              <div
                className="review-inner-wrapper"
                style={{ borderRadius: 10 }}
              >
                <div className="review-head d-flex justify-content-between align-items-end">
                  <div>
                    <h4 className="mb-3">Customer Reviews</h4>
                    <div className="d-flex gap-10 align-items-center">
                      <ReactStars
                        count={5}
                        size={18}
                        value={3}
                        edit={false}
                        activeColor={"#ffd700"}
                      />
                      <p className="mb-0">Based on 2 Reviews</p>
                    </div>
                  </div>
                  {orderProduct && (
                    <div className="d-flex justify-content-end">
                      <a
                        onClick={handleToggleReviewForm}
                        className="text-dark text-decoration-underline"
                        href=""
                      >
                        Write a Review
                      </a>
                    </div>
                  )}
                </div>
                <div
                  //id="review"
                  className={`review-form py-4 ${
                    showReviewform ? "open" : "closed"
                  }`}
                >
                  <h4>Write a Review</h4>
                  <form action="" className="d-flex flex-column gap-15" onSubmit={(e)=>handleSubmitReview(e)}>
                    <div>
                      {" "}
                      <label className="form-label">Name</label>
                      <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={reviewForm.name}
          name="name"
          onChange={handleReviewChange}
        />
                    </div>

                    <div>
                      {" "}
                      <label className="form-label">Email</label>
                      <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={reviewForm.email}
          name="email"
          onChange={handleReviewChange}
        />
                    </div>
                    <div>
                      <p className="mb-0 ratingp">Rating</p>
                      <ReactStars
          count={5}
          size={15}
          value={reviewForm.star}
          edit={true}
          onChange={handleStarChange}
          activeColor={"#ffd700"}
        />
                    </div>
                    <div>
                      <label className="form-label">Review Title</label>
                      <input
          type="text"
          className="form-control"
          placeholder="Give Your Review Title"
          value={reviewForm.revTitle}
          name="revTitle"
          onChange={handleReviewChange}
        />
                    </div>
                    <div>
                      <label className="form-label">Body of Review(1500)</label>
                      <textarea
                      className="w-100 form-control"
                        placeholder="Write Your Comments Here"
                        id=""
                        cols={30}
                        rows={4}
                        value={reviewForm.comment}
                        name="comment"
                        onChange={handleReviewChange}
                      />{" "}
                    </div>
                    <div className="d-flex justify-content-end">
                      <button className="button border-0 myButton px-3 py-2" type="submit">
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
                <div className="reviews mt-4">
                  <div className="review">
                    <div>
                      <ReactStars
                        count={5}
                        size={14}
                        value={5}
                        edit={false}
                        activeColor={"#ffd700"}
                      />
                      <p className="mb-0">Good Product</p>
                      <div className="d-flex align-items-center">
                        <h6 style={{ display: "flex" }} className="gap-10 mb-0">
                          Shourya <p className="mb-2"> on </p>Aug 29, 2022
                        </h6>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur, vitae.
                      </p>
                    </div>
                    <div className="d-flex align-items-end justify-content-end mya">
                      <a
                        className="text-dark text-decoration-underline "
                        href=""
                      >
                        Report as Inappropriate
                      </a>
                    </div>
                  </div>
                  <div className="review mt-4">
                    <div>
                      <ReactStars
                        count={5}
                        size={14}
                        value={5}
                        edit={false}
                        activeColor={"#ffd700"}
                      />

                      <h6 className="mb-1">Nice Quality, I'll Buy It Again</h6>
                      <div className="d-flex align-items-center">
                        <h6 style={{ display: "flex" }} className="gap-10 mb-0">
                          admin <p className="mb-2"> on </p>Aug 29, 2022
                        </h6>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur, vitae.
                      </p>

                      <div className="admin-reply ">
                        <h6>- Admin Reply</h6>
                        <p>
                          Thanks for Comment Lorem ipsum dolor sit amet
                          consectetur adipisicing elit. Consequuntur, vitae.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-end mya">
                      <a
                        className="text-dark text-decoration-underline mya"
                        href=""
                      >
                        Report as Inappropriate
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="popular-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">You May Also Like </h3>
            </div>
          </div>
          <div className="row">
            <ProductCard />
          </div>
        </div>
      </section>
    </>
  );
};

export default Singlrroduct;
