import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/common/PageHeader";
import CategoryCard from "../components/common/CategoryCard";
import useCategories from "../hooks/useCategories";

const Categories = () => {
    const navigate = useNavigate();
    const { categories, isLoading, loadError } = useCategories();

    return (
        <div className="bg-black text-white overflow-x-hidden">
            <Navbar />

            <PageHeader
                breadcrumb={
                    <>
                        INICIO &gt; <span className="text-white"> CATEGORÍAS</span>
                    </>
                }
                eyebrow="EXPLORAR"
                title="Categorías"
                description="Navega por nuestras colecciones curadas."
            />

            <section className="px-5 pb-10 sm:px-6 md:px-16">
                {isLoading && <p className="text-gray-400">Cargando categorías...</p>}
                {loadError && <p className="text-red-500">{loadError}</p>}

                {!isLoading && !loadError && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category._id}
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

export default Categories;