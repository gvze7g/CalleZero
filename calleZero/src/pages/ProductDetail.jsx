import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import useProductDetail from "../hooks/useProductDetail";

const ProductDetail = () => {
    const {
        navigate,
        product,
        isLoading,
        loadError,
        relatedProducts,
        images,
        currentImage,
        selectedImageIndex,
        setSelectedImageIndex,
        availableSizes,
        selectedSize,
        setSelectedSize,
        stock,
        isOutOfStock,
        categoryName,
        quantity,
        increaseQuantity,
        decreaseQuantity,
        isFavorite,
        handleAddToCart,
        handleFavorite,
        handleSizeGuide,
    } = useProductDetail();

    if (isLoading) {
        return (
            <div className="bg-black text-white overflow-x-hidden">
                <Navbar />
                <div className="flex min-h-[50vh] items-center justify-center">
                    <p className="text-gray-400">Cargando producto...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (loadError || !product) {
        return (
            <div className="bg-black text-white overflow-x-hidden">
                <Navbar />
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                    <p>Producto no encontrado</p>
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="rounded-full border border-white/20 px-6 py-2 text-sm transition hover:bg-white hover:text-black"
                    >
                        Volver a productos
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-black text-white overflow-x-hidden">
            <Navbar />

            <section className="px-5 py-10 sm:px-6 md:px-16">
                <p className="mb-6 font-[Open_Sans] text-xs text-gray-500">
                    Inicio &gt; {categoryName} &gt;{" "}
                    <span className="text-white">{product.name}</span>
                </p>

                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="flex min-w-0 gap-4">
                        <div className="flex shrink-0 flex-col gap-3">
                            {images.length > 0 ? (
                                images.map((img, index) => (
                                    <button
                                        key={img}
                                        type="button"
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`h-20 w-16 shrink-0 overflow-hidden rounded-md bg-[#222] transition hover:ring-2 hover:ring-purple-500 ${
                                            selectedImageIndex === index
                                                ? "ring-2 ring-purple-500"
                                                : ""
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} vista ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))
                            ) : (
                                <div className="h-20 w-16 rounded-md bg-[#222]" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    className="h-[400px] w-full rounded-xl object-cover sm:h-[500px] md:h-[600px]"
                                />
                            ) : (
                                <div className="h-[400px] w-full rounded-xl bg-[#222] sm:h-[500px] md:h-[600px]" />
                            )}
                        </div>
                    </div>

                    <div>
                        <span className="rounded-full bg-purple-500/20 px-3 py-1 font-[Montserrat] text-xs text-purple-400">
                            {categoryName}
                        </span>

                        <h1 className="mt-4 font-[Montserrat] text-3xl font-black md:text-4xl">
                            {product.name}
                        </h1>

                        <div className="mt-4 flex items-center gap-3">
                            <span className="font-[Montserrat] text-xl font-bold">
                                ${Number(product.price).toFixed(2)}
                            </span>
                            <span className="font-[Open_Sans] text-sm text-gray-400">
                                IVA incluido. Envío gratis +100€
                            </span>
                        </div>

                        {isOutOfStock ? (
                            <p className="mt-2 font-[Open_Sans] text-sm font-semibold text-red-400">
                                Sin stock disponible
                            </p>
                        ) : (
                            <p className="mt-2 font-[Open_Sans] text-sm text-gray-400">
                                {stock} unidades disponibles
                            </p>
                        )}

                        <p className="mt-6 max-w-md font-[Open_Sans] text-sm leading-relaxed text-gray-400">
                            {product.description}
                        </p>

                        {availableSizes.length > 0 && (
                            <div className="mt-8">
                                <div className="mb-3 flex justify-between text-sm">
                                    <span className="font-[Montserrat]">TALLA</span>

                                    <button
                                        type="button"
                                        onClick={handleSizeGuide}
                                        className="text-xs text-gray-400 transition hover:text-purple-400"
                                    >
                                        Guía de tallas
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`rounded-md border px-4 py-2 font-[Montserrat] text-sm ${
                                                selectedSize === size
                                                    ? "border-purple-500 bg-purple-500 text-black"
                                                    : "border-white/20 hover:border-purple-500"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6">
                            <p className="mb-2 font-[Montserrat] text-sm">CANTIDAD</p>

                            <div className="flex w-fit items-center rounded-md border border-white/20">
                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                    disabled={isOutOfStock}
                                    className="px-3 py-2 transition hover:text-purple-400 disabled:opacity-30"
                                >
                                    -
                                </button>

                                <span className="px-4">{quantity}</span>

                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                    disabled={isOutOfStock}
                                    className="px-3 py-2 transition hover:text-purple-400 disabled:opacity-30"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-1 rounded-lg bg-purple-500 py-3 font-[Montserrat] font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isOutOfStock ? "Sin stock" : "Añadir al carrito"}
                            </button>

                            <button
                                type="button"
                                onClick={handleFavorite}
                                className={`rounded-lg border px-4 transition ${
                                    isFavorite
                                        ? "border-purple-500 bg-purple-500 text-black"
                                        : "border-white/20 hover:border-purple-500 hover:text-purple-400"
                                }`}
                            >
                                ♥
                            </button>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-5 font-[Open_Sans] text-xs text-gray-400 sm:gap-8">
                            <span>Envío 24/48H</span>
                            <span>14 días devolución</span>
                            <span>Pago seguro</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#111] px-5 py-12 sm:px-6 md:px-16">
                <h2 className="mb-6 font-[Montserrat] text-lg">
                    Especificaciones Técnicas
                </h2>

                <div className="grid gap-6 font-[Open_Sans] text-sm text-gray-400 md:grid-cols-2">
                    <ul className="space-y-2">
                        <li>• SKU: {product.sku || "N/A"}</li>
                        <li>• Categoría: {categoryName}</li>
                    </ul>

                    <ul className="space-y-2">
                        <li>
                            • Tallas: {availableSizes.length > 0 ? availableSizes.join(", ") : "No especificadas"}
                        </li>
                        <li>• Stock: {stock} unidades</li>
                    </ul>
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <section className="px-5 py-12 sm:px-6 md:px-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="font-[Montserrat] text-xs text-purple-500">
                                COMPLETA EL LOOK
                            </p>
                            <h2 className="font-[Montserrat] text-xl font-black md:text-2xl">
                                TAMBIÉN TE PUEDE GUSTAR
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="text-sm text-purple-500"
                        >
                            VER TODO
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard
                                key={relatedProduct._id}
                                product={relatedProduct}
                                onClick={() => navigate(`/product/${relatedProduct._id}`)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
};

export default ProductDetail;