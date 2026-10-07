import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Package, Sparkles, Tag } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";

const ICONS = { order: Package, promo: Tag, system: Sparkles };

// Tiempo relativo corto
const timeAgo = (date) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return "ahora";
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    return new Date(date).toLocaleDateString("es-ES");
};

// Campana con las notificaciones del cliente
const NotificationBell = () => {
    const navigate = useNavigate();
    const { notifications, unread, markRead, markAllRead } = useNotifications(true);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Cierra al hacer clic fuera
    useEffect(() => {
        if (!open) return undefined;
        const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    const openItem = (item) => {
        markRead(item);
        setOpen(false);
        if (item.type === "order") navigate("/profile");
        if (item.type === "promo") navigate("/cart");
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative transition hover:text-purple-500"
                title="Notificaciones"
            >
                <Bell size={20} strokeWidth={1.7} />
                {unread > 0 && (
                    <span className="absolute -right-2 -top-2 rounded-full bg-purple-500 px-1.5 text-[10px] font-bold text-black">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-10 z-50 w-[300px] rounded-2xl border border-white/10 bg-[#111] p-3 shadow-[0_10px_40px_rgba(168,85,247,0.25)] sm:w-[340px]">
                    <div className="flex items-start justify-between gap-3 border-b border-white/10 px-2 pb-3">
                        <div>
                            <p className="font-[Montserrat] text-sm font-bold text-white">Notificaciones</p>
                            <p className="text-xs text-white/50">{unread ? `${unread} sin leer` : "Estás al día"}</p>
                        </div>
                        {unread > 0 && (
                            <button
                                type="button"
                                onClick={markAllRead}
                                className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300"
                            >
                                <CheckCheck size={14} />
                                Marcar leídas
                            </button>
                        )}
                    </div>

                    <div className="mt-2 max-h-[340px] space-y-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="px-2 py-6 text-center text-sm text-white/50">No tienes notificaciones.</p>
                        ) : (
                            notifications.map((item) => {
                                const Icon = ICONS[item.type] || Bell;
                                return (
                                    <button
                                        type="button"
                                        key={item._id}
                                        onClick={() => openItem(item)}
                                        className={`flex w-full gap-3 rounded-xl p-3 text-left transition hover:bg-white/5 ${item.read ? "" : "bg-purple-500/10"}`}
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-purple-400">
                                            <Icon size={15} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center justify-between gap-2">
                                                <span className="truncate text-sm font-bold text-white">{item.title}</span>
                                                <span className="shrink-0 text-[10px] text-white/40">{timeAgo(item.createdAt)}</span>
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-white/60">{item.message}</span>
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
