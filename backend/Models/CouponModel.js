import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true
    },
    expiryDate:{
        type: Date,
        required: true
    },
    discountPrice:{
        type: Number,
        required: true
    }
  },
  { timestamps: true }
);
const CouponStore = mongoose.model("CouponStore", CouponSchema);
export default CouponStore;
