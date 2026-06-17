import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import useProfile from "../hooks/useProfile.js";
import {
    Bell,
    Camera,
    Mail,
    MapPin,
    Package,
    Phone,
    Save,
    ShieldCheck,
    User,
    LogOut,
} from "lucide-react";

const Profile = () => {
    const {
        isLoading,
        isSaving,
        userData,
        orderCount,
        form,
        handleChange,
        saveProfile,
        handleLogout,
        getInitials,
    } = useProfile();

    if (isLoading) {
        return (
            <div className="bg-black text-white overflow-x-hidden">
                <Navbar />
                <main className="mx-auto max-w-6xl px-6 py-14 md:px-16 min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="bg-black text-white overflow-x-hidden">
                <Navbar />
                <main className="mx-auto max-w-6xl px-6 py-14 md:px-16 min-h-screen flex items-center justify-center">
                    <p className="text-gray-400">No autenticado</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-black text-white overflow-x-hidden">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-14 md:px-16">
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#17171d] p-8 md:p-12">
                    <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-purple-500/20 blur-[90px]" />

                    <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-500 font-[Montserrat] text-3xl font-black text-black">
                                    {getInitials()}
                                </div>
                                <button 
                                    type="button"
                                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-black text-purple-500 hover:bg-purple-500 hover:text-black transition"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div>
                                <p className="font-[Open_Sans] text-xs uppercase tracking-[0.25em] text-purple-400">
                                    Mi cuenta
                                </p>
                                <h1 className="mt-2 font-[Montserrat] text-3xl font-black md:text-5xl">
                                    {form.fullName}
                                </h1>
                                <p className="mt-2 font-[Open_Sans] text-sm text-gray-400">
                                    Administra tus datos personales y preferencias de compra.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-full bg-black px-5 py-3 font-[Montserrat] text-sm text-purple-400">
                            Cliente Activo
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                    <form
                        onSubmit={saveProfile}
                        className="rounded-2xl border border-white/10 bg-[#111] p-6"
                    >
                        <h2 className="font-[Montserrat] text-2xl font-black">
                            Informacion Personal
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <label>
                                <span className="mb-2 flex items-center gap-2 font-[Open_Sans] text-sm font-bold text-gray-300">
                                    <User size={16} />
                                    Nombre completo
                                </span>
                                <input
                                    value={form.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                    disabled={isSaving}
                                    className="h-12 w-full rounded-lg border border-white/10 bg-black px-4 font-[Open_Sans] outline-none focus:border-purple-500 disabled:opacity-50"
                                />
                            </label>

                            <label>
                                <span className="mb-2 flex items-center gap-2 font-[Open_Sans] text-sm font-bold text-gray-300">
                                    <Mail size={16} />
                                    Correo electronico (no editable)
                                </span>
                                <input
                                    value={form.email}
                                    disabled
                                    className="h-12 w-full rounded-lg border border-white/10 bg-black/50 px-4 font-[Open_Sans] outline-none text-white/50 cursor-not-allowed"
                                />
                            </label>

                            <label>
                                <span className="mb-2 flex items-center gap-2 font-[Open_Sans] text-sm font-bold text-gray-300">
                                    <Phone size={16} />
                                    Telefono
                                </span>
                                <input
                                    value={form.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    disabled={isSaving}
                                    placeholder="+503 0000-0000"
                                    className="h-12 w-full rounded-lg border border-white/10 bg-black px-4 font-[Open_Sans] outline-none focus:border-purple-500 disabled:opacity-50"
                                />
                            </label>

                            <label>
                                <span className="mb-2 flex items-center gap-2 font-[Open_Sans] text-sm font-bold text-gray-300">
                                    <MapPin size={16} />
                                    Ubicacion
                                </span>
                                <input
                                    value={form.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
                                    disabled={isSaving}
                                    placeholder="Ciudad, Pais"
                                    className="h-12 w-full rounded-lg border border-white/10 bg-black px-4 font-[Open_Sans] outline-none focus:border-purple-500 disabled:opacity-50"
                                />
                            </label>
                        </div>

                        <div className="mt-7 flex gap-3">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-6 py-3 font-[Montserrat] font-bold text-black hover:bg-purple-600 transition disabled:opacity-50"
                            >
                                <Save size={17} />
                                {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-6 py-3 font-[Montserrat] font-bold text-red-400 hover:bg-red-500/10 transition"
                            >
                                <LogOut size={17} />
                                Cerrar Sesion
                            </button>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                            <h3 className="font-[Montserrat] text-xl font-black">
                                Estado de Cuenta
                            </h3>

                            <div className="mt-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-purple-500" size={20} />
                                    <div>
                                        <p className="font-[Open_Sans] text-sm font-bold">
                                            Cuenta {userData.isVerified ? "verificada" : "no verificada"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {userData.isVerified ? "Tus datos han sido confirmados." : "Verifica tu correo."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Package className="text-purple-500" size={20} />
                                    <div>
                                        <p className="font-[Open_Sans] text-sm font-bold">
                                            {orderCount} {orderCount === 1 ? "pedido realizado" : "pedidos realizados"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {orderCount > 0 ? "Gracias por tus compras." : "Aun no has realizado pedidos."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Bell className="text-purple-500" size={20} />
                                    <div>
                                        <p className="font-[Open_Sans] text-sm font-bold">
                                            Notificaciones activas
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Recibiras avisos sobre drops y pedidos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-purple-500 p-6 text-black">
                            <h3 className="font-[Montserrat] text-xl font-black">
                                Informacion de Cuenta
                            </h3>

                            <div className="mt-5 space-y-3 font-[Open_Sans] text-sm font-semibold">
                                <div>
                                    <p className="text-black/80">Usuario desde:</p>
                                    <p className="text-black/90">{new Date(userData.createdAt).toLocaleDateString("es-ES")}</p>
                                </div>

                                <div>
                                    <p className="text-black/80">Estado:</p>
                                    <p className="text-black/90">{userData.isActive ? "Activo" : "Inactivo"}</p>
                                </div>

                                <div>
                                    <p className="text-black/80">Ultima actividad:</p>
                                    <p className="text-black/90">{new Date(userData.updatedAt).toLocaleDateString("es-ES")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;