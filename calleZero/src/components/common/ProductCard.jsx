const ProductCard = ({ product, onClick, compact = false }) => {
    if (!product) return null;

    const image = product.imageUrl?.[0];
    const categoryName = product.categoryId?.name || "Sin categoría";

    return (
        <article
            onClick={onClick}
            className="group cursor-pointer overflow-hidden rounded-xl bg-[#0a0a0a] transition hover:scale-[1.03]"
        >
            <div className="relative overflow-hidden">
                <span className="absolute left-2 top-2 z-10 rounded-full bg-black px-2 py-1 font-[Montserrat] text-[10px] text-white">
                    {categoryName}
                </span>

                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="aspect-3/4 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="aspect-3/4 bg-[#222]" />
                )}
            </div>

            <div className={compact ? "p-2 md:p-3" : "p-3"}>
                <h4 className="font-[Montserrat] text-xs font-semibold text-white md:text-sm">
                    {product.name}
                </h4>

                <p className="mt-1 font-[Montserrat] text-xs text-purple-500 md:text-sm">
                    ${Number(product.price).toFixed(2)}
                </p>
            </div>
        </article>
    );
};

export default ProductCard;