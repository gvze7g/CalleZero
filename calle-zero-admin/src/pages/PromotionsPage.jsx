import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/shared/StatCard";
import SectionCard from "../components/shared/SectionCard";
import StatusBadge from "../components/shared/StatusBadge";
import Modal from "../components/shared/Modal";
import usePromotions, { promoStatus } from "../hooks/usePromotions.js";

const inputClass =
    "mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none focus:border-white/30";
const labelClass = "font-[Open_Sans] text-[14px] font-bold text-white";

const discountLabel = (p) => (p.discountType === "percent" ? `${p.value}%` : `$${Number(p.value).toFixed(2)}`);

const PromotionsPage = () => {
    const {
        promotions,
        isLoading,
        stats,
        isModalOpen,
        setIsModalOpen,
        editing,
        formData,
        setField,
        isSaving,
        openCreate,
        openEdit,
        handleSubmit,
        toggleActive,
        handleDelete,
    } = usePromotions();

    return (
        <AdminLayout>
            <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="font-[Montserrat] text-[28px] font-extrabold text-white sm:text-[32px] md:text-[40px]">
                            Promociones
                        </h1>
                        <span className="rounded-full border border-white/10 px-3 py-1 font-[Open_Sans] text-[12px] text-white/35">
                            Admin
                        </span>
                    </div>
                    <p className="mt-2 font-[Open_Sans] text-[14px] text-white/72 sm:text-[15px]">
                        Crea códigos de descuento que los clientes pueden usar en el carrito.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#6F6A68] px-5 font-[Open_Sans] text-[13px] font-bold text-white transition hover:bg-[#7a7570] sm:text-[14px]"
                >
                    <Plus size={18} />
                    Nuevo Código
                </button>
            </section>

            <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <StatCard key={item.title} title={item.title} value={item.value} isLoading={isLoading} />
                ))}
            </section>

            <SectionCard className="mt-7 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left font-[Open_Sans] text-[14px]">
                        <thead className="border-b border-white/5 text-[12px] uppercase tracking-wide text-white/45">
                            <tr>
                                <th className="px-5 py-4">Código</th>
                                <th className="px-5 py-4">Descuento</th>
                                <th className="px-5 py-4">Compra mín.</th>
                                <th className="px-5 py-4">Usos</th>
                                <th className="px-5 py-4">Expira</th>
                                <th className="px-5 py-4">Estado</th>
                                <th className="px-5 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-white/50">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : promotions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-white/50">
                                        Aún no hay códigos. Crea el primero con "Nuevo Código".
                                    </td>
                                </tr>
                            ) : (
                                promotions.map((p) => {
                                    const status = promoStatus(p);
                                    return (
                                        <tr key={p._id} className="border-b border-white/5 last:border-0">
                                            <td className="px-5 py-4">
                                                <p className="font-[Montserrat] font-extrabold tracking-wider text-white">{p.code}</p>
                                                {p.description ? <p className="mt-1 text-[12px] text-white/50">{p.description}</p> : null}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-[#B56CFF]">{discountLabel(p)}</td>
                                            <td className="px-5 py-4 text-white/75">
                                                {p.minPurchase ? `$${Number(p.minPurchase).toFixed(2)}` : "—"}
                                            </td>
                                            <td className="px-5 py-4 text-white/75">
                                                {p.usedCount}
                                                {p.maxUses ? ` / ${p.maxUses}` : " / ∞"}
                                            </td>
                                            <td className="px-5 py-4 text-white/75">
                                                {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString("es-ES") : "Sin fecha"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge type={status.type}>{status.label}</StatusBadge>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        title={p.isActive ? "Desactivar" : "Activar"}
                                                        onClick={() => toggleActive(p)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                                                    >
                                                        <Power size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Editar"
                                                        onClick={() => openEdit(p)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Eliminar"
                                                        onClick={() => handleDelete(p)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#582233] text-[#FF4D73] hover:bg-[#2B1820]"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {isModalOpen && (
                <Modal title={editing ? "Editar Código" : "Nuevo Código"} onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <label className="block">
                            <span className={labelClass}>Código</span>
                            <input
                                value={formData.code}
                                onChange={(e) => setField("code", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                                maxLength={20}
                                className={`${inputClass} uppercase tracking-wider`}
                                placeholder="Ej: VERANO20"
                            />
                        </label>

                        <label className="block">
                            <span className={labelClass}>Descripción (opcional)</span>
                            <input
                                value={formData.description}
                                onChange={(e) => setField("description", e.target.value.replace(/[<>{}$\\]/g, ""))}
                                maxLength={120}
                                className={inputClass}
                                placeholder="Ej: Descuento de temporada"
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className={labelClass}>Tipo</span>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setField("discountType", e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="percent">Porcentaje (%)</option>
                                    <option value="fixed">Monto fijo ($)</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className={labelClass}>
                                    {formData.discountType === "percent" ? "Descuento (%)" : "Descuento ($)"}
                                </span>
                                <input
                                    value={formData.value}
                                    onChange={(e) => setField("value", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 8))}
                                    inputMode="decimal"
                                    className={inputClass}
                                    placeholder={formData.discountType === "percent" ? "20" : "10.00"}
                                />
                            </label>

                            <label className="block">
                                <span className={labelClass}>Compra mínima ($)</span>
                                <input
                                    value={formData.minPurchase}
                                    onChange={(e) => setField("minPurchase", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 8))}
                                    inputMode="decimal"
                                    className={inputClass}
                                    placeholder="0 = sin mínimo"
                                />
                            </label>

                            <label className="block">
                                <span className={labelClass}>Usos máximos</span>
                                <input
                                    value={formData.maxUses}
                                    onChange={(e) => setField("maxUses", e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    inputMode="numeric"
                                    className={inputClass}
                                    placeholder="0 = ilimitado"
                                />
                            </label>
                        </div>

                        <label className="block">
                            <span className={labelClass}>Fecha de expiración (opcional)</span>
                            <input
                                type="date"
                                value={formData.expiresAt}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setField("expiresAt", e.target.value)}
                                className={`${inputClass} [color-scheme:dark]`}
                            />
                        </label>

                        <label className="flex items-center gap-3 font-[Open_Sans] text-[14px] text-white">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setField("isActive", e.target.checked)}
                                className="h-4 w-4 accent-[#B56CFF]"
                            />
                            Código activo
                        </label>

                        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="h-[44px] rounded-[10px] border border-white/10 bg-black font-[Open_Sans] text-[14px] font-bold text-white transition hover:bg-white/5"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="h-[44px] rounded-[10px] bg-[#6F6A68] font-[Open_Sans] text-[14px] font-bold text-white transition hover:bg-[#7a7570] disabled:opacity-50"
                            >
                                {isSaving ? "Guardando..." : editing ? "Guardar Cambios" : "Crear Código"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
};

export default PromotionsPage;
