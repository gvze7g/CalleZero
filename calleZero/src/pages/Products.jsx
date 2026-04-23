import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import products from "../data/products";

const categoryLabels = {
    hoodies: "Hoodies",
    tshirts: "Camisetas",
    pants: "Pantalones",
    accessories: "Accesorios",
};

const Products = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const categoryParam = searchParams.get("category");
    const selectedCategories = categoryParam ? categoryParam.split(",") : [];

    const [showCategories, setShowCategories] = useState(true);
    const [showPrice, setShowPrice] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [price, setPrice] = useState(5);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const hasFilters =
        selectedCategories.length > 0 || price > 5;

    const toggleCategory = (cat) => {
        let updatedCategories;

        if (selectedCategories.includes(cat)) {
            updatedCategories = selectedCategories.filter((c) => c !== cat);
        } else {
            updatedCategories = [...selectedCategories, cat];
        }

        if (updatedCategories.length === 0) {
            navigate("/products");
        } else {
            navigate(`/products?category=${updatedCategories.join(",")}`);
        }
    };

    const clearFilters = () => {
        navigate("/products");
        setPrice(5);
        setShowCategories(true);
        setShowPrice(true);
    };

    const filteredProducts =
        selectedCategories.length > 0
            ? products.filter((p) =>
                selectedCategories.includes(p.category)
            )
            : products;

    const showMore = () => {
        setVisibleProducts((prev) => prev + 4);
    };

    const showLess = () => {
        setVisibleProducts(12);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="bg-black text-white font-opensans">

            <Navbar />

            {showMobileFilters && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowMobileFilters(false)}
                >
                    <div
                        className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-[#111] p-6 overflow-y-auto transform transition-transform duration-300 translate-x-0"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-montserrat font-bold">FILTROS</h3>
                            <button onClick={() => setShowMobileFilters(false)}>✕</button>
                        </div>

                        <div className="mb-6 text-sm text-gray-400 space-y-2">

                            <div
                                onClick={() => setShowCategories(!showCategories)}
                                className="cursor-pointer text-white font-montserrat"
                            >
                                Categorías ▾
                            </div>

                            {showCategories && (
                                <>
                                    <label className="block cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes("hoodies")}
                                            onChange={() => toggleCategory("hoodies")}
                                        /> Hoodies
                                    </label>

                                    <label className="block cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes("tshirts")}
                                            onChange={() => toggleCategory("tshirts")}
                                        /> Camisetas
                                    </label>

                                    <label className="block cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes("pants")}
                                            onChange={() => toggleCategory("pants")}
                                        /> Pantalones
                                    </label>

                                    <label className="block cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes("accessories")}
                                            onChange={() => toggleCategory("accessories")}
                                        /> Accesorios
                                    </label>
                                </>
                            )}

                        </div>

                        <div className="text-sm text-gray-400">

                            <div
                                onClick={() => setShowPrice(!showPrice)}
                                className="cursor-pointer text-white mb-2 font-montserrat"
                            >
                                Precio ▾
                            </div>

                            {showPrice && (
                                <>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full accent-purple-500"
                                    />

                                    <div className="flex justify-between text-xs mt-2 font-montserrat">
                                        <span className="text-purple-500">${price}</span>
                                        <span>$100</span>
                                    </div>
                                </>
                            )}

                        </div>

                        {hasFilters && (
                            <button
                                onClick={() => {
                                    clearFilters();
                                    setShowMobileFilters(false);
                                }}
                                className="mt-6 w-full border border-white/20 rounded-full py-2 text-sm font-montserrat"
                            >
                                Limpiar Filtros
                            </button>
                        )}

                    </div>
                </div>
            )}

            <div className="bg-[#111] px-6 md:px-16 py-12 flex flex-col md:flex-row md:justify-between gap-6">

                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-black font-montserrat">
                        PRODUCTOS
                    </h1>

                    <p className="text-gray-400 mt-3 text-sm md:text-base">
                        Explora nuestra colección curada de streetwear esencial.
                    </p>
                </div>

                <div className="text-gray-400 text-sm md:text-base self-end">
                    {filteredProducts.length} productos
                </div>

            </div>

            <div className="sticky top-[60px] z-40 bg-black border-b border-white/10 px-6 md:px-16 py-4 flex flex-col md:flex-row md:justify-between gap-4">

                <input
                    placeholder="Buscar productos..."
                    className="w-full md:w-[300px] px-4 py-2 bg-[#111] border border-white/10 rounded-full outline-none font-opensans"
                />

                <div className="flex items-center gap-3 font-montserrat">

                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden px-4 py-2 bg-[#111] border border-white/10 rounded-full text-sm"
                    >
                        Filtros
                    </button>

                    <button className="px-3 py-2 bg-[#111] rounded-lg">▦</button>
                    <button className="px-3 py-2 bg-[#111] rounded-lg">☰</button>

                    <select className="bg-[#111] text-white text-sm px-3 py-2 rounded-lg border border-white/10">
                        <option>Novedades</option>
                        <option>Precio</option>
                    </select>
                </div>

            </div>

            <div className="px-6 md:px-16 py-10 flex flex-col lg:flex-row gap-10">

                <aside className="w-full lg:w-64 lg:sticky lg:top-32 h-fit hidden lg:block">

                    <h3 className="font-montserrat font-bold mb-4">FILTROS</h3>

                    <div className="mb-6 text-sm text-gray-400 space-y-2">

                        <div
                            onClick={() => setShowCategories(!showCategories)}
                            className="cursor-pointer text-white font-montserrat"
                        >
                            Categorías ▾
                        </div>

                        {showCategories && (
                            <>
                                <label className="block cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes("hoodies")}
                                        onChange={() => toggleCategory("hoodies")}
                                    /> Hoodies
                                </label>

                                <label className="block cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes("tshirts")}
                                        onChange={() => toggleCategory("tshirts")}
                                    /> Camisetas
                                </label>

                                <label className="block cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes("pants")}
                                        onChange={() => toggleCategory("pants")}
                                    /> Pantalones
                                </label>

                                <label className="block cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes("accessories")}
                                        onChange={() => toggleCategory("accessories")}
                                    /> Accesorios
                                </label>
                            </>
                        )}

                    </div>

                    <div className="text-sm text-gray-400">

                        <div
                            onClick={() => setShowPrice(!showPrice)}
                            className="cursor-pointer text-white mb-2 font-montserrat"
                        >
                            Precio ▾
                        </div>

                        {showPrice && (
                            <>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full accent-purple-500"
                                />

                                <div className="flex justify-between text-xs mt-2 font-montserrat">
                                    <span className="text-purple-500">${price}</span>
                                    <span>$100</span>
                                </div>
                            </>
                        )}

                    </div>

                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-6 w-full border border-white/20 rounded-full py-2 text-sm font-montserrat"
                        >
                            Limpiar Filtros
                        </button>
                    )}

                </aside>

                <div className="flex-1">

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">

                        {filteredProducts.slice(0, visibleProducts).map((p) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/product/${p.id}`)}
                                className="bg-[#0a0a0a] rounded-xl overflow-hidden hover:scale-[1.03] transition cursor-pointer"
                            >
                                <div className="relative">
                                    <span className="absolute top-2 left-2 bg-black text-[10px] px-2 py-1 rounded-full z-10 font-montserrat">
                                        {categoryLabels[p.category]}
                                    </span>
                                    <div className="aspect-3/4 bg-[#222]" />
                                </div>

                                <div className="p-2 md:p-3">
                                    <h4 className="text-xs md:text-sm font-semibold font-montserrat">
                                        {p.name}
                                    </h4>
                                    <p className="text-purple-500 text-xs md:text-sm mt-1 font-montserrat">
                                        {p.price}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="flex justify-center mt-10 gap-4">

                        {visibleProducts < filteredProducts.length && (
                            <button
                                onClick={showMore}
                                className="px-6 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition"
                            >
                                Ver más productos
                            </button>
                        )}

                        {visibleProducts >= filteredProducts.length && filteredProducts.length > 12 && (
                            <button
                                onClick={showLess}
                                className="px-6 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition"
                            >
                                Ver menos
                            </button>
                        )}

                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Products;