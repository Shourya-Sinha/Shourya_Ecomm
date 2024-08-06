import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../Components/BlogCard.jsx";
import { Carousel } from "react-bootstrap";
import ProductCard from "../Components/ProductCard.jsx";
import SpecialProducts from "../Components/SpecialProducts.jsx";
import ContainerPage from "../Components/ContainerPage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs, getProducts } from "../Feature/Product/ProductSlice.jsx";

const Home = () => {
  const dispatch = useDispatch();
  const adminBlogs = useSelector((state)=> state.product.AllBlogs || []);

  const products = useSelector((state)=> state.product.products)
  const featuredProducts = products.filter(
    (p) => p.tags === 'Featured'
  );

  const hotProducts = products.filter(
    (p) => p.tags === 'Hot'
  );

  const trendingProducts = products.filter(
    (p) => p.tags === 'Trending'
  );

  useEffect(()=>{
    dispatch(getProducts());
  },[dispatch])


  //console.log('admin blogs in home page',adminBlogs);
  useEffect(()=>{
    dispatch(getAllBlogs());
  },[dispatch]);

  return (
    <>
    <ContainerPage class1='home-wrapper-1 py-5'>
    <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-2">
              <Carousel>
                <Carousel.Item>
                  <div className="main-banner position-relative">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/main-banner-1.jpg?updatedAt=1710580558976"
                      className="img-fluid rounded-3"
                      alt="main-banner"
                    />
                    <div className="main-banner-content position-absolute">
                      <h4>SUPERCHARED FOR PROS.</h4>
                      <h5>iPad S13+ Pro.</h5>
                      <p>
                        From $999.00 or $41.62/mo <br />
                        for 24 mo. Footnote*{" "}
                      </p>
                      <Link className="button">BUY NOW</Link>
                    </div>
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="main-banner position-relative">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/main-banner.jpg?updatedAt=1710580560435"
                      className="img-fluid rounded-3"
                      alt="main-banner"
                    />
                    <div className="main-banner-content position-absolute">
                      <h4>SUPERCHARED FOR PROS.</h4>
                      <h5>Special Sale.</h5>
                      <p>
                        From $789.00 or $34.62/mo <br />
                        for 24 mo. Footnote*{" "}
                      </p>
                      <Link className="button">BUY NOW</Link>
                    </div>
                  </div>
                </Carousel.Item>
              </Carousel>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-wrap gap-10 justify-content-between align-items-center">
                <div className="small-banner position-relative">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/catbanner-01.jpg?updatedAt=1710580553746"
                    className="img-fluid rounded-3"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>BEST SALE.</h4>
                    <h5>Laptops Max</h5>
                    <p>
                      From $999.00 <br /> $41.62/mo <br />
                    </p>
                  </div>
                </div>
                <div className="small-banner position-relative">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/catbanner-03.jpg?updatedAt=1710580553535"
                    className="img-fluid rounded-3"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>NEW ARRIVAL.</h4>
                    <h5>Buy IPad Air</h5>
                    <p>
                      From $599.00
                      <br /> $49.62/mo <br />
                    </p>
                  </div>
                </div>
                <div className="small-banner position-relative">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/catbanner-02.jpg?updatedAt=1710580553533"
                    className="img-fluid rounded-3"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>15% OFF.</h4>
                    <h5>Smartwatch 7</h5>
                    <p>
                      Shop the latest brand <br />
                      styles and colors.{" "}
                    </p>
                  </div>
                </div>
                <div className="small-banner position-relative">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/catbanner-04.jpg?updatedAt=1710580553423"
                    className="img-fluid rounded-3"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>FREE ENGRAVING.</h4>
                    <h5>AirPods Max</h5>
                    <p>
                      High-fidelity playback &<br />
                      ultra low distortion.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </ContainerPage>

      <section className="home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="services d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-15">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/service.png?updatedAt=1710580562738"
                    alt="services-icon"
                  />
                  <div>
                    <h6>Free Shipping</h6>
                    <p className="mb-0">From all orders over $100</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/service-02.png?updatedAt=1710580561370"
                    alt="services-icon"
                  />
                  <div>
                    <h6>Daily Surprise Offers</h6>
                    <p className="mb-0">save up to 25% off</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/service-03.png?updatedAt=1710580562735"
                    alt="services-icon"
                  />
                  <div>
                    <h6>Support 24/7</h6>
                    <p className="mb-0">Shop with an expert</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/service-04.png?updatedAt=1710580562654"
                    alt="services-icon"
                  />
                  <div>
                    <h6>Affordable Prices</h6>
                    <p className="mb-0">Get Factory firect price</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15">
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/service-05.png?updatedAt=1710580562720"
                    alt="services-icon"
                  />
                  <div>
                    <h6>Secure Payments</h6>
                    <p className="mb-0">100% Protected Payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="categories d-flex justify-content-between flex-wrap align-items-center">
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/camera.jpg?updatedAt=1710580553149"
                    alt="Camera"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Smart TV</h6>
                    <p>13 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/tv.jpg?updatedAt=1710580565290"
                    alt="Camera"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Smart Laptops</h6>
                    <p>15 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/laptop.jpg?updatedAt=1710580560123"
                    alt="Camera"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Music & Gaming</h6>
                    <p>10 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/headphone.jpg?updatedAt=1710580558512"
                    alt="Camera"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/camera.jpg?updatedAt=1710580553149"
                    alt="Camera"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Smart TV</h6>
                    <p>13 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/tv.jpg?updatedAt=1710580565290"
                    alt="Camera"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Smart Laptops</h6>
                    <p>15 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/laptop.jpg?updatedAt=1710580560123"
                    alt="Camera"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <h6>Music & Gaming</h6>
                    <p>10 Items</p>
                  </div>
                  <img
                    src="https://ik.imagekit.io/p66ljstle/images/headphone.jpg?updatedAt=1710580558512"
                    alt="Camera"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featureds-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Featured Collection </h3>
            </div>
            <ProductCard products={featuredProducts} />
          </div>
        </div>
      </section>

      <section className="famous-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="famous-card position-relative">
                <img className="img-fluid"
                  src="https://ik.imagekit.io/p66ljstle/WATCH3.jpg?updatedAt=1710772051239"
                  alt="Famous Card"
                />
                <div className="famous-content position-absolute">
                  <h5>Big Screen</h5>
                  <h6>Smart Watch Series 7</h6>
                  <p>From $399 or $16.62/mo. for 24 mo.*</p>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="famous-card position-relative">
                <img className="img-fluid"
                  src="https://ik.imagekit.io/p66ljstle/WATCH3.jpg?updatedAt=1710772051239"
                  alt="Famous Card"
                />
                <div className="famous-content position-absolute">
                  <h5>STUDIO DISPLAY</h5>
                  <h6>600 nits of brightness.</h6>
                  <p>27-inch 5K Retina display</p>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="famous-card position-relative">
                <img className="img-fluid"
                  src="https://ik.imagekit.io/p66ljstle/WATCH3.jpg?updatedAt=1710772051239"
                  alt="Famous Card"
                />
                <div className="famous-content position-absolute">
                  <h5>SMARTPHONES</h5>
                  <h6>Smartphone 13 Pro.</h6>
                  <p>Now in Green. From $999.00 or <br /> $41.62/mo.for 24 mo. Footnote*</p>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="famous-card position-relative">
                <img className="img-fluid"
                  src="https://ik.imagekit.io/p66ljstle/WATCH3.jpg?updatedAt=1710772051239"
                  alt="Famous Card"
                />
                <div className="famous-content position-absolute">
                  <h5>HOME SPEAKERS</h5>
                  <h6>Room-filling sound.</h6>
                  <p>From $699.00 or $116.58/mo.<br /> for 12 mo.*</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="special-wrapper py-4 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Special Products</h3>
            </div>
          </div>
          <div className="row">
            <SpecialProducts products={featuredProducts}  />
            {/* <SpecialProducts />
            <SpecialProducts />
            <SpecialProducts /> */}
          </div>
        </div>
      </section>

      <section className="popular-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Hot Products </h3>
            </div>
          </div>
          <div className="row">
            <ProductCard products={hotProducts} />
          </div>
        </div>
      </section>

      <section className="marque-wrapper py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="marquee-inner-wrapper card-wrapper">
                <Marquee className="d-flex">
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-07.png?updatedAt=1710580552505"
                      alt="brand-name"
                    />
                  </div>
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-03.png?updatedAt=1710580551490"
                      alt="brand-name"
                    />
                  </div>
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-04.png?updatedAt=1710580551473"
                      alt="brand-name"
                    />
                  </div>
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-02.png?updatedAt=1710580550975"
                      alt="brand-name"
                    />
                  </div>
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-08.png?updatedAt=1710580552954"
                      alt="brand-name"
                    />
                  </div>
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-05.png?updatedAt=1710580551397"
                      alt="brand-name"
                    />
                  </div>
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-01.png?updatedAt=1710580551053"
                      alt="brand-name"
                    />
                  </div>
                  <div className="mx-4 w-25">
                    <img
                      src="https://ik.imagekit.io/p66ljstle/images/brand-06.png?updatedAt=1710580550852"
                      alt="brand-name"
                    />
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Latest Blogs </h3>
            </div>
           
          </div>
          <div className="row">
            <div className="d-flex gap-15">
            <BlogCard myblogs={adminBlogs} />
            </div>
            {/* <div className="col-3">
            <BlogCard />
            </div>
            <div className="col-3">
            <BlogCard />
            </div>
            <div className="col-3">
            <BlogCard />
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
