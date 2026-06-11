import productModel from "../models/product.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import fs from "fs";

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
    console.log("📍 POST /product recibido");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const {
      name,
      price,
      description,
      categoryId,
      stock,
      size,
      isActive,
    } = req.body;

    if (!name || !price || !categoryId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    let imageUrl = [];

    if (req.file) {
      try {
        console.log("📤 Subiendo a Cloudinary:", req.file.path);
        
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = [result.secure_url];
        
        console.log("✅ Imagen subida:", result.secure_url);
        
        // Eliminar archivo local
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.log("❌ Error en Cloudinary:", uploadError);
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: "Error subiendo imagen" });
      }
    }

    const parsedSize = typeof size === "string" ? JSON.parse(size) : size;

    const newProduct = new productModel({
      name,
      price: Number(price),
      description,
      categoryId,
      stock: Number(stock) || 0,
      size: parsedSize,
      isActive: isActive === "true" || isActive === true,
      imageUrl,
    });

    await newProduct.save();

    console.log("✅ Producto creado:", newProduct._id);

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log("💥 Error en InsertProducts:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({ message: "Internal server error", error: error.message });
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
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.imageUrl;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = [result.secure_url];
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: "Error subiendo imagen" });
      }
    }

    const parsedSize = typeof size === "string" ? JSON.parse(size) : size;

    const updated = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        description,
        categoryId,
        stock: Number(stock) || 0,
        size: parsedSize,
        isActive: isActive === "true" || isActive === true,
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
    if (req.file) fs.unlinkSync(req.file.path);
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