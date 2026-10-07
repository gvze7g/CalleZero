import categoriesModel from "../models/categories.js";
import productModel from "../models/product.js";
import { clean, isName, isSafeText } from "../Utils/validators.js";

// Devuelve el mensaje de error o null
const categoryError = (name, description) => {
  if (!isName(name, 3, 30)) return "El nombre solo puede tener letras y espacios (3 a 30 caracteres)";
  if (description && !isSafeText(description, 0, 300)) return "La descripción tiene caracteres no permitidos o es muy larga (máx. 300)";
  return null;
};

//SELECT
export const getCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.find();

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productsCount = await productModel.countDocuments({
          categoryId: category._id,
        });

        return {
          ...category.toObject(),
          productsCount,
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
export const insertCategories = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const invalid = categoryError(name, description);
    if (invalid) return res.status(400).json({ message: invalid });

    const exists = await categoriesModel.findOne({ name: { $regex: `^${clean(name)}$`, $options: "i" } });
    if (exists) return res.status(409).json({ message: "Ya existe una categoría con ese nombre" });

    const newCategorie = new categoriesModel({
      name: clean(name),
      description: clean(description),
      isActive: isActive !== false,
    });
    await newCategorie.save();
    res.json({ message: "Categorie save" });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
export const updateCategories = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const invalid = categoryError(name, description);
    if (invalid) return res.status(400).json({ message: invalid });

    await categoriesModel.findByIdAndUpdate(
      req.params.id,
      {
        name: clean(name),
        description: clean(description),
        isActive,
      },
      { new: true },
    );

    res.json({ message: "categorie updated" });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
export const deleteCategories = async (req, res) => {
  try {
    const inUse = await productModel.countDocuments({ categoryId: req.params.id });
    if (inUse > 0) {
      return res.status(400).json({ message: `No se puede eliminar: tiene ${inUse} producto(s)` });
    }
    await categoriesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "categories deleted" });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
