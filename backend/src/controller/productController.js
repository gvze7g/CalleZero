import productModel from "../models/product.js";
import cloudinary from "../Utils/cloudinary.js";
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
   Helper: limpia archivos locales temporales
========================= */
const cleanupLocalFiles = (files = []) => {
  files.forEach((file) => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      console.log("No se pudo borrar archivo temporal:", file.path);
    }
  });
};

/* =========================
   Helper: sube varios archivos a Cloudinary
========================= */
const uploadFilesToCloudinary = async (files = []) => {
  const urls = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path);
    urls.push(result.secure_url);
  }

  return urls;
};

/* =========================
   CREATE PRODUCT
========================= */
productController.InsertProducts = async (req, res) => {
  try {
    console.log("📍 POST /product recibido");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const {
      name,
      price,
      description,
      categoryId,
      stock,
      size,
      isActive,
      sku,
    } = req.body;

    if (!name || !price || !categoryId) {
      cleanupLocalFiles(req.files);
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    let imageUrl = [];

    if (req.files && req.files.length > 0) {
      try {
        console.log(`📤 Subiendo ${req.files.length} imagen(es) a Cloudinary`);

        imageUrl = await uploadFilesToCloudinary(req.files);

        console.log("✅ Imágenes subidas:", imageUrl);
      } catch (uploadError) {
        console.log("❌ Error en Cloudinary:", uploadError);
        cleanupLocalFiles(req.files);
        return res.status(500).json({
          message: "Error subiendo imagen",
          error: uploadError.message,
        });
      } finally {
        cleanupLocalFiles(req.files);
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
      sku: sku || "",
    });

    await newProduct.save();

    console.log("✅ Producto creado:", newProduct._id);

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log("💥 Error en InsertProducts:", error);
    cleanupLocalFiles(req.files);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
      sku,
      existingImages, // urls que el frontend quiere conservar
    } = req.body;

    const product = await productModel.findById(req.params.id);

    if (!product) {
      cleanupLocalFiles(req.files);
      return res.status(404).json({ message: "Product not found" });
    }

    // Imágenes que se conservan (si no llega el campo, se conservan todas las actuales)
    let keptImages = product.imageUrl;
    if (existingImages !== undefined) {
      try {
        keptImages = JSON.parse(existingImages);
      } catch {
        keptImages = [];
      }
    }

    let newImageUrls = [];

    if (req.files && req.files.length > 0) {
      try {
        newImageUrls = await uploadFilesToCloudinary(req.files);
      } catch (uploadError) {
        cleanupLocalFiles(req.files);
        return res.status(500).json({
          message: "Error subiendo imagen",
          error: uploadError.message,
        });
      } finally {
        cleanupLocalFiles(req.files);
      }
    }

    const imageUrl = [...keptImages, ...newImageUrls].slice(0, 4);

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
        sku: sku || "",
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.log("Error: ", error);
    cleanupLocalFiles(req.files);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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