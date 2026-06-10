import React, { useMemo, useState } from "react";
import { Edit3, Filter, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SectionCard from "../shared/SectionCard";
import StatusBadge from "../shared/StatusBadge";
import UserAvatar from "../shared/UserAvatar";
import Pagination from "../shared/Pagination";

const ProductsTable = ({ rows = [], onDelete }) => {
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    const list = [...rows];

    if (selectedFilter === "price") {
      return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (selectedFilter === "category") {
      return list.sort((a, b) =>
        (a.categoryId?.name || "").localeCompare(b.categoryId?.name || "")
      );
    }

    if (selectedFilter === "stock") {
      return list.sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
    }

    return list;
  }, [rows, selectedFilter]);

  const handleEdit = (product) => {
    navigate("/add-product", {
      state: {
        mode: "edit",
        product,
      },
    });
  };

  const handleDelete = async (product) => {
    try {
      if (onDelete) {
        onDelete(product._id);
        toast.success("Producto eliminado");
        return;
      }

      const res = await fetch(
        `http://localhost:4000/api/product/${product._id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar producto");
    }
  };

  const getImage = (row) =>
    Array.isArray(row.imageUrl) ? row.imageUrl[0] : row.imageUrl;

  return (
    <SectionCard className="overflow-visible">
      <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-5 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-[20px] font-extrabold text-white">
            Catálogo de Productos
          </h3>
          <p className="mt-1 text-[14px] text-white/70">
            Mostrando {filteredRows.length} productos registrados.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-black px-4 py-3 text-[14px] font-semibold text-white"
          >
            <Filter size={18} />
            Filtrar
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 z-20 mt-2 w-[220px] rounded-[12px] border border-white/10 bg-[#151A24] p-2">
              {[
                { label: "Todos", value: "all" },
                { label: "Precio", value: "price" },
                { label: "Categoría", value: "category" },
                { label: "Stock", value: "stock" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setSelectedFilter(item.value);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full rounded-[8px] px-3 py-2 text-left text-[14px] ${
                    selectedFilter === item.value
                      ? "bg-[#6F6A68] text-white"
                      : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="block md:hidden">
        <div className="space-y-3 p-4">
          {filteredRows.map((row) => (
            <div
              key={row._id}
              className="rounded-[14px] border border-white/5 bg-[#171C26] p-4"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar image={getImage(row)} label={row.name} />
                  <div>
                    <p className="text-[13px] text-white/45">{row._id}</p>
                    <p className="font-bold text-white">{row.name}</p>
                  </div>
                </div>

                <button>
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatusBadge>{row.categoryId?.name}</StatusBadge>
                <p className="text-white">${row.price}</p>
                <p className="text-white">{row.stock}</p>

                <div className="flex gap-3">
                  <button onClick={() => handleEdit(row)}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(row)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row._id}>
                <td>
                  <UserAvatar image={getImage(row)} label={row.name} />
                </td>
                <td>{row.name}</td>
                <td>
                  <StatusBadge>{row.categoryId?.name}</StatusBadge>
                </td>
                <td>${row.price}</td>
                <td>{row.stock}</td>
                <td className="flex gap-4">
                  <button onClick={() => handleEdit(row)}>
                    <Edit3 size={17} />
                  </button>
                  <button onClick={() => handleDelete(row)}>
                    <Trash2 size={17} />
                  </button>
                  <MoreVertical size={17} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between px-4 py-5">
        <p className="text-white/80">
          Mostrando {filteredRows.length} productos
        </p>

        <Pagination
          currentPage={currentPage}
          onChangePage={setCurrentPage}
        />
      </div>
    </SectionCard>
  );
};

export default ProductsTable;