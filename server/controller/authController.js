import express from "express";
import JWT from "jsonwebtoken";
import User from "../model/userModel.js";
import { comparePassword, hashPassword } from "../helper/helperAuth.js";

// this is register controller router
export const registerController = async (req, res) => {
  try {
    const { name, email, password, answer, phone, address } = req.body;

    // validation
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }

    // existing user in database

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please Login",
      });
    }
    // hashedPassword
    const hashedPassword = await hashPassword(password);

    // create a new user in database

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      answer,
      phone,
      address,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      newUser,
    });
  } catch (error) {
    console.log("error is :", error);
    res.status(500).send({
      success: false,
      message: "Error is Register Controller",
      error,
    });
  }
};

// this is  login controller router
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // if this email is not on our database then

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email",
      });
    }

    // compare password and user.password in database

    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // if all okk then create jwt

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "User LogIn Successfully",
      user: {
        name: user.name,
        email: user.email,
        answer: user.answer,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("error is :", error);
    res.status(500).send({
      success: false,
      message: "Error is Login Controller",
      error,
    });
  }
};

// this is forgot password controller router
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    // user forgot password validation in database
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    // check user in database in email
    const user = await User.findOne({ email });

    // again validation in user email
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }

    // hashed password
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset Successfully",
    });
  } catch (error) {
    console.log("error is :", error);
    res.status(500).send({
      success: false,
      message: "Error is Forgot Password Controller",
      error,
    });
  }
};

export const testController = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "this is protected routes ",
    });
  } catch (error) {
    console.log("error is :", error);
    res.status(500).send({
      success: false,
      message: "Error is test Controller",
      error,
    });
  }
};
