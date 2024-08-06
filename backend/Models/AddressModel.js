import mongoose from 'mongoose';

// Address Schema
const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  alternateNo: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nearby:{
    type: String,
    required: true,
  },
  apartment: {
    type: String,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Address = mongoose.model('Address',addressSchema)

export default Address;

