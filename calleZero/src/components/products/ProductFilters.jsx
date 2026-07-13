import React from "react";

const ProductFilters = ({
    categories = [],
    selectedCategories,
    toggleCategory,
    showCategories,
    setShowCategories,
    showPrice,
    setShowPrice,
    price,
    setPrice,
    priceFilterActive,
    setPriceFilterActive,
    hasFilters,
    clearFilters,
}) => {
    return (
        <>
            <h3 className="mb-4 font-[Montserrat] font-bold text-white">FILTROS</h3>

            <div className="mb-6 space-y-2 text-sm text-gray-400">
                <div
                    onClick={() => setShowCategories(!showCategories)}
                    className="cursor-pointer font-[Montserrat] text-white"
                >
                    Categorías ▾
                </div>

                {showCategories && (
                    <>
                        {categories.length === 0 && (
                            <p className="text-xs text-gray-600">
                                No hay categorías disponibles
                            </p>
                        )}

                        {categories.map((category) => (
                            <label key={category.id} className="block cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => toggleCategory(category.id)}
                                    className="accent-purple-500"
                                />{" "}
                                {category.name}
                            </label>
                        ))}
                    </>
                )}
            </div>

            <div className="text-sm text-gray-400">
                <div
                    onClick={() => setShowPrice(!showPrice)}
                    className="mb-2 cursor-pointer font-[Montserrat] text-white"
                >
                    Precio ▾
                </div>

                {showPrice && (
                    <>
                        <label className="mb-3 flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={priceFilterActive}
                                onChange={(e) => setPriceFilterActive(e.target.checked)}
                                className="accent-purple-500"
                            />
                            Activar filtro de precio
                        </label>

                        <input
                            type="range"
                            min="5"
                            max="200"
                            value={price}
                            disabled={!priceFilterActive}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full accent-purple-500 disabled:opacity-40"
                        />

                        <div className="mt-2 flex justify-between font-[Montserrat] text-xs">
                            <span className={priceFilterActive ? "text-purple-500" : "text-gray-600"}>
                                ${price}
                            </span>
                            <span>$200</span>
                        </div>
                    </>
                )}
            </div>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="mt-6 w-full rounded-full border border-white/20 py-2 font-[Montserrat] text-sm text-white"
                >
                    Limpiar Filtros
                </button>
            )}
        </>
    );
};

export default ProductFilters;