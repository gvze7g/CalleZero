import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [stats, setStats] = useState({});

  const [activeTab, setActiveTab] = useState("Todos");

  const [currentPage, setCurrentPage] = useState(1);

  const [sortMode, setSortMode] = useState("name");

  const [selectedUser, setSelectedUser] = useState(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/admin/users",
        { method: "GET" ,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Error al cargar usuarios");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      setRoles(["Administrador", "Cliente"]);
    } catch (error) {
      console.error(error);
      setRoles(["Administrador", "Cliente"]);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/users/stats",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (activeTab === "Administradores") {
      result = result.filter(
        (user) => user.role === "Administrador"
      );
    }

    if (activeTab === "Clientes") {
      result = result.filter(
        (user) => user.role === "Cliente"
      );
    }

    if (sortMode === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortMode === "role") {
      result.sort((a, b) =>
        a.role.localeCompare(b.role)
      );
    }

    return result;
  }, [users, activeTab, sortMode]);

  const openCreateModal = () => {
    setEditingUser(null);

    setFormData({
      fullName: "",
      email: "",
      role: roles[0] || "Cliente",
    });

    setIsUserModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setFormData({
      fullName: user.name,
      email: user.email,
      role: user.role,
    });

    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleSubmitUser = async (event) => {
    event.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim()
    ) {
      toast.error("Debes completar nombre y correo");
      return;
    }

    if (!formData.role) {
      toast.error("Debes seleccionar un rol");
      return;
    }

    try {
      let response;

      if (editingUser) {
        response = await fetch(
          `http://localhost:4000/api/admin/users/${editingUser._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              role: formData.role,
            }),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:4000/api/admin/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              role: formData.role,
            }),
          }
        );
      }

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingUser
            ? "Usuario actualizado correctamente"
            : "Usuario creado correctamente"
        );

        setIsUserModalOpen(false);

        loadUsers();
        loadStats();
      } else {
        toast.error(
          data.message || "Error al procesar el usuario"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/admin/users/${user._id}`,
        {
          method: "DELETE",
          credentials: "include", 
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Usuario eliminado");

        setSelectedUser(null);

        loadUsers();
        loadStats();
      } else {
        toast.error(
          data.message || "Error al eliminar usuario"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  const handleSort = () => {
    const nextSort =
      sortMode === "name" ? "role" : "name";

    setSortMode(nextSort);

    toast.info(
      nextSort === "name"
        ? "Usuarios ordenados por nombre"
        : "Usuarios ordenados por rol"
    );
  };

  const userStats = [
    {
      title: "Total de Usuarios",
      value: stats.totalUsers || 0,
      percentage: "+12%",
    },
    {
      title: "Usuarios Activos",
      value: stats.activeUsers || 0,
      percentage: "+5%",
    },
    {
      title: "Administradores",
      value: stats.admins || 0,
      percentage: "",
    },
  ];

  return {
    users,
    roles,
    stats,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    selectedUser,
    setSelectedUser,
    isUserModalOpen,
    setIsUserModalOpen,
    editingUser,
    loading,
    formData,
    setFormData,
    filteredUsers,
    userStats,
    openCreateModal,
    openEditModal,
    handleSubmitUser,
    handleDeleteUser,
    handleSort,
  };
};

export default useUsers;