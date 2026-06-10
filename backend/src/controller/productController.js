import productModel from "../models/product.js";
import cloudinary from "../utils/cloudinaryConfig.js";

const productController = {};

/* =========================
   GET ALL PRODUCTS
========================= */
productController.getAll = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("categoryId", "name");

    return res.status(200).json(products);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET BY ID
========================= */
productController.getProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   CREATE PRODUCT
========================= */
productController.InsertProducts = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      categoryId,
      stock,
      size,
      isActive,
    } = req.body;

    let imageUrl = [];

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = [result.secure_url];
    }

    const newProduct = new productModel({
      name,
      price,
      description,
      categoryId,
      stock,
      size,
      isActive,
      imageUrl,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
productController.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      categoryId,
      stock,
      size,
      isActive,
    } = req.body;

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = [result.secure_url];
    }

    const updated = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        categoryId,
        stock,
        size,
        isActive,
        imageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   DELETE PRODUCT
========================= */
productController.deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productController;