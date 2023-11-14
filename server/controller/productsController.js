import slugify from "slugify";
import Product from "../model/productsModel.js";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation all filed
    if (!name) {
      return res.status(500).send({ message: "Name is Required" });
    }
    if (!description) {
      return res.status(500).send({ message: "Description is Required" });
    }
    if (!price) {
      return res.status(500).send({ message: "Price is Required" });
    }
    if (!category) {
      return res.status(500).send({ message: "Category is Required" });
    }
    if (!quantity) {
      return res.status(500).send({ message: "Quantity is Required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(500)
        .send({ message: "Photo is Required and Photo size less than 1 MB" });
    }

    // new products in database
    const products = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path); //photo save in
      products.photo.contentType = photo.type;
    }

    // products save in database
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Product Controller",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation all filed
    if (!name) {
      return res.status(500).send({ message: "Name is Required" });
    }
    if (!description) {
      return res.status(500).send({ message: "Description is Required" });
    }
    if (!price) {
      return res.status(500).send({ message: "Price is Required" });
    }
    if (!category) {
      return res.status(500).send({ message: "Category is Required" });
    }
    if (!quantity) {
      return res.status(500).send({ message: "Quantity is Required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(500)
        .send({ message: "Photo is Required and Photo size less than 1 MB" });
    }

    //  product update  in database
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    //   photo check in database
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path); //photo save in
      product.photo.contentType = photo.type;
    }

    // products save in database
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update Product Controller",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Delete Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Delete Product Controller",
      error,
    });
  }
};

// single product controller
export const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");

    res.status(200).send({
      success: true,
      message: "Single  Products",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Single Product Controller",
      error,
    });
  }
};

// all product controller
export const getAllProductController = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      total_Products: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in All Products Controller",
      error,
    });
  }
};

// product photo in product
export const productPhotoController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
