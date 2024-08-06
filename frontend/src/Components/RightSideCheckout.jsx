import React from "react";

const RightSideCheckout = ({ cartItems = [], shippingCost=0, totalAfterDiscount,discountAmount   }) => {
  const totalCartPrice = cartItems.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  const finalTotal = totalAfterDiscount
    ? (parseFloat(totalAfterDiscount) + shippingCost).toFixed(2)
    : (totalCartPrice + shippingCost).toFixed(2);
  return (
    <>
    {
      cartItems.map((item)=> (
        <div className="border-bottom py-4">
        <div className="d-flex gap-10 mb-2 align-items-center justify-content-between w-100">
          <div className="w-75 d-flex gap-15">
            <div className="w-25 position-relative">
              <span
                style={{ top: "-8px", right: "-5px" }}
                className="badge bg-secondary text-white rounded-circle  position-absolute"
              >
                {item.count}
              </span>
              <img
                src={item.product.images[0].url} 
                  alt={item.product.title}
                className="img-fluid rounded"
              />
            </div>
            <div>
              <h5 className="product-title">
                {item.product.title}
              </h5>
              <p className="product-sku">S / #DHSJ4536</p>
            </div>
          </div>
          <div>
            <h5 className="total-price">$ {item.price}</h5>
          </div>
        </div>  
      </div>
      ))
    }

      <div className="border-bottom py-4">
        <div className="d-flex justify-content-between align-items-center">
          <p className="total">Subtotal</p>
          <p className="total-price">$ {totalCartPrice.toFixed(2)}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 total">Shipping</p>
          {/* <p className="mb-0 total-price">${shippingCost}</p> */}
          <p className="mb-0 total-price">${shippingCost.toFixed(2)}</p>
        </div>
      </div>
      {totalAfterDiscount && (
        <div className="border-bottom py-4">
          <div className="d-flex justify-content-between align-items-center">
            <p className="total">Discount</p>
            <p className="total-price">- ${discountAmount.toFixed(2)}</p>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center border-bottom py-4">
        <h4 className="total">Total</h4>
        <h5 className="total-price">${finalTotal}</h5>
      </div>
    </>
  );
};

export default RightSideCheckout;
