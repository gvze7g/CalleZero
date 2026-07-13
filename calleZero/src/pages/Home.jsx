import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import CategoryCard from "../components/common/CategoryCard";
import useFeaturedProducts from "../hooks/useFeaturedProducts";
import useCategories from "../hooks/useCategories";
import homeImage from "../assets/Home.png";

const Home = () => {
    const navigate = useNavigate();
    const { products, isLoading: loadingProducts, loadError: errorProducts } = useFeaturedProducts(4);
    const { categories, isLoading: loadingCategories, loadError: errorCategories } = useCategories(3);

    return (
        <div className="bg-black text-white font-[Open_Sans] overflow-x-hidden">
            <Navbar />

            {/* HERO - sin cambios */}
            <section className="relative flex min-h-[80vh] items-center overflow-hidden px-6 md:px-16">
                <img
                    src={homeImage}
                    alt="Calle Zero Streetwear"
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
                />
                <div className="relative z-10 max-w-4xl">
                    <h1 className="font-[Montserrat] text-5xl font-black leading-tight md:text-7xl lg:text-8xl">
                        DEFINE TU <br />
                        <span className="font-[Montserrat] font-black italic text-purple-500">PROPIO</span> CAMINO
                    </h1>
                    <p className="mt-6 max-w-md text-sm text-gray-400 md:text-base">
                        Estilo urbano minimalista diseñado para aquellos que no siguen reglas.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <button onClick={() => navigate("/products")} className="rounded-full bg-purple-500 px-5 py-2 font-[Montserrat] font-semibold text-black">
                            Explorar Productos
                        </button>
                        <button onClick={() => navigate("/categories")} className="rounded-full border border-white px-5 py-2 font-[Montserrat] font-semibold transition hover:bg-white hover:text-black">
                            Ver Categorías
                        </button>
                    </div>
                </div>
            </section>

            {/* PRODUCTOS DESTACADOS (4) */}
            <section className="bg-[#0f0f0f] px-6 py-16 md:px-16">
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    <div className="max-w-xl">
                        <h2 className="font-[Montserrat] text-3xl font-black md:text-5xl">PIEZAS ESENCIALES</h2>
                        <div className="my-3 h-[2px] w-20 bg-purple-500" />
                        <p className="text-sm text-gray-400 md:text-base">
                            Nuestra selección curada de los artículos más vendidos de esta temporada.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-1 font-[Montserrat] text-purple-500 hover:underline"
                    >
                        Ver todos <ArrowRight size={16} />
                    </button>
                </div>

                {loadingProducts && <p className="mt-10 text-gray-400">Cargando productos...</p>}
                {errorProducts && <p className="mt-10 text-red-500">{errorProducts}</p>}

                {!loadingProducts && !errorProducts && (
                    <div className="mt-10 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onClick={() => navigate(`/product/${product._id}`)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* CATEGORÍAS (3) */}
            <section className="bg-black px-6 py-16 md:px-16">
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <h2 className="font-[Montserrat] text-3xl font-black md:text-5xl">
                        EXPLORA COLECCIONES
                    </h2>

                    <button
                        onClick={() => navigate("/categories")}
                        className="flex items-center gap-1 font-[Montserrat] text-purple-500 hover:underline"
                    >
                        Ver todas <ArrowRight size={16} />
                    </button>
                </div>

                {loadingCategories && <p className="text-gray-400">Cargando categorías...</p>}
                {errorCategories && <p className="text-red-500">{errorCategories}</p>}

                {!loadingCategories && !errorCategories && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category._id}
                                compact
                                name={category.name}
                                image={category.image}
                                onClick={() => navigate(`/products?category=${category._id}`)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default Home;