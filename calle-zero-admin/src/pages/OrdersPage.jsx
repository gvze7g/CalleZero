import React from "react";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/shared/StatCard";
import OrdersTable from "../components/orders/OrdersTable";
import OrdersSupportCard from "../components/orders/OrdersSupportCard";
import useAdminOrders from "../hooks/useAdminOrders";

const OrdersPage = () => {
    const { rows, stats, isLoading, loadError, updateStatus } = useAdminOrders();

    const handleExport = () => {
        toast.info("Preparando reporte de pedidos...");

        setTimeout(() => {
            toast.success("Reporte exportado correctamente");
        }, 900);
    };

    return (
        <AdminLayout>
            <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="font-[Montserrat] text-[28px] font-extrabold text-white sm:text-[32px] md:text-[36px]">
                        Gestión de Pedidos
                    </h1>

                    <p className="mt-2 max-w-[700px] font-[Open_Sans] text-[15px] text-white/75 sm:text-[16px] md:text-[18px]">
                        Administra y haz seguimiento a todas las ventas de Calle Zero.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
                    <button
                        type="button"
                        onClick={() => toast.info("Usa los filtros de estado en la tabla")}
                        className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-black px-4 font-[Open_Sans] text-[14px] font-bold text-white"
                    >
                        <Filter size={17} />
                        Filtrar
                    </button>

                    <button
                        type="button"
                        onClick={handleExport}
                        className="inline-flex h-[46px] items-center justify-center rounded-[10px] bg-[#6F6A68] px-4 font-[Open_Sans] text-[14px] font-bold text-white"
                    >
                        Exportar Reporte
                    </button>
                </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <StatCard key={item.title} {...item} />
                ))}
            </section>

            <section className="mt-6">
                {isLoading && (
                    <p className="py-8 text-center font-[Open_Sans] text-white/50">
                        Cargando pedidos...
                    </p>
                )}

                {loadError && (
                    <p className="py-8 text-center font-[Open_Sans] text-red-400">
                        {loadError}
                    </p>
                )}

                {!isLoading && !loadError && (
                    <OrdersTable rows={rows} onStatusChange={updateStatus} />
                )}
            </section>

            <section className="mt-6">
                <OrdersSupportCard />
            </section>
        </AdminLayout>
    );
};

export default OrdersPage;