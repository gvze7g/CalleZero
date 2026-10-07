// Carga productos de ejemplo con imagenes (sube las fotos a Cloudinary).
// Uso: npm run seed   (no duplica productos que ya existen por nombre)
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { config } from "../src/config.js";
import cloudinary from "../src/Utils/cloudinary.js";
import categoriesModel from "../src/models/categories.js";
import productModel from "../src/models/product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dirname, "../../calleZero/src/assets");

const TOPS = ["XS", "S", "M", "L", "XL", "XXL"];
const BOTTOMS = ["28", "30", "32", "34", "36"];
const ONE = ["Única"];

const CATEGORIES = {
  Chaquetas: "Chaquetas y prendas de abrigo con estilo urbano.",
};

const PRODUCTS = [
  { name: "Cyber Purple Hoodie", category: "Hoodies", price: 65, stock: 40, size: TOPS, image: "Cyber-Purple-Hoodie.png", sku: "HD-CYB-01", description: "Hoodie oversize morado de algodón pesado con capucha forrada y puños acanalados. Ideal para looks nocturnos." },
  { name: "Street Hoodie Black", category: "Hoodies", price: 60, stock: 35, size: TOPS, image: "Street-Hoodie-Black.png", sku: "HD-STR-02", description: "Hoodie negro esencial con logo bordado de Calle Zero. Corte relajado y bolsillo canguro." },
  { name: "Essential Hoodie Gray", category: "Hoodies", price: 55, stock: 28, size: TOPS, image: "Essential-Hoodie-Gray.png", sku: "HD-ESS-03", description: "Hoodie gris jaspeado, suave por dentro y perfecto para el día a día." },
  { name: "Oversized Black Tee", category: "Camisas", price: 28, stock: 60, size: TOPS, image: "Oversized-Black-Tee.png", sku: "TS-OVR-01", description: "Camiseta negra de corte oversize, hombro caído y algodón 100%." },
  { name: "Minimal White Tee", category: "Camisas", price: 24, stock: 55, size: TOPS, image: "Minimal-White-Tee.png", sku: "TS-MIN-02", description: "Camiseta blanca minimalista, tela fresca y costuras reforzadas." },
  { name: "Urban Basic Tee", category: "Camisas", price: 22, stock: 70, size: TOPS, image: "Urban-Basic-Tee.png", sku: "TS-URB-03", description: "Básica urbana que combina con todo. Ajuste regular y cuello redondo." },
  { name: "Camiseta Roja Bordada", category: "Camisas", price: 32, stock: 25, size: TOPS, image: "photo-1.jpg", sku: "TS-RED-04", description: "Camiseta roja con letras bordadas en dorado. Pieza gráfica de edición limitada." },
  { name: "Cargo Pant Neo", category: "Pantalones", price: 58, stock: 30, size: BOTTOMS, image: "Cargo-Pant-Neo.png", sku: "PT-CRG-01", description: "Pantalón cargo con bolsillos laterales, tela resistente y ajuste en tobillo." },
  { name: "Tech Joggers", category: "Pantalones", price: 50, stock: 32, size: BOTTOMS, image: "Tech-Joggers.png", sku: "PT-JOG-02", description: "Joggers técnicos con cintura elástica, cordón ajustable y tela ligera." },
  { name: "Black Cargo Shorts", category: "Jorts", price: 38, stock: 26, size: BOTTOMS, image: "Black-Cargo-Shorts.png", sku: "JR-CRG-01", description: "Shorts cargo negros de largo bajo la rodilla, perfectos para el verano." },
  { name: "Beanie Zero", category: "Accesorios", price: 18, stock: 50, size: ONE, image: "Beanie-Zero.png", sku: "AC-BNZ-01", description: "Gorro tejido con parche Zero. Cálido y con doblez ajustable." },
  { name: "Street Beanie Dark", category: "Accesorios", price: 18, stock: 45, size: ONE, image: "Street-Beanie-Dark.png", sku: "AC-BND-02", description: "Beanie oscuro de punto grueso para completar cualquier outfit." },
  { name: "Cap Zero Logo", category: "Accesorios", price: 25, stock: 40, size: ONE, image: "Cap-Zero-Logo.png", sku: "AC-CAP-03", description: "Gorra con logo Zero bordado al frente y cierre ajustable." },
  { name: "Chaqueta Biker Negra", category: "Chaquetas", price: 95, stock: 15, size: TOPS, image: "photo-2.jpg", sku: "CH-BIK-01", description: "Chaqueta estilo biker en cuero sintético con cierres metálicos y cuello solapa." },
];

const run = async () => {
  await mongoose.connect(config.db.URI);

  // Categorias que falten
  for (const [name, description] of Object.entries(CATEGORIES)) {
    const exists = await categoriesModel.findOne({ name });
    if (!exists) {
      await categoriesModel.create({ name, description, isActive: true });
      console.log("Categoría creada:", name);
    }
  }

  const categories = await categoriesModel.find();
  const byName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  for (const p of PRODUCTS) {
    if (await productModel.findOne({ name: p.name })) {
      console.log("Ya existe:", p.name);
      continue;
    }
    if (!byName[p.category]) {
      console.log("Falta la categoría", p.category, "para", p.name);
      continue;
    }

    const upload = await cloudinary.uploader.upload(path.join(ASSETS, p.image), {
      folder: "callezero/products",
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    });

    await productModel.create({
      name: p.name,
      price: p.price,
      description: p.description,
      categoryId: byName[p.category],
      stock: p.stock,
      size: p.size,
      imageUrl: [upload.secure_url],
      isActive: true,
      sku: p.sku,
    });
    console.log("Producto creado:", p.name);
  }

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Error en el seed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
