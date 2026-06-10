import React from "react";
import AddCategoryCard from "./AddCategoryCard";
import CategoryCard from "./CategoryCard";

const CategoriesGrid = ({
    categories,
    onCreateCategory,
    onEditCategory,
    onDeleteCategory,
}) => {
    return (
        <section className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AddCategoryCard onCreateCategory={onCreateCategory} />

            {categories.map((category) => (
                <CategoryCard
                    key={category._id}
                    category={category}
                    onEditCategory={onEditCategory}
                    onDeleteCategory={onDeleteCategory}
                />
            ))}
        </section>
    );
};

export default CategoriesGrid;