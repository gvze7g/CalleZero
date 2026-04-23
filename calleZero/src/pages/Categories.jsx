import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Categories = () => {
    const navigate = useNavigate();

    const categories = [
        {
            name: "Hoodies & Sudaderas",
            slug: "hoodies",
            items: 24,
            tag: "Essential",
            img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        },
        {
            name: "Camisetas Gráficas",
            slug: "tshirts",
            items: 42,
            tag: "Popular",
            img: "https://images.unsplash.com/photo-1520975922284-9b9c6f0a3b0c",
        },
        {
            name: "Pantalones & Cargo",
            slug: "pants",
            items: 18,
            tag: "Technical",
            img: "https://images.unsplash.com/photo-1602810319428-019690571b5b",
        },
        {
            name: "Accesorios",
            slug: "accessories",
            items: 31,
            tag: "Details",
            img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
        },
    ];

    const filters = ["Ver Todo", "Oversize", "Essential", "Limited Edition", "Techwear"];

    return (
        <div className="bg-black text-white">

            <Navbar />

            <div className="px-5 sm:px-6 md:px-16 pt-10 md:pt-16 pb-6">

                <p className="text-xs text-gray-500 mb-4 font-[Open_Sans]">
                    INICIO &gt; <span className="text-white"> CATEGORÍAS</span>
                </p>

                <p className="text-purple-500 text-sm font-[Montserrat] mb-2 tracking-wide">
                    EXPLORAR
                </p>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-[Montserrat]">
                    Categorías
                </h1>

                <p className="text-gray-400 mt-4 max-w-xl text-sm md:text-base font-[Open_Sans]">
                    Navega por nuestras colecciones curadas.
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                    {filters.map((f, i) => (
                        <button
                            key={i}
                            className={`
                                px-4 py-2 rounded-full text-sm font-[Montserrat] transition
                                ${i === 0
                                    ? "bg-purple-500 text-black"
                                    : "bg-[#1a1a1a] text-white hover:bg-purple-500 hover:text-black"
                                }
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="w-full h-px bg-white/10 mt-8"></div>

            </div>

            <div className="px-5 sm:px-6 md:px-16 pb-10">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">

                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(`/products?category=${cat.slug}`)}
                            className="relative group rounded-2xl overflow-hidden cursor-pointer"
                        >

                            <div
                                className="h-[340px] sm:h-[380px] md:h-[420px] lg:h-[480px] bg-cover bg-center transition duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${cat.img})` }}
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

                            <span className="absolute top-4 right-4 bg-purple-500 text-black text-xs px-3 py-1 rounded-full font-[Montserrat]">
                                {cat.tag}
                            </span>

                            <div className="absolute bottom-5 left-5 right-5">

                                <p className="text-gray-400 text-xs mb-1 font-[Open_Sans]">
                                    {cat.items} ITEMS
                                </p>

                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-[Montserrat]">
                                    {cat.name}
                                </h3>

                                <button className="mt-3 text-sm font-[Montserrat] flex items-center gap-2 group-hover:text-purple-400 transition">
                                    Ver todo →
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

            <Footer />

        </div>
    );
};

export default Categories;