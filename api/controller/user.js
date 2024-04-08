import express from "express";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import { VerifyToken } from "../utils/verifyUSer.js";
import validator from "validator";
const router = express.Router();
// Sign up function
router.post("/sign-up", async (req, res, next) => {
  const { userName, email, password } = req.body;

  // Check if any field is missing or empty
  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }
  // Check if the email is valid
  if (!validator.isEmail(email)) {
    return next(errorHandler(400, "Invalid email"));
  }
  // Check if password length is less than 8 characters
  if (password.length < 8) {
    return next(
      errorHandler(400, "Password must be at least 8 characters long")
    );
  }

  // Check if email already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "Email already exists"));
    }
  } catch (error) {
    return next(error);
  }

  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user
  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
});

// login funcion
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    console.log("valid user", validUser);
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    // console.log(validPassword);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRECT,
      { expiresIn: "7d" } // Token ko 7 days tak valid rakhne ka option
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    console.log("error");
    next(error);
    console.log(error);
  }
});

router.post("/google-signIn", async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRECT,
        { expiresIn: "7d" } // Token ko 7 days tak valid rakhne ka option
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      console.log(generatedPassword);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        userName:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePictures: googlePhotoUrl,
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRECT,
        { expiresIn: "7d" } // Token ko 7 days tak valid rakhne ka option
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

// update user
router.put("/update/:id", VerifyToken, async (req, res, next) => {
  // console.log(req.body);
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }
    console.log(req.user.id);
    console.log(req.params.id);
    console.log("Received request user:", req.user);
    console.log("Received request body:", req.body);

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.userName) {
      // Check if userName is provided and not empty or empty string
      if (!req.body.userName || req.body.userName.trim() === "") {
        return next(errorHandler(400, "Username cannot be empty"));
      }
      if (req.body.userName.length < 7 || req.body.userName.length > 24) {
        return next(
          errorHandler(400, "Username must be between 7 and 24 characters")
        );
      }
      if (req.body.userName.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      if (req.body.userName !== req.body.userName.toLowerCase()) {
        return next(errorHandler(400, "Username must be in lowercase"));
      }
      if (!req.body.userName.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, "Username can only contain letters and numbers")
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          profilePictures: req.body.profilePictures,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
    // console.log("Updated user details:", rest);
  } catch (error) {
    next(error);
  }
});

// delete user
router.delete("/delete/:id", VerifyToken, async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// signout user

router.post("/user/sign-out", (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("user has been signed out");
  } catch (error) {
    next(error);
  }
});

// get all user

router.get("/get-all-user", VerifyToken, async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "you are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithourPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: userWithourPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
});

// get user publicaly

router.get("/get-single-user/:userId", async (req, res, next) => {
  // console.log("req.params.id",req.params.userId)
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
});

// Check if user is logged in
router.get("/user/check-logged-in", async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRECT);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error("Error checking logged in status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
