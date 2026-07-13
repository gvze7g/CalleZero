import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, Search, ShoppingCart, X, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, isAuthenticated, isLoading: isLoadingUser, setUser } = useAuth();
    const { itemCount } = useCart();

    const [menuOpen, setMenuOpen] = useState(false);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const [profileOpen, setProfileOpen] = useState(false);
    const linksRef = useRef({});

    const navLinks = [
        { path: "/", label: "Inicio" },
        { path: "/products", label: "Productos" },
        { path: "/categories", label: "Categorías" },
        { path: "/contact", label: "Contacto" },
    ];

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                toast.success("Sesión cerrada");
                setUser(null);
                setProfileOpen(false);
                navigate("/");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            toast.error("Error al cerrar sesión");
        }
    };

    const getInitials = () => {
        if (!user?.fullName) return "U";
        return user.fullName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const goTo = (path) => {
        navigate(path);
        setMenuOpen(false);
        setProfileOpen(false);
    };

    useEffect(() => {
        const el = linksRef.current[location.pathname];

        if (el) {
            setIndicatorStyle({
                width: `${el.offsetWidth}px`,
                transform: `translateX(${el.offsetLeft}px)`,
            });
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [menuOpen]);

    const NavItem = ({ path, label }) => (
        <span
            ref={(el) => (linksRef.current[path] = el)}
            onClick={() => goTo(path)}
            className={`cursor-pointer py-1 transition ${location.pathname === path
                ? "text-purple-500"
                : "text-white hover:text-purple-500"
                }`}
        >
            {label}
        </span>
    );

    return (
        <>
            <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-xl">
                <div className="flex items-center justify-between px-5 py-4 md:px-8">
                    <button
                        type="button"
                        onClick={() => goTo("/")}
                        className="font-[Montserrat] text-lg font-black text-purple-500"
                    >
                        Calle Zero
                    </button>

                    <div className="relative hidden items-center gap-8 font-[Montserrat] text-sm md:flex">
                        {navLinks.map((link) => (
                            <NavItem key={link.path} {...link} />
                        ))}

                        <span
                            className="absolute bottom-0 left-0 h-[2px] rounded bg-purple-500 transition-all duration-300"
                            style={indicatorStyle}
                        />
                    </div>

                    <div className="flex items-center gap-4 text-white">
                        <button
                            type="button"
                            onClick={() => goTo("/products")}
                            className="transition hover:text-purple-500"
                        >
                            <Search size={20} strokeWidth={1.7} />
                        </button>

                        <button
                            type="button"
                            onClick={() => goTo("/cart")}
                            className="relative transition hover:text-purple-500"
                        >
                            <ShoppingCart size={20} strokeWidth={1.7} />
                            {itemCount > 0 && (
                                <span className="absolute -right-2 -top-2 rounded-full bg-purple-500 px-1.5 text-[10px] font-bold text-black">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {!isLoadingUser && isAuthenticated ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 rounded-full border border-purple-500 px-3 py-2 transition hover:bg-purple-500/10 hidden md:flex"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-black font-bold text-sm">
                                        {getInitials()}
                                    </div>
                                    <span className="text-sm text-white">{user.fullName?.split(" ")[0]}</span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-12 w-48 rounded-2xl border border-white/10 bg-[#111] shadow-[0_10px_40px_rgba(168,85,247,0.25)]">
                                        <div className="border-b border-white/10 px-4 py-3">
                                            <p className="font-bold text-white text-sm">{user.fullName}</p>
                                            <p className="text-xs text-white/50">{user.email}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => goTo("/profile")}
                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition"
                                        >
                                            <User size={16} />
                                            Mi Perfil
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition border-t border-white/10"
                                        >
                                            <LogOut size={16} />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : !isLoadingUser ? (
                            <button
                                type="button"
                                onClick={() => goTo("/login")}
                                className="hidden rounded-full border border-purple-500 px-4 py-2 font-[Montserrat] text-sm text-purple-500 transition hover:bg-purple-500 hover:text-black md:block"
                            >
                                Iniciar Sesión
                            </button>
                        ) : null}

                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#111] text-white transition hover:border-purple-500 md:hidden"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="h-[73px]" />

            {menuOpen &&
                createPortal(
                    <div className="fixed inset-0 z-9999 overflow-hidden md:hidden">
                        <div
                            onClick={() => setMenuOpen(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />

                        <aside className="absolute right-0 top-0 flex h-dvh w-[82vw] max-w-[360px] flex-col border-l border-white/10 bg-[#090909] shadow-[0_0_60px_rgba(168,85,247,0.18)]">
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div>
                                    <p className="font-[Montserrat] text-xl font-black text-purple-500">
                                        Calle Zero
                                    </p>
                                    <p className="mt-1 font-[Open_Sans] text-xs text-white/45">
                                        Minimalismo urbano
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-purple-500 hover:text-black"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-1 flex-col justify-between px-6 py-6">
                                <div className="space-y-3">
                                    {navLinks.map((link) => {
                                        const active = location.pathname === link.path;

                                        return (
                                            <button
                                                key={link.path}
                                                type="button"
                                                onClick={() => goTo(link.path)}
                                                className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-[Montserrat] text-lg font-bold transition ${active
                                                    ? "bg-purple-500 text-black"
                                                    : "bg-white/4 text-white hover:bg-white/10"
                                                    }`}
                                            >
                                                <span>{link.label}</span>
                                                <span className={active ? "text-black" : "text-purple-500"}>
                                                    →
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="space-y-3 border-t border-white/10 pt-6">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="rounded-2xl bg-purple-500/10 px-5 py-4 border border-purple-500/30">
                                                <p className="font-bold text-white text-sm">{user.fullName}</p>
                                                <p className="text-xs text-white/60">{user.email}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => goTo("/profile")}
                                                className="w-full rounded-2xl bg-purple-500 px-5 py-4 font-[Montserrat] font-bold text-black transition hover:brightness-110 flex items-center justify-center gap-2"
                                            >
                                                <User size={18} />
                                                Mi Perfil
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full rounded-2xl border border-red-500/30 px-5 py-4 font-[Montserrat] font-bold text-red-400 transition hover:bg-red-500/10 flex items-center justify-center gap-2"
                                            >
                                                <LogOut size={18} />
                                                Cerrar Sesión
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => goTo("/login")}
                                                className="w-full rounded-2xl bg-purple-500 px-5 py-4 font-[Montserrat] font-bold text-black transition hover:brightness-110"
                                            >
                                                Iniciar Sesión
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => goTo("/register")}
                                                className="w-full rounded-2xl border border-white/10 px-5 py-4 font-[Montserrat] font-bold text-white transition hover:border-purple-500 hover:text-purple-500"
                                            >
                                                Crear Cuenta
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default Navbar;