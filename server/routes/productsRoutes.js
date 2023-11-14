import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
} from "../controller/productsController.js";
import { isAdmin, requireSingIn } from "../middleware/authMiddleware.js";
const router = express.Router();

// **********// photo jono pakeage lagbe ja holo (npm i express-formidable)******
// create product
router.post(
  "/create-product",
  requireSingIn,
  isAdmin,
  formidable(),
  createProductController
);

// update product
router.put(
  "/update-product/:id",
  requireSingIn,
  isAdmin,
  formidable(),
  updateProductController
);

// delete product
router.delete("/delete-product/:id", deleteProductController);

// get single product
router.get("/single-product/:slug", getSingleProductController);

// get all  product
router.get("/getAll-product", getAllProductController);

// photo in  product
router.get("/product-photo/:pid", productPhotoController);

export default router;
