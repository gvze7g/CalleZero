import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthLayout from "../components/auth/AuthLayout";
import AuthFooterText from "../components/auth/AuthFooterText";
import logo from "../assets/logo-1.png";
import useRegister from "../hooks/useRegister";

const Register = () => {
    const {
        navigate,
        isLoading,
        form,
        handleChange,
        handleRegister,
    } = useRegister();

    return (
        <AuthLayout>
            <div
                onClick={() => navigate("/")}
                className="absolute left-4 top-4 z-20 cursor-pointer text-[10px] text-white hover:text-purple-400 sm:left-6 sm:top-6 sm:text-xs"
            >
                VOLVER AL INICIO
            </div>

            <form
                onSubmit={handleRegister}
                className="w-[90%] max-w-sm rounded-2xl bg-[#111]/95 p-6 shadow-[0_10px_40px_rgba(168,85,247,0.25)] backdrop-blur-md sm:p-8"
            >
                <div className="mb-6 flex flex-col items-center">
                    <img src={logo} className="mb-2 w-14 sm:w-16" alt="Calle Zero" />
                    <h3 className="font-[Montserrat] text-lg font-semibold text-purple-500">
                        Calle Zero
                    </h3>
                </div>

                <h2 className="text-center font-[Montserrat] text-xl font-bold text-white">
                    Crear Cuenta
                </h2>

                <p className="mb-6 text-center text-sm text-gray-400">
                    Únete al movimiento urbano
                </p>

                <div className="space-y-4">
                    <Input
                        label="Nombre Completo"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        disabled={isLoading}
                    />

                    <Input
                        label="Correo"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />

                    <Input
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />

                    <Input
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <input
                        type="checkbox"
                        name="accepted"
                        checked={form.accepted}
                        onChange={handleChange}
                        className="accent-purple-500"
                        disabled={isLoading}
                    />
                    <span>Acepto terminos y condiciones</span>
                </div>

                <Button
                    text={isLoading ? "Cargando..." : "Registrarse"}
                    type="submit"
                    disabled={isLoading}
                />

                <AuthFooterText
                    text="Ya tienes cuenta?"
                    actionText="Inicia sesion"
                    onClick={() => navigate("/login")}
                />
            </form>
        </AuthLayout>
    );
};

export default Register;