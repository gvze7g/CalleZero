import React, { useMemo, useState } from "react";
import { Edit3, Filter, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SectionCard from "../shared/SectionCard";
import StatusBadge from "../shared/StatusBadge";
import UserAvatar from "../shared/UserAvatar";
import Pagination from "../shared/Pagination";
import { apiFetch } from "../../lib/api.js";

const ProductsTable = ({ rows = [], onDelete }) => {
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Paginación
  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredRows, currentPage]);

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

      const res = await apiFetch(
        `/api/product/${product._id}`,
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
      {/* HEADER CON FILTRO */}
      <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-[18px] font-extrabold text-white sm:text-[20px]">
            Catálogo de Productos
          </h3>
          <p className="mt-1 text-[13px] text-white/70 sm:text-[14px]">
            Mostrando {paginatedRows.length} de {filteredRows.length} productos
          </p>
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/5 sm:w-auto sm:py-3"
          >
            <Filter size={18} />
            Filtrar
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full z-20 mt-2 w-full rounded-[12px] border border-white/10 bg-[#151A24] p-2 sm:w-[220px]">
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
                  className={`w-full rounded-[8px] px-3 py-2 text-left text-[13px] transition sm:text-[14px] ${
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

      {/* VISTA MÓVIL */}
      <div className="block lg:hidden">
        <div className="space-y-3 p-4">
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <div
                key={row._id}
                className="rounded-[12px] border border-white/10 bg-[#0F1419] p-4 transition hover:bg-[#151C26]"
              >
                {/* Imagen y Nombre */}
                <div className="flex gap-3">
                  <UserAvatar image={getImage(row)} label={row.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-white/50 truncate">
                      ID: {row._id.slice(0, 12)}...
                    </p>
                    <p className="font-bold text-white text-[14px] truncate">
                      {row.name}
                    </p>
                    <p className="text-[12px] text-white/60">
                      {row.categoryId?.name || "Sin categoría"}
                    </p>
                  </div>
                </div>

                {/* Información Principal */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[11px] text-white/50 uppercase">Precio</p>
                    <p className="font-bold text-white text-[14px]">
                      ${row.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase">Stock</p>
                    <p className="font-bold text-white text-[14px]">
                      {row.stock}
                    </p>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="mt-3 flex gap-2 justify-end border-t border-white/5 pt-3">
                  <button
                    onClick={() => handleEdit(row)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-[8px] bg-blue-600/20 py-2 text-blue-400 text-[12px] font-semibold transition hover:bg-blue-600/30"
                  >
                    <Edit3 size={15} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-[8px] bg-red-600/20 py-2 text-red-400 text-[12px] font-semibold transition hover:bg-red-600/30"
                  >
                    <Trash2 size={15} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-white/50">No hay productos para mostrar</p>
            </div>
          )}
        </div>
      </div>

      {/* VISTA DESKTOP - TABLA MEJORADA */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-[#0F1419]/50">
              <th className="px-6 py-4 text-left text-[13px] font-bold text-white/70 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-bold text-white/70 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-4 text-right text-[13px] font-bold text-white/70 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-4 text-right text-[13px] font-bold text-white/70 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-center text-[13px] font-bold text-white/70 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  {/* Producto */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <UserAvatar image={getImage(row)} label={row.name} />
                    <div>
                      <p className="font-bold text-white text-[14px]">
                        {row.name}
                      </p>
                      <p className="text-[12px] text-white/50">
                        {row._id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4">
                    <StatusBadge>{row.categoryId?.name || "—"}</StatusBadge>
                  </td>

                  {/* Precio */}
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-white text-[14px]">
                      ${Number(row.price).toFixed(2)}
                    </p>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-right">
                    <p
                      className={`font-bold text-[14px] ${
                        row.stock > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {row.stock}
                    </p>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(row)}
                        className="rounded-lg bg-blue-600/20 p-2 text-blue-400 transition hover:bg-blue-600/30"
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="rounded-lg bg-red-600/20 p-2 text-red-400 transition hover:bg-red-600/30"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <p className="text-white/50">No hay productos para mostrar</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER CON PAGINACIÓN */}
      <div className="flex flex-col gap-4 border-t border-white/5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-white/70 sm:text-[14px]">
          Mostrando {paginatedRows.length} de {filteredRows.length} productos
        </p>

        <Pagination
          currentPage={currentPage}
          onChangePage={setCurrentPage}
          totalPages={Math.ceil(filteredRows.length / itemsPerPage)}
        />
      </div>
    </SectionCard>
  );
};

export default ProductsTable;