import slugify from "slugify";
import Category from "../model/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    // validation
    if (!name) {
      return res.status(400).send({
        message: " Category Name is required",
      });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send({
        success: true,
        message: "Category Already Exisits",
      });
    }
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: true,
      message: "Error in create category controller",
      error,
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await Category.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: true,
      message: "Error in get All category controller",
      error,
    });
  }
};

export const getACategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: true,
      message: "Error in get A category controller",
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: true,
      message: "Error in update category controller",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: true,
      message: "Error in delete category controller",
      error,
    });
  }
};
