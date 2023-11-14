import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getACategoryController,
  getAllCategoryController,
  updateCategoryController,
} from "../controller/categoryController.js";

const router = express.Router();

// create category post methods
router.post("/create-category", createCategoryController);

// get all  category get methods
router.get("/getAll-category", getAllCategoryController);

// single category get methods
router.get("/single-category/:id", getACategoryController);

// update category put methods
router.put("/update-category/:id", updateCategoryController);

// delete category delete methods
router.delete("/delete-category/:id", deleteCategoryController);

export default router;
