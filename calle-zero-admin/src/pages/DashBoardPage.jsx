import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/shared/StatCard";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import InventoryAlertsCard from "../components/dashboard/InventoryAlertsCard";
import QuickActionsCard from "../components/dashboard/QuickActionsCard";
import DailyGoalCard from "../components/dashboard/DailyGoalCard";
import useDashboard from "../hooks/useDashboard";

const DashboardPage = () => {
  const { stats, recentOrders, inventoryAlerts, dailyGoal, isLoading, loadError } =
    useDashboard();

  return (
    <AdminLayout>
      <section>
        <h1 className="font-[Montserrat] text-[28px] font-extrabold text-white sm:text-[32px] md:text-[40px]">
          Bienvenido, Admin
        </h1>

        <p className="mt-2 font-[Open_Sans] text-[15px] text-white/75 sm:text-[16px] md:text-[18px]">
          Aquí tienes el resumen de tu tienda hoy.
        </p>
      </section>

      {loadError && (
        <p className="mt-6 font-[Open_Sans] text-red-400">{loadError}</p>
      )}

      {isLoading ? (
        <p className="mt-6 font-[Open_Sans] text-white/50">Cargando dashboard...</p>
      ) : (
        <>
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => (
              <StatCard key={item.title} {...item} />
            ))}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.9fr_0.95fr]">
            <RecentOrdersTable rows={recentOrders} />

            <div className="space-y-6">
              <InventoryAlertsCard items={inventoryAlerts} />
              <QuickActionsCard />
              <DailyGoalCard
                salesToday={dailyGoal.salesToday}
                goal={dailyGoal.goal}
                percentage={dailyGoal.percentage}
              />
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;