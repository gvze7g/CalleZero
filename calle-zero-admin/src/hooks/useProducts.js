import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [stats, setStats] = useState([
    { title: "Total Productos", value: "0" },
    { title: "Stock Total", value: "0" },
    { title: "Categorías", value: "0" },
    { title: "Productos Activos", value: "0" },
  ]);

  const calculateStats = (data) => {
    const totalStock = data.reduce(
      (a, p) => a + Number(p.stock || 0),
      0
    );

    const totalCategories = new Set(
      data.map((p) => p.categoryId?._id).filter(Boolean)
    ).size;

    const activeProducts = data.filter(
      (p) => p.isActive
    ).length;

    setStats([
      { title: "Total Productos", value: data.length },
      { title: "Stock Total", value: totalStock },
      { title: "Categorías", value: totalCategories },
      { title: "Productos Activos", value: activeProducts },
    ]);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/product"
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      setProducts(data);
      calculateStats(data);
    } catch {
      toast.error("Error al cargar productos");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/product/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Producto eliminado");

      setProducts((prev) => {
        const updated = prev.filter(
          (p) => p._id !== id
        );

        calculateStats(updated);

        return updated;
      });
    } catch {
      toast.error("Error al eliminar producto");
    }
  };

  const handleExport = () => {
    toast.info("Exportando datos del catálogo...");
  };

  return {
    navigate,
    products,
    stats,
    handleDelete,
    handleExport,
  };
}