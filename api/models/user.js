import mongoose from "mongoose";
// import validator from "validator"; // Importing validator

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePictures: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.yYUwl3GDU07Q5J5ttyW9fQHaHa?w=198&h=198&c=7&r=0&o=5&pid=1.7",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
