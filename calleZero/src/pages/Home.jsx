import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import products from "../data/products";

const categoryLabels = {
    hoodies: "Hoodies",
    tshirts: "Camisetas",
    pants: "Pantalones",
    accessories: "Accesorios",
};

const Home = () => {
    const navigate = useNavigate();

    const collections = ["hoodies", "tshirts", "accessories"];

    return (
        <div className="bg-black text-white font-opensans">

            <Navbar />

            <section className="min-h-[80vh] flex items-center px-6 md:px-16">
                <div className="max-w-4xl">

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight font-montserrat">
                        DEFINE TU <br />
                        <span className="text-purple-500 font-opensans font-extrabold italic">
                            PROPIO
                        </span>{" "}
                        CAMINO
                    </h1>

                    <p className="text-gray-400 mt-6 max-w-md text-sm md:text-base">
                        Estilo urbano minimalista diseñado para aquellos que no siguen reglas.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-6">
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-purple-500 text-black px-5 py-2 rounded-full font-montserrat font-semibold"
                        >
                            Explorar Productos
                        </button>

                        <button
                            onClick={() => navigate("/categories")}
                            className="border border-white px-5 py-2 rounded-full font-montserrat font-semibold hover:bg-white hover:text-black transition"
                        >
                            Ver Categorías
                        </button>
                    </div>

                </div>
            </section>

            <section className="bg-[#0f0f0f] px-6 md:px-16 py-16">

                <div className="flex flex-col md:flex-row md:justify-between gap-6">

                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-black font-montserrat">
                            PIEZAS ESENCIALES
                        </h2>

                        <div className="w-20 h-[2px] bg-purple-500 my-3"></div>

                        <p className="text-gray-400 text-sm md:text-base">
                            Nuestra selección curada de los artículos más vendidos de esta temporada.
                        </p>
                    </div>

                    <span
                        onClick={() => navigate("/products")}
                        className="text-purple-500 cursor-pointer hover:underline font-montserrat"
                    >
                        Ver todos →
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-10">

                    {products.slice(0, 4).map((p) => (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="group bg-[#0a0a0a] rounded-xl overflow-hidden relative transition hover:scale-[1.03] cursor-pointer"
                        >
                            <span className="absolute top-3 left-3 bg-black text-[10px] px-2 py-1 rounded-full font-montserrat">
                                {categoryLabels[p.category]}
                            </span>

                            <div className="aspect-3/4 bg-[#222]"></div>

                            <div className="p-3">
                                <h4 className="font-semibold text-sm font-montserrat">
                                    {p.name}
                                </h4>
                                <p className="text-purple-500 text-sm font-montserrat">
                                    {p.price}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

            </section>

            <section className="bg-black px-6 md:px-16 py-16">

                <h2 className="text-3xl md:text-5xl font-black font-montserrat mb-10">
                    EXPLORA COLECCIONES
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {collections.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(`/products?category=${item}`)}
                            className="aspect-3/4 bg-[#111] rounded-xl p-5 flex flex-col justify-end cursor-pointer hover:scale-[1.03] transition"
                        >
                            <h3 className="font-bold font-montserrat">
                                {categoryLabels[item]}
                            </h3>

                            <button className="mt-2 bg-black px-4 py-1 rounded-full text-sm font-montserrat">
                                Ver Colección
                            </button>
                        </div>
                    ))}

                </div>

            </section>

            <Footer />
        </div>
    );
};

export default Home;