import React, { useMemo, useState } from "react";
import { MoreHorizontal, Search, Check } from "lucide-react";
import { toast } from "sonner";
import SectionCard from "../shared/SectionCard";
import StatusBadge from "../shared/StatusBadge";
import UserAvatar from "../shared/UserAvatar";
import Pagination from "../shared/Pagination";

const tabs = ["Todos", "Pendientes", "En Proceso", "Enviados", "Completados"];

const statusMap = {
  Todos: "all",
  Pendientes: "Pendiente",
  "En Proceso": "Procesando",
  Enviados: "Enviado",
  Completados: "Completado",
};

const statusOptions = ["Pendiente", "Procesando", "Enviado", "Completado"];

const OrdersTable = ({ rows, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredRows = useMemo(() => {
    const selectedStatus = statusMap[activeTab];

    return rows.filter((row) => {
      const matchesStatus =
        selectedStatus === "all" || row.status === selectedStatus;

      const matchesSearch =
        row.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [rows, activeTab, searchTerm]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleMenu = (rowId) => {
    setOpenMenuId((prev) => (prev === rowId ? null : rowId));
  };

  const handleStatusSelect = (row, newStatus) => {
    if (newStatus === row.status) {
      setOpenMenuId(null);
      return;
    }

    onStatusChange(row.rawId, newStatus);
    setOpenMenuId(null);
  };

  const StatusMenu = ({ row }) => (
    <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-[10px] border border-white/10 bg-[#171C26] shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      <p className="border-b border-white/10 px-3 py-2 font-[Open_Sans] text-[12px] font-bold text-white/50">
        Cambiar estado
      </p>
      {statusOptions.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleStatusSelect(row, option)}
          className="flex w-full items-center justify-between px-3 py-2 text-left font-[Open_Sans] text-[13px] text-white hover:bg-white/5"
        >
          {option}
          {row.status === option && <Check size={14} className="text-purple-400" />}
        </button>
      ))}
    </div>
  );

  return (
    <SectionCard className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTabChange(item)}
                className={`rounded-[8px] px-3 py-2 font-[Open_Sans] text-[13px] font-semibold sm:px-4 sm:text-[14px] ${activeTab === item
                    ? "bg-black text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-[320px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar pedido o cliente..."
              className="h-[42px] w-full rounded-[10px] border border-white/10 bg-black pl-11 pr-4 font-[Open_Sans] text-[14px] text-white outline-none placeholder:text-white/50"
            />
          </div>
        </div>
      </div>

      <div className="block md:hidden">
        <div className="space-y-3 p-4">
          {filteredRows.map((row) => (
            <div
              key={row.id}
              className="rounded-[14px] border border-white/5 bg-[#171C26] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-[Open_Sans] text-[13px] font-bold text-white/30">
                    {row.id}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <UserAvatar label={row.avatar} />
                    <div className="min-w-0">
                      <p className="font-[Open_Sans] text-[15px] font-bold text-white">
                        {row.customer}
                      </p>
                      <p className="truncate font-[Open_Sans] text-[13px] text-white/55">
                        {row.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu(row.id)}
                    className="text-white/70"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === row.id && <StatusMenu row={row} />}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="font-[Open_Sans] text-[12px] text-white/45">
                    Fecha
                  </p>
                  <p className="mt-1 font-[Open_Sans] text-[14px] text-white/85">
                    {row.date}
                  </p>
                </div>

                <div>
                  <p className="font-[Open_Sans] text-[12px] text-white/45">
                    Artículos
                  </p>
                  <p className="mt-1 font-[Open_Sans] text-[14px] font-bold text-white/85">
                    {row.items}
                  </p>
                </div>

                <div>
                  <p className="font-[Open_Sans] text-[12px] text-white/45">
                    Total
                  </p>
                  <p className="mt-1 font-[Open_Sans] text-[15px] font-bold text-white">
                    {row.total}
                  </p>
                </div>

                <div>
                  <p className="font-[Open_Sans] text-[12px] text-white/45">
                    Estado
                  </p>
                  <div className="mt-1">
                    <StatusBadge type={row.statusType}>{row.status}</StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredRows.length === 0 ? (
            <p className="py-8 text-center font-[Open_Sans] text-[14px] text-white/50">
              No se encontraron pedidos.
            </p>
          ) : null}
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1080px]">
          <thead>
            <tr className="text-left">
              <th className="px-5 py-4 font-[Open_Sans] text-[14px] font-bold text-white/85">
                ID Pedido
              </th>
              <th className="px-5 py-4 font-[Open_Sans] text-[14px] font-bold text-white/85">
                Cliente
              </th>
              <th className="px-5 py-4 font-[Open_Sans] text-[14px] font-bold text-white/85">
                Fecha
              </th>
              <th className="px-5 py-4 font-[Open_Sans] text-[14px] font-bold text-white/85">
                Artículos
              </th>
              <th className="px-5 py-4 font-[Open_Sans] text-[14px] font-bold text-white/85">
                Total (USD)
              </th>
              <th className="px-5 py-4 font-[Open_Sans] text-[14px] font-bold text-white/85">
                Estado
              </th>
              <th className="px-5 py-4 text-right font-[Open_Sans] text-[14px] font-bold text-white/85">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="border-t border-white/5 px-5 py-4 font-[Open_Sans] text-[14px] font-bold text-white/25">
                  {row.id}
                </td>

                <td className="border-t border-white/5 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar label={row.avatar} />
                    <div>
                      <p className="font-[Open_Sans] text-[15px] font-bold text-white">
                        {row.customer}
                      </p>
                      <p className="font-[Open_Sans] text-[13px] text-white/55">
                        {row.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="border-t border-white/5 px-5 py-4 font-[Open_Sans] text-[15px] text-white/85">
                  {row.date}
                </td>

                <td className="border-t border-white/5 px-5 py-4 font-[Open_Sans] text-[15px] font-bold text-white/85">
                  {row.items}
                </td>

                <td className="border-t border-white/5 px-5 py-4 font-[Open_Sans] text-[15px] font-bold text-white">
                  {row.total}
                </td>

                <td className="border-t border-white/5 px-5 py-4">
                  <StatusBadge type={row.statusType}>{row.status}</StatusBadge>
                </td>

                <td className="border-t border-white/5 px-5 py-4">
                  <div className="relative flex items-center justify-end text-white/75">
                    <button
                      type="button"
                      onClick={() => toggleMenu(row.id)}
                    >
                      <MoreHorizontal size={17} />
                    </button>

                    {openMenuId === row.id && <StatusMenu row={row} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRows.length === 0 ? (
          <p className="py-8 text-center font-[Open_Sans] text-[14px] text-white/50">
            No se encontraron pedidos.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 px-4 py-5 sm:px-5 md:flex-row md:items-center md:justify-between">
        <p className="font-[Open_Sans] text-[15px] text-white/80">
          Mostrando {filteredRows.length} de {rows.length} pedidos
        </p>

        <Pagination currentPage={currentPage} onChangePage={handlePageChange} />
      </div>
    </SectionCard>
  );
};

export default OrdersTable;