import React from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import Color from "../Components/Color.jsx";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCompare } from "../Feature/Product/ProductSlice.jsx";

const CompareProduct = () => {
    const compareMultiProduct = useSelector((state) => state.product.compareMultiProduct);
   // console.log('compareMultiProduct', compareMultiProduct);
   const dispatch = useDispatch();
   const handleRemoveProduct = (productId,e) => {
    e.preventDefault();
    dispatch(removeFromCompare(productId));
  };
  return (
    <>
      <Meta title={"Product Compare"} />
      <BreadCrumb title="Product Compare" />

      <div className="compare-product-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
{
    compareMultiProduct.length > 0 ? compareMultiProduct.map((item) => (
        <div className="col-3" key={item._id}>
        <div className="compare-product-card position-relative">
          <img onClick={(e)=>handleRemoveProduct(item._id,e)}
            src="https://ik.imagekit.io/p66ljstle/images/cross.svg?updatedAt=1710580553527"
            className="position-absolute cross img-fluid"
            alt="Wartch Imges"
          />
          <div className="product-card-image">
            <img
            style={{height:'200px',width:'200px',objectFit:'contain'}}
            src={item.images[0]?.url}
              //src="https://ik.imagekit.io/p66ljstle/images/watch.jpg?updatedAt=1710580566989"
              alt="Wartch Imges"
            />
          </div>
          <div className="compare-product-details">
            <h5 className="title">
              {item.title}
            </h5>
            <h6 className="price mb-3 mt-3">${item.price}</h6>
            <div>
              <div className="product-detail">
                <h5>Brand:</h5>
                <p>{item.brand.title}</p>
              </div>
              <div className="product-detail">
                <h5>Type:</h5>
                <p>{item.category.title}</p>
              </div>
              <div className="product-detail">
                <h5>Availability:</h5>
                <p>In Stock</p>
              </div>
              <div className="product-detail">
                <h5>Color:</h5>
                <Color colors={item.color} />
              </div>
              <div className="product-detail">
                <h5>Size:</h5>
                <div className="d-flex gap-10">
                  <p>S</p>
                  <p>M</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )): (<p>no product</p>

)}


          </div>
        </div>
      </div>
    </>
  );
};

export default CompareProduct;
