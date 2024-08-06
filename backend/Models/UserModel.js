import mongoose from "mongoose"; // Erase if already required
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      validate: {
        validator: function (email) {
          return String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        },
        message: (props) => `Email (${props.value}) is Invalid!!`,
      },
    },
    phoneNo: {
      type: String,
      required: [true, "Mobile Number is Required"],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Minimum 6 character password required"],
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
      type: String,
    },
    tokenVersion: { type: Number, default: 1 },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    images: [{
      url: { type: String },
      public_id: { type: String },
    }],
  },
  {
    timestamps: true,
  }
);

// pre function running

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// compare assword
userSchema.methods.ispasswordMatched = async function (enteredassword) {
  return await bcrypt.compare(enteredassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log("token in model generate before hash", resetToken);

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log("token in model generate after hash", this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

//Export the model
const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;
