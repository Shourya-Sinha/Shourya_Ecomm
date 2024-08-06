import mongoose from "mongoose";

// var orderSchema = new mongoose.Schema(
//     {
//       products: [
//         {
//           product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Product",
//           },
//           count: Number,
//           color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
//         },
//       ],
//       paymentIntent: {
//         id: String,
//         method: String,
//         amount: Number,
//         status: String,
//         created: Number,
//         currency: String,
//         orderStatus: String,
//       },
//       orderStatus: {
//         type: String,
//         enum: [
//             "Order Successfully",
//           "Processing",
//           "Shipped",
//           "Delivered",
//           "Cancelled",
//           "Not Processed",
//         ],
//         default: "Order Successfully",
//       },
//       orderBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "UserModel",
//       },
//       address: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Address",
//       },
//       totalAfterDiscount: {
//         type: Number,
//         default: 0,
//       },
//       discountAmount: {
//         type: Number,
//         default: 0,
//       },
//       cartTotalNotDiscount: {
//         type: Number,
//         default: 0,
//       },
//       shippingFee: {
//         type: Number,
//         default: 0,
//       },
//       totalPaymentPaidByUser: {
//         type: Number,
//         default: 0,
//       }
//     },
//     { timestamps: true }
//   );
var orderSchema = new mongoose.Schema(
    {
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          count: Number,
          color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
        },
      ],
      paymentIntent: {
        id: String, // Ensure id is defined
        method: String,
        amount: Number,
        status: String,
        created: Number,
        currency: String,
        orderStatus: String,
      },
      orderStatus: {
        type: String,
        enum: [
          "Cash on Delivery",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Not Processed",
        ],
        default: "Cash on Delivery",
      },
      orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      totalAfterDiscount: {
        type: Number,
        default: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      cartTotalNotDiscount: {
        type: Number,
        default: 0,
      },
      shippingFee: {
        type: Number,
        default: 0,
      },
      totalPaymentPaidByUser: {
        type: Number,
        default: 0,
      },
      COD: String // Assuming COD is a string. Adjust if needed.
    },
    { timestamps: true }
  );
  const Order = mongoose.model("Order", orderSchema);
  export default Order;
  