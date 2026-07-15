import React from "react";
import * as Icons from "lucide-react";
import { LogOut, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-1.png";

const sidebarLinks = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  {
    key: "products",
    label: "Productos",
    icon: "Box",
    path: "/products",
  },
  {
    key: "add-product",
    label: "Agregar Producto",
    icon: "CirclePlus",
    path: "/add-product",
  },
  {
    key: "categories",
    label: "Categorías",
    icon: "Tags",
    path: "/categories",
  },
  {
    key: "orders",
    label: "Pedidos",
    icon: "ShoppingCart",
    path: "/orders",
  },
  {
    key: "users",
    label: "Usuarios",
    icon: "Users",
    path: "/users",
  },
];

const Sidebar = ({ isSidebarOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
      await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/login");
      onClose();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {isSidebarOpen ? (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[285px] flex-col border-r border-[#1A1930] bg-black transition-transform duration-300 lg:static lg:w-[245px] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[86px] items-center justify-between border-b border-[#1A1930] px-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Calle Zero"
              className="h-11 w-11 object-contain"
            />
            <span className="font-[Montserrat] text-[19px] font-extrabold text-white/75">
              Calle Zero Admin
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6">
          <div className="space-y-2">
            {sidebarLinks.map((link) => {
              const IconComponent = Icons[link.icon] || Icons.Circle;

              return (
                <NavLink
                  key={link.key}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-[#ECE6F0] text-[#7C3AED]"
                        : "text-white/80 hover:bg-white/5"
                    }`
                  }
                >
                  <IconComponent size={18} strokeWidth={2} />
                  <span className="font-[Open_Sans] text-[15px] font-semibold">
                    {link.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#1A1930] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-white/85 transition hover:bg-white/5"
          >
            <LogOut size={18} strokeWidth={2} />
            <span className="font-[Open_Sans] text-[15px] font-semibold">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;