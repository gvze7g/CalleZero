import React from "react";
import { ExternalLink, Mail, MoreHorizontal, ShieldCheck } from "lucide-react";

const statusColors = {
    online: "bg-green-500",
    away: "bg-orange-500",
    offline: "bg-white/60",
    busy: "bg-rose-500",
};

const UserCard = ({ user, onViewUser }) => {
    return (
        <article className="min-w-0 rounded-[14px] border border-white/10 bg-[#1A1F2B] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="relative shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 font-[Montserrat] text-[18px] font-extrabold text-white">
                        {user.avatar}
                    </div>

                    <span
                        className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#1A1F2B] ${statusColors[user.status]
                            }`}
                    />
                </div>

                <button type="button" onClick={() => onViewUser(user)} title="Ver detalles" className="shrink-0 text-white/65 hover:text-white">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="mt-5 min-w-0">
                <h3 className="flex min-w-0 items-center gap-2 font-[Montserrat] text-[18px] font-extrabold text-white sm:text-[19px]">
                    <span className="truncate">{user.name}</span>
                    {user.role === "Administrador" ? (
                        <ShieldCheck size={15} className="shrink-0 text-white/25" />
                    ) : null}
                </h3>

                <p className="mt-2 flex min-w-0 items-center gap-2 font-[Open_Sans] text-[13px] text-white/65 sm:text-[14px]">
                    <Mail size={15} className="shrink-0" />
                    <span className="truncate">{user.email}</span>
                </p>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="w-fit rounded-full bg-white/20 px-4 py-1 font-[Open_Sans] text-[11px] font-bold text-white">
                        {user.role}
                    </span>

                    <span className="font-[Open_Sans] text-[11px] italic text-white/70">
                        {user.date}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onViewUser(user)}
                    className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-black font-[Open_Sans] text-[13px] font-bold text-white"
                >
                    <ExternalLink size={14} />
                    Detalles
                </button>
            </div>
        </article>
    );
};

export default UserCard;