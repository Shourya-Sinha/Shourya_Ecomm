import React from "react";
import ReactStars from "react-rating-stars-component";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addtocartProduct } from "../Feature/Product/ProductSlice";
import NotificationComponent from "./NotificationComponent";

const SpecialProducts = ({products}) => {
  const dispatch = useDispatch();

  const handleAddToCart=(id, quantity, color)=>{
    try{
       dispatch(addtocartProduct(id, quantity, color))
    }catch{
      console.log('erorr in page adfd to cart button');
    }
  }
  return (
    <>
    <NotificationComponent />
    {Array.isArray(products) && products.slice(0,2).map((product) => (
      <div className="col-6 mb-2" key={product._id}>
        
        <div className="special-product-card">
        <Link to={`/product/${product._id}`} style={{textDecoration:'none',color:'#1C1C1B !important'}}>
          <div className="d-flex justify-content-between mb-0">
          
            <div>
              <img
                className=""
                //src="https://ik.imagekit.io/p66ljstle/images/watch.jpg?updatedAt=1710580566989"
                src={product.images[0]?.url}
                alt="Watch"
                style={{width:'240px',height:'240px',objectFit:'contain'}}
              />
            </div>
            <div className="special-product-content mb-0">
              <h5 className="brand" style={{color:'#3b4149'}}>{product.brand.title}</h5>
              <h6 className="product-title mb-0" style={{color:'#777777'}}>
                Samsung Galaxy Note10+ Mobile Phone: Sim...
              </h6>
              <ReactStars
                count={5}
                size={25}
                value={3}
                edit={false}
                activeColor={"#ffd700"}
              />
              <p className="price">
                <span className="red-p mb-0" style={{color:'#3b4149'}}>${product.price}</span> &nbsp;
                <strike>$200</strike>
              </p>
              <div className="discount-till d-flex align-items-center gap-10">
                <p className="mb-0 mt-0">
                  <b>5 Days</b>
                </p>
                <div className="d-flex gap-10  align-items-center">
                  <span className="badge rounded-circle p-3 bg-warning">01</span>
                  :
                  <span className="badge rounded-circle p-3 bg-warning">19</span>
                  :
                  <span className="badge rounded-circle p-3 bg-warning">49</span>
                </div>
              </div>
              <div className="prod-count my-1">
                <p style={{color:'#3b4149'}} className="mb-1">Products :{product.quantity}</p>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "25%" }}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              {/* <Link className="button">
                Add to Cart
              </Link> */}
             
            </div>
          </div>
          </Link>
          <div className="d-flex justify-content-end"> 
          <button className="button border-0" onClick={() => handleAddToCart(product._id, 1, product.color.title)}>Add to Cart</button>
          </div>
          
        </div>
       
      </div>
       ))}
    </>
  );
};

export default SpecialProducts;
