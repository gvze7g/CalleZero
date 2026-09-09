/**
 * Datos de ejemplo (mock) SOLO para maquetar las pantallas de tienda.
 * Aqui NO hay llamadas a la API: el equipo conectara /api/product, /api/categories, etc.
 * mas adelante reemplazando estos arreglos por la respuesta real del backend.
 */

// Imagenes locales (en assets/shop). Se usan como marcador visual.
const IMG = {
  cyberPurpleHoodie: require("../../assets/shop/Cyber-Purple-Hoodie.png"),
  oversizedBlackTee: require("../../assets/shop/Oversized-Black-Tee.png"),
  cargoPantNeo: require("../../assets/shop/Cargo-Pant-Neo.png"),
  beanieZero: require("../../assets/shop/Beanie-Zero.png"),
  minimalWhiteTee: require("../../assets/shop/Minimal-White-Tee.png"),
  streetHoodieBlack: require("../../assets/shop/Street-Hoodie-Black.png"),
  techJoggers: require("../../assets/shop/Tech-Joggers.png"),
  capZeroLogo: require("../../assets/shop/Cap-Zero-Logo.png"),
  essentialHoodieGray: require("../../assets/shop/Essential-Hoodie-Gray.png"),
  blackCargoShorts: require("../../assets/shop/Black-Cargo-Shorts.png"),
  urbanBasicTee: require("../../assets/shop/Urban-Basic-Tee.png"),
  streetBeanieDark: require("../../assets/shop/Street-Beanie-Dark.png"),
  photo1: require("../../assets/shop/photo-1.jpg"),
  photo2: require("../../assets/shop/photo-2.jpg"),
  photo3: require("../../assets/shop/photo-3.jpg"),
  photo4: require("../../assets/shop/photo-4.jpg"),
  catAccesorios: require("../../assets/shop/Accesorios.png"),
  catCamisetas: require("../../assets/shop/Camisetas.png"),
  catPantalones: require("../../assets/shop/Pantalones.png"),
  catHoodie: require("../../assets/shop/Hoodie.png"),
};

// Banner principal de la pantalla Inicio
export const heroBanner = {
  tag: "NUEVO",
  title: "ARCHIVO DE\nVERANO 26'",
  subtitle: "DISPONIBLE SOLO POR 48 HORAS",
  cta: "Explorar",
  image: IMG.photo3,
};

// HOT DROPS (carrusel horizontal en Inicio)
export const hotDrops = [
  {
    id: "hd1",
    brand: "CALLE ZERO ORIGINALS",
    name: "Oversized 'ZERO' Hoodie",
    price: "$85.00",
    image: IMG.cyberPurpleHoodie,
  },
  {
    id: "hd2",
    brand: "VOID VECTOR",
    name: "Nightclock Cargo Pant",
    price: "$120.00",
    image: IMG.cargoPantNeo,
  },
  {
    id: "hd3",
    brand: "CALLE ZERO ORIGINALS",
    name: "Street Hoodie Black",
    price: "$90.00",
    image: IMG.streetHoodieBlack,
  },
];

// Chips de categoria en Inicio
export const homeCategories = [
  { id: "hoodies", label: "Hoodies" },
  { id: "tees", label: "Tees" },
  { id: "cargo", label: "Cargo" },
  { id: "camisas", label: "Camisas" },
];

// RECOMENDADO / catalogo (grid de 2 columnas)
export const products = [
  {
    id: "p1",
    brand: "CALLE ZERO",
    name: "Acid Wash Graphic Tee",
    price: "$45",
    oldPrice: "$60",
    tag: "OFERTA",
    image: IMG.oversizedBlackTee,
  },
  {
    id: "p2",
    brand: "URBAN ADDICT",
    name: "Cyberwhite Beanie",
    price: "$28",
    tag: "NUEVO",
    image: IMG.streetBeanieDark,
  },
  {
    id: "p3",
    brand: "CALLE ZERO",
    name: "Void Graphic Hoodie",
    price: "$120",
    tag: "HOT",
    image: IMG.essentialHoodieGray,
  },
  {
    id: "p4",
    brand: "URBAN ADDICT",
    name: "Canvas Cargo V2",
    price: "$85",
    oldPrice: "$95",
    tag: "OFERTA",
    image: IMG.techJoggers,
  },
  {
    id: "p5",
    brand: "CALLE ZERO",
    name: "Neon Matrix Oversized",
    price: "$85",
    oldPrice: "$95",
    tag: "NUEVO",
    image: IMG.photo1,
  },
  {
    id: "p6",
    brand: "CALLE ZERO",
    name: "Graphic Cargo Tech",
    price: "$120",
    tag: "HOT",
    image: IMG.photo2,
  },
  {
    id: "p7",
    brand: "CALLE ZERO",
    name: "Zero Gravity Hoodie",
    price: "$95",
    oldPrice: "$110",
    tag: "-30%",
    image: IMG.cyberPurpleHoodie,
  },
  {
    id: "p8",
    brand: "CALLE ZERO",
    name: "Midnight Script Graphic",
    price: "$55",
    tag: "NUEVO",
    image: IMG.minimalWhiteTee,
  },
  {
    id: "p9",
    brand: "CALLE ZERO",
    name: "Acid Wash Distressed",
    price: "$170",
    oldPrice: "$190",
    tag: "OFERTA",
    image: IMG.photo4,
  },
  {
    id: "p10",
    brand: "URBAN ADDICT",
    name: "Cobalt Utility Vest",
    price: "$75",
    tag: "HOT",
    image: IMG.blackCargoShorts,
  },
  {
    id: "p11",
    brand: "CALLE ZERO",
    name: "Essential Hoodie Gray",
    price: "$80",
    image: IMG.essentialHoodieGray,
  },
  {
    id: "p12",
    brand: "CALLE ZERO",
    name: "Urban Basic Tee",
    price: "$38",
    image: IMG.urbanBasicTee,
  },
];

// Pantalla Busqueda
export const recentSearches = ["Vintage Hoodies", "Dark Low", "Cargo Tech", "Beanie"];

export const trending = [
  { id: "t1", label: "STREETWEAR ESENCIAL", tag: "TOP", image: IMG.catHoodie },
  { id: "t2", label: "SNEAKERS", tag: "NUEVO", image: IMG.photo2 },
  { id: "t3", label: "PIEZAS GRÁFICAS", tag: "TOP", image: IMG.catCamisetas },
  { id: "t4", label: "ACCESORIOS", tag: "NUEVO", image: IMG.catAccesorios },
];

export const staffPicks = [
  {
    id: "sp1",
    brand: "CALLE ZERO",
    name: "Void Graphic Hoodie",
    price: "$120.00",
    image: IMG.essentialHoodieGray,
  },
  {
    id: "sp2",
    brand: "URBAN ADDICT",
    name: "Canvas Cargo V2",
    price: "$85.00",
    oldPrice: "$95.00",
    image: IMG.techJoggers,
  },
  {
    id: "sp3",
    brand: "CALLE ZERO",
    name: "Minimal White Tee",
    price: "$40.00",
    image: IMG.minimalWhiteTee,
  },
];

// Pantalla Catalogo: filtros visuales
export const sortOptions = ["Popular", "Novedades", "Precio: menor", "Precio: mayor"];
export const activeFilters = ["Black"];

// ---------------------------------------------------------------------------
// Pantalla Detalle de producto (solo visual)
// ---------------------------------------------------------------------------
export const productDetail = {
  id: "p-detail",
  brand: "CALLE ZERO ORIGINALS",
  name: "NEO-TECH UTILITY OVER-HOODIE",
  tag: "NUEVO LANZAMIENTO",
  rating: 4.9,
  reviews: 128,
  price: "$145.00",
  oldPrice: "$180.00",
  discount: "20% DESCUENTO",
  gallery: [IMG.photo3, IMG.cyberPurpleHoodie, IMG.essentialHoodieGray],
  colors: [
    { id: "purple", value: "#8B5CF6" },
    { id: "black", value: "#111114" },
    { id: "gray", value: "#9CA3AF" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  defaultSize: "M",
  description:
    "El Neo-Tech Hoodie es una mezcla de algodon de alto gramaje disenado para maxima comodidad y durabilidad. Presenta un ajuste holgado, costuras reforzadas y detalles magneticos. Acabado con un logo reflectante de Calle Zero por maxima visibilidad en condiciones de poca luz.",
  features: [
    { icon: "shield-checkmark-outline", label: "AUTENTICIDAD GARANTIZADA" },
    { icon: "cube-outline", label: "ENVIO GRATIS" },
    { icon: "refresh-outline", label: "DEVOLUCIONES FACILES" },
  ],
};

// ---------------------------------------------------------------------------
// Pantalla Carrito (solo visual)
// ---------------------------------------------------------------------------
export const cartItems = [
  {
    id: "c1",
    brand: "CALLE ZERO",
    name: "Oversized 'Neon Shadow' Hoodie",
    size: "L",
    qty: 1,
    price: 89.0,
    image: IMG.cyberPurpleHoodie,
  },
  {
    id: "c2",
    brand: "URBAN ADDICT",
    name: "Distressed Cargo Joggers",
    size: "M",
    qty: 1,
    price: 125.0,
    image: IMG.techJoggers,
  },
  {
    id: "c3",
    brand: "CALLE ZERO",
    name: "Chaleco Utilitario",
    size: "M",
    qty: 1,
    price: 75.0,
    image: IMG.blackCargoShorts,
  },
];

export const cartSummary = {
  subtotal: 289.0,
  shipping: 12.0,
  discountLabel: "Descuento (10%)",
  discount: -34.0,
  total: 272.1,
};

// ---------------------------------------------------------------------------
// Pantalla Finalizar compra (solo visual)
// ---------------------------------------------------------------------------
export const checkoutDefaults = {
  fullName: "Hype Beast",
  address: "123 Urbano, Distrito 0",
  city: "San Salvador",
  zip: "0000",
  phone: "+503 0000-0000",
};

export const paymentMethods = [
  { id: "apple", label: "Apple Pay", icon: "logo-apple" },
  { id: "card", label: "Tarjeta", icon: "card-outline" },
  { id: "cash", label: "Efectivo", icon: "cash-outline" },
];

export const checkoutSummary = {
  itemsCount: 5,
  subtotal: 299.0,
  shipping: 0,
  tax: 34.0,
  total: 333.0,
};

// ---------------------------------------------------------------------------
// Pantalla Historial de pedidos (solo visual)
// ---------------------------------------------------------------------------
export const ordersInProgress = [
  {
    id: "CZ-98150",
    date: "En camino",
    total: "$210.00",
    status: "Envio demorado",
    statusType: "warn",
    items: 2,
    thumbs: [IMG.cyberPurpleHoodie, IMG.techJoggers],
  },
];

export const ordersPast = [
  {
    id: "CZ-98231",
    date: "Oct 24, 2023",
    total: "$240.00",
    status: "ENTREGADO",
    statusType: "ok",
    items: 3,
    thumbs: [IMG.essentialHoodieGray, IMG.minimalWhiteTee, IMG.beanieZero],
  },
  {
    id: "CZ-97654",
    date: "Sep 10, 2023",
    total: "$190.00",
    status: "ENTREGADO",
    statusType: "ok",
    items: 1,
    thumbs: [IMG.streetHoodieBlack],
  },
  {
    id: "CZ-95682",
    date: "Aug 28, 2023",
    total: "$85.00",
    status: "CANCELADO",
    statusType: "danger",
    items: 1,
    thumbs: [IMG.capZeroLogo],
  },
];

// Estadisticas mostradas en Perfil (mock: el backend no expone estos numeros)
export const profileStats = [
  { id: "orders", value: "12", label: "Pedidos" },
  { id: "reviews", value: "08", label: "Reseñas" },
  { id: "points", value: "450", label: "Puntos" },
];
