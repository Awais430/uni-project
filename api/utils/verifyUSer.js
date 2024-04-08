// import { Jwt } from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  // console.log(jwt.verify())
  // console.log(process.env.JWT_SECRET);
  const token = req.cookies.access_token;
  console.log("token", token);
  if (!token) {
    return next(errorHandler(401, "unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRECT, (err, user) => {
    // console.log("recieved token", token);
    if (err) {
      return next(errorHandler(401, "unauthorized"));
    }
    req.user = user;
    // console.log("token,", token);

    next();
  });
};
