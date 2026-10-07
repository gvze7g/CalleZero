import React, { useState, useEffect } from "react";
import { Bell, Menu, Search, Package, ShoppingCart, UserPlus, TicketPercent, Sparkles, CheckCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../lib/api.js";
import useNotifications from "../../hooks/useNotifications.js";

const ICONS = {
  stock: Package,
  order: ShoppingCart,
  user: UserPlus,
  promo: TicketPercent,
  system: Sparkles,
};

// Tiempo relativo corto
const timeAgo = (date) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return new Date(date).toLocaleDateString("es-ES");
};

const Topbar = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unread, markRead, markAllRead } = useNotifications();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  // Busca productos por nombre, SKU o categoria
  const handleSearch = (event) => {
    event.preventDefault();
    const q = search.replace(/[<>{}$\\]/g, "").trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  const openNotification = (item) => {
    markRead(item);
    setIsNotificationsOpen(false);
    if (item.link) navigate(item.link);
  };
  const [userData, setUserData] = useState({
    fullName: "Admin Calle Zero",
    email: "admin@callezero.com",
    initials: "AC",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await apiFetch("/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("No se pudo cargar usuario");
        return;
      }

      const data = await response.json();

      const fullName = data.fullName || data.name || "Admin Calle Zero";
      const initials = fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      setUserData({
        fullName: fullName,
        email: data.email || "admin@callezero.com",
        initials: initials,
      });
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
    }
  };

  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between gap-3 border-b border-[#1A1930] px-4 md:h-[86px] md:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-[#11151D] text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearch} className="relative min-w-0 flex-1 sm:max-w-[280px]">
          <Search
            size={17}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value.slice(0, 60))}
            placeholder="Buscar productos..."
            className="h-[38px] w-full rounded-[8px] border border-white/5 bg-[#222838] pl-10 pr-4 font-[Open_Sans] text-[14px] text-white outline-none placeholder:text-white/45"
          />
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative text-white"
          >
            <Bell size={19} strokeWidth={2} />
            {unread > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B56CFF] px-1 font-[Open_Sans] text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </button>

          {isNotificationsOpen ? (
            <div className="absolute right-0 z-50 mt-4 w-[290px] rounded-[14px] border border-white/10 bg-[#151A24] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:w-[340px]">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 px-2 pb-3">
                <div>
                  <h3 className="font-[Montserrat] text-[16px] font-extrabold text-white">
                    Notificaciones
                  </h3>
                  <p className="mt-1 font-[Open_Sans] text-[12px] text-white/55">
                    {unread ? `${unread} sin leer` : "Actividad reciente del panel."}
                  </p>
                </div>
                {unread > 0 ? (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="flex items-center gap-1 font-[Open_Sans] text-[12px] font-bold text-[#B56CFF] hover:text-[#C891FF]"
                  >
                    <CheckCheck size={14} />
                    Marcar leídas
                  </button>
                ) : null}
              </div>

              <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-2 py-6 text-center font-[Open_Sans] text-[13px] text-white/50">
                    No hay notificaciones todavía.
                  </p>
                ) : (
                  notifications.map((item) => {
                    const Icon = ICONS[item.type] || Bell;

                    return (
                      <button
                        type="button"
                        key={item._id}
                        onClick={() => openNotification(item)}
                        className={`flex w-full gap-3 rounded-[10px] p-3 text-left transition hover:bg-white/5 ${item.read ? "bg-black/20" : "bg-[#2D2140]/60"}`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#B56CFF]">
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-[Open_Sans] text-[13px] font-bold text-white">
                              {item.title}
                            </p>
                            <span className="shrink-0 font-[Open_Sans] text-[11px] text-white/40">
                              {timeAgo(item.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 font-[Open_Sans] text-[12px] leading-5 text-white/60">
                            {item.message}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden h-10 w-px bg-[#1A1930] md:block" />

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 rounded-[10px] px-2 py-1 transition hover:bg-white/5"
        >
          <div className="hidden text-right leading-tight sm:block">
            <p className="font-[Open_Sans] text-[14px] font-bold text-white line-clamp-1">
              {userData.fullName}
            </p>
            <p className="font-[Open_Sans] text-[13px] text-white/60">
              {userData.email}
            </p>
          </div>

          <div className="relative">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6F6A68] to-[#5a5551] font-bold text-white">
              {userData.initials}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-green-500" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Topbar;