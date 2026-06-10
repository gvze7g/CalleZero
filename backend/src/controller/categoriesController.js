import categoriesModel from "../models/categories.js";
import productModel from "../models/product.js";

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
  const { name, description, isActive } = req.body;
  const newCategorie = new categoriesModel({ name, description, isActive });
  await newCategorie.save();
  res.json({ message: "Categorie save" });
};

//UPDATE
export const updateCategories = async (req, res) => {
  const { name, description, isActive } = req.body;
  await categoriesModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      isActive,
    },
    { new: true },
  );

  res.json({ message: "categorie updated" });
};

//DELETE
export const  deleteCategories = async (req, res) => {
  await categoriesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "categories deleted" });
};
