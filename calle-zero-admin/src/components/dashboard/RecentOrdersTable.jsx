import React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../shared/SectionCard";
import StatusBadge from "../shared/StatusBadge";
import UserAvatar from "../shared/UserAvatar";

const RecentOrdersTable = ({ rows }) => {
  const navigate = useNavigate();

  return (
    <SectionCard className="overflow-hidden">
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="font-[Montserrat] text-[20px] font-extrabold text-white">
            Últimos Pedidos
          </h3>
          <p className="mt-1 font-[Open_Sans] text-[14px] text-white/70">
            Resumen de las transacciones más recientes realizadas en la tienda.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 self-start rounded-[10px] bg-black px-4 py-3 font-[Open_Sans] text-[14px] font-semibold text-white"
        >
          Ver todo
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="block md:hidden">
        <div className="space-y-3 px-4 pb-4 sm:px-5">
          {rows.map((row) => (
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
                      <p className="font-[Open_Sans] text-[13px] text-white/55">
                        {row.date}
                      </p>
                    </div>
                  </div>
                </div>

                <button type="button" onClick={() => navigate("/orders")} title="Ver pedidos" className="text-white/70 hover:text-white">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
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
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#202634] text-left">
              <th className="px-4 py-4 font-[Open_Sans] text-[14px] font-bold text-white/70">
                Pedido
              </th>
              <th className="px-4 py-4 font-[Open_Sans] text-[14px] font-bold text-white/70">
                Cliente
              </th>
              <th className="px-4 py-4 font-[Open_Sans] text-[14px] font-bold text-white/70">
                Fecha
              </th>
              <th className="px-4 py-4 font-[Open_Sans] text-[14px] font-bold text-white/70">
                Total
              </th>
              <th className="px-4 py-4 font-[Open_Sans] text-[14px] font-bold text-white/70">
                Estado
              </th>
              <th className="px-4 py-4" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="bg-[#1A1F2B]">
                <td className="border-t border-white/5 px-4 py-4 font-[Open_Sans] text-[14px] text-white/30">
                  {row.id}
                </td>

                <td className="border-t border-white/5 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar label={row.avatar} />
                    <span className="font-[Open_Sans] text-[15px] font-bold text-white">
                      {row.customer}
                    </span>
                  </div>
                </td>

                <td className="border-t border-white/5 px-4 py-4 font-[Open_Sans] text-[15px] text-white/75">
                  {row.date}
                </td>

                <td className="border-t border-white/5 px-4 py-4 font-[Open_Sans] text-[15px] font-bold text-white">
                  {row.total}
                </td>

                <td className="border-t border-white/5 px-4 py-4">
                  <StatusBadge type={row.statusType}>{row.status}</StatusBadge>
                </td>

                <td className="border-t border-white/5 px-4 py-4 text-right text-white/70">
                  <MoreHorizontal size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
};

export default RecentOrdersTable;