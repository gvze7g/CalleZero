import { Download, Plus } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/shared/StatCard";
import ProductsTable from "../components/products/ProductsTable";
import useProducts from "../hooks/useProducts";

const ProductsPage = () => {
  const {
    navigate,
    products,
    stats,
    handleDelete,
    handleExport,
  } = useProducts();


  return (
    <AdminLayout>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-[Montserrat] text-[28px] font-extrabold text-white sm:text-[32px] md:text-[36px]">
            Gestión de Productos
          </h1>

          <p className="mt-2 max-w-[700px] font-[Open_Sans] text-[15px] text-white/75 sm:text-[16px] md:text-[18px]">
            Administra el inventario de streetwear de tu tienda Calle Zero.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-black px-4 font-[Open_Sans] text-[14px] font-bold text-white sm:px-5"
          >
            <Download size={17} />
            Exportar CSV
          </button>

          <button
            type="button"
            onClick={() => navigate("/add-product")}
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#6F6A68] px-4 font-[Open_Sans] text-[14px] font-bold text-white sm:px-5"
          >
            <Plus size={17} />
            Nuevo Producto
          </button>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      <section className="mt-6">
        <ProductsTable rows={products} onDelete={handleDelete} />
      </section>
    </AdminLayout>
  );
};

export default ProductsPage;