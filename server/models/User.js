// User Model — MongoDB mein user ka schema
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // extra spaces hata deta hai
    },
    email: {
      type: String,
      required: true,
      unique: true, // duplicate email nahi hoga
      lowercase: true, // lowercase mein store hoga
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // minimum 6 characters
    },
    role: {
      type: String,
      enum: ["user", "admin"], // sirf user ya admin ho sakta hai
      default: "user",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt automatically add hoga
  }
);

const User = mongoose.model("User", userSchema);
export default User;