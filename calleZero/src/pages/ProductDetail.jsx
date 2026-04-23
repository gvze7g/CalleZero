import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import products from "../data/products";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const product = products.find((p) => p.id === parseInt(id));

    const relatedProducts = products
        .filter((p) => p.id !== product?.id)
        .slice(0, 4);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return <div className="text-white p-10">Producto no encontrado</div>;
    }

    return (
        <div className="bg-black text-white">

            <Navbar />

            <div className="px-5 sm:px-6 md:px-16 py-10">

                <p className="text-xs text-gray-500 mb-6 font-[Open_Sans]">
                    Inicio &gt; {product.category} &gt;{" "}
                    <span className="text-white">
                        {product.name}
                    </span>
                </p>

                <div className="grid lg:grid-cols-2 gap-10">

                    <div className="flex gap-4">

                        <div className="flex flex-col gap-3">
                            <div className="w-16 h-20 bg-[#222] rounded-md" />
                            <div className="w-16 h-20 bg-[#222] rounded-md" />
                            <div className="w-16 h-20 bg-[#222] rounded-md" />
                        </div>

                        <div className="flex-1 h-[400px] sm:h-[500px] md:h-[600px] bg-[#222] rounded-xl" />
                        {/* <img src={product.image} /> */}

                    </div>

                    <div>

                        <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-[Montserrat]">
                            {product.tag}
                        </span>

                        <h1 className="text-3xl md:text-4xl font-black mt-4 font-[Montserrat]">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-xl font-bold font-[Montserrat]">
                                {product.price}
                            </span>
                            <span className="text-gray-400 text-sm font-[Open_Sans]">
                                IVA incluido. Envío gratis +100€
                            </span>
                        </div>

                        <p className="text-gray-400 mt-6 text-sm leading-relaxed font-[Open_Sans] max-w-md">
                            {product.description}
                        </p>

                        <div className="mt-8">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="font-[Montserrat]">TALLA</span>
                                <span className="text-gray-400 text-xs">Guía de tallas</span>
                            </div>

                            <div className="flex gap-2">
                                {["S", "M", "L", "XL"].map((size, i) => (
                                    <button
                                        key={i}
                                        className={`px-4 py-2 border rounded-md text-sm font-[Montserrat]
                                            ${size === "M"
                                                ? "bg-purple-500 text-black border-purple-500"
                                                : "border-white/20 hover:border-purple-500"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm mb-2 font-[Montserrat]">CANTIDAD</p>

                            <div className="flex items-center border border-white/20 rounded-md w-fit">
                                <button className="px-3 py-2">-</button>
                                <span className="px-4">1</span>
                                <button className="px-3 py-2">+</button>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">

                            <button className="flex-1 bg-purple-500 text-black py-3 rounded-lg font-[Montserrat] font-semibold hover:opacity-90 transition">
                                Añadir al carrito
                            </button>

                            <button className="border border-white/20 px-4 rounded-lg">
                                ♥
                            </button>

                        </div>

                        <div className="flex gap-8 text-xs text-gray-400 mt-8 font-[Open_Sans]">
                            <span>Envío 24/48H</span>
                            <span>14 días devolución</span>
                            <span>Pago seguro</span>
                        </div>

                    </div>

                </div>

            </div>

            <div className="bg-[#111] px-5 sm:px-6 md:px-16 py-12">

                <h2 className="font-[Montserrat] text-lg mb-6">
                    Especificaciones Técnicas
                </h2>

                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400 font-[Open_Sans]">
                    <ul className="space-y-2">
                        <li>• 100% Algodón Orgánico</li>
                        <li>• Alta calidad</li>
                    </ul>

                    <ul className="space-y-2">
                        <li>• Corte Oversize</li>
                        <li>• Diseño urbano</li>
                    </ul>
                </div>

            </div>

            <div className="px-5 sm:px-6 md:px-16 py-12">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-xs text-purple-500 font-[Montserrat]">
                            COMPLETA EL LOOK
                        </p>
                        <h2 className="text-xl md:text-2xl font-black font-[Montserrat]">
                            TAMBIÉN TE PUEDE GUSTAR
                        </h2>
                    </div>

                    <span
                        onClick={() => navigate("/products")}
                        className="text-sm text-purple-500 cursor-pointer"
                    >
                        VER TODO
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {relatedProducts.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="bg-[#111] rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition"
                        >
                            <div className="aspect-3/4 bg-[#222]" />
                            {/* <img src={p.image} /> */}

                            <div className="p-3">
                                <h4 className="text-sm font-[Montserrat]">
                                    {p.name}
                                </h4>
                                <p className="text-purple-500 text-sm">
                                    {p.price}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

            </div>

            <Footer />

        </div>
    );
};

export default ProductDetail;