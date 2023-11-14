import JWT from "jsonwebtoken";
import User from "../model/userModel.js";

// protected routes token base
export const requireSingIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      return res.this.status(401).send({
        success: false,
        message: "UnAuthorization User",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "UnAuthorization User",
      error,
    });
  }
};
