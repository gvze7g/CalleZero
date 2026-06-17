import { Save, ShieldCheck, User, Mail, Phone, MapPin, Loader } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import SectionCard from "../components/shared/SectionCard";
import useProfile from "../hooks/useProfile";

const ProfilePage = () => {
    const {
        formData,
        isLoading,
        isSaving,
        handleChange,
        handleSubmit,
        getInitials,
    } = useProfile();

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <section className="mx-auto max-w-[920px]">
                <div>
                    <p className="font-[Open_Sans] text-[13px] font-bold uppercase tracking-[0.22em] text-white/35">
                        Cuenta administrativa
                    </p>

                    <h1 className="mt-2 font-[Montserrat] text-[28px] font-extrabold text-white sm:text-[32px] md:text-[40px]">
                        Mi Perfil
                    </h1>

                    <p className="mt-2 font-[Open_Sans] text-[14px] text-white/72 sm:text-[15px]">
                        Administra tu información personal y los datos visibles dentro del panel.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
                    {/* TARJETA DE PERFIL */}
                    <SectionCard className="p-5 text-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6F6A68] to-[#5a5551] font-[Montserrat] text-[28px] font-extrabold text-white">
                            {getInitials()}
                        </div>

                        <h2 className="mt-5 font-[Montserrat] text-[20px] font-extrabold text-white line-clamp-2">
                            {formData.fullName || "Admin"}
                        </h2>

                        <p className="mt-2 font-[Open_Sans] text-[13px] text-white/60 break-all">
                            {formData.email || "Sin datos"}
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-[Open_Sans] text-[12px] font-bold text-white">
                            <ShieldCheck size={15} />
                            Acceso completo
                        </div>

                        <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
                            {formData.phone && (
                                <div className="text-left">
                                    <p className="text-[11px] text-white/50 uppercase">Teléfono</p>
                                    <p className="mt-1 text-[13px] text-white">{formData.phone}</p>
                                </div>
                            )}
                            {formData.location && (
                                <div className="text-left">
                                    <p className="text-[11px] text-white/50 uppercase">Ubicación</p>
                                    <p className="mt-1 text-[13px] text-white">{formData.location}</p>
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    {/* FORMULARIO */}
                    <SectionCard className="p-5">
                        <h3 className="font-[Montserrat] text-[18px] font-extrabold text-white sm:text-[20px]">
                            Información del Perfil
                        </h3>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <label className="block">
                                <span className="flex items-center gap-2 font-[Open_Sans] text-[13px] font-bold text-white sm:text-[14px]">
                                    <User size={15} />
                                    Nombre
                                </span>
                                <input
                                    value={formData.fullName}
                                    onChange={(event) =>
                                        handleChange("fullName", event.target.value)
                                    }
                                    className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none focus:border-white/30 transition"
                                    placeholder="Tu nombre completo"
                                    disabled={isSaving}
                                />
                            </label>

                            <label className="block">
                                <span className="flex items-center gap-2 font-[Open_Sans] text-[13px] font-bold text-white sm:text-[14px]">
                                    <Mail size={15} />
                                    Correo (no editable)
                                </span>
                                <input
                                    value={formData.email}
                                    disabled
                                    className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black/50 px-4 font-[Open_Sans] text-white/50 outline-none cursor-not-allowed"
                                />
                            </label>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="flex items-center gap-2 font-[Open_Sans] text-[13px] font-bold text-white sm:text-[14px]">
                                        <Phone size={15} />
                                        Teléfono
                                    </span>
                                    <input
                                        value={formData.phone}
                                        onChange={(event) =>
                                            handleChange("phone", event.target.value)
                                        }
                                        className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none focus:border-white/30 transition"
                                        placeholder="+503 0000-0000"
                                        disabled={isSaving}
                                    />
                                </label>

                                <label className="block">
                                    <span className="flex items-center gap-2 font-[Open_Sans] text-[13px] font-bold text-white sm:text-[14px]">
                                        <MapPin size={15} />
                                        Ubicación
                                    </span>
                                    <input
                                        value={formData.location}
                                        onChange={(event) =>
                                            handleChange("location", event.target.value)
                                        }
                                        className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none focus:border-white/30 transition"
                                        placeholder="Ciudad, País"
                                        disabled={isSaving}
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#6F6A68] px-5 font-[Open_Sans] text-[13px] font-bold text-white transition hover:bg-[#7a7570] disabled:opacity-50 disabled:cursor-not-allowed sm:text-[14px]"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader size={17} className="animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={17} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </form>
                    </SectionCard>
                </div>
            </section>
        </AdminLayout>
    );
};

export default ProfilePage;