import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthLayout from "../components/auth/AuthLayout";
import logo from "../assets/logo-1.png";
import useAuth from "../hooks/useAuth";
import { apiFetch, setToken } from "../lib/api.js";
import { isEmail, MESSAGES } from "../utils/validators.js";

// Verificacion de cuenta con el codigo enviado al correo
const VerifyAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { checkAuth } = useAuth();

    const [email, setEmail] = useState(location.state?.email || "");
    const [codeSent, setCodeSent] = useState(Boolean(location.state?.email));
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const cleanEmail = email.trim().toLowerCase();

    const sendCode = async (event) => {
        event?.preventDefault();
        if (!isEmail(cleanEmail)) {
            toast.error(MESSAGES.email);
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiFetch("/api/registerUser/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: cleanEmail }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "No se pudo enviar el código");
                return;
            }
            toast.success("Código enviado a tu correo");
            setCodeSent(true);
        } catch {
            toast.error("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const verify = async (event) => {
        event.preventDefault();
        if (!/^\d{6}$/.test(code)) {
            toast.error("El código debe tener 6 dígitos");
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiFetch("/api/registerUser/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: cleanEmail, code }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Código incorrecto");
                return;
            }

            toast.success("¡Cuenta verificada!");
            if (data.token) {
                setToken(data.token);
                await checkAuth();
                setTimeout(() => navigate("/"), 600);
            } else {
                setTimeout(() => navigate("/login"), 600);
            }
        } catch {
            toast.error("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form
                onSubmit={codeSent ? verify : sendCode}
                className="w-[90%] max-w-sm rounded-2xl bg-[#111]/95 p-6 shadow-[0_10px_40px_rgba(168,85,247,0.25)] backdrop-blur-md sm:p-8"
            >
                <div className="mb-6 flex flex-col items-center">
                    <img src={logo} className="mb-2 w-14 sm:w-16" alt="Calle Zero" />
                    <h3 className="font-[Montserrat] text-lg font-semibold text-purple-500">Calle Zero</h3>
                </div>

                <h2 className="text-center font-[Montserrat] text-xl font-bold text-white">Verificar Cuenta</h2>

                <p className="mb-6 text-center text-sm text-gray-400">
                    {codeSent
                        ? `Ingresa el código de 6 dígitos que enviamos a ${cleanEmail}`
                        : "Escribe tu correo y te enviaremos un código para verificar tu cuenta"}
                </p>

                <div className="space-y-4">
                    {codeSent ? (
                        <Input
                            label="Código de verificación"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="000000"
                        />
                    ) : (
                        <Input
                            label="Correo electrónico"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.replace(/\s/g, "").slice(0, 100))}
                            placeholder="tu@correo.com"
                        />
                    )}
                </div>

                <div className="mt-6">
                    <Button
                        text={isLoading ? "Cargando..." : codeSent ? "Verificar Cuenta" : "Enviar Código"}
                        type="submit"
                        disabled={isLoading}
                    />
                </div>

                {codeSent && (
                    <p
                        onClick={() => !isLoading && sendCode()}
                        className="mt-4 cursor-pointer text-center text-xs text-gray-500 hover:text-purple-400"
                    >
                        ¿No te llegó? <span className="font-bold text-purple-400">Reenviar código</span>
                    </p>
                )}

                <p
                    onClick={() => navigate("/login")}
                    className="mt-3 cursor-pointer text-center text-xs text-gray-500 hover:text-purple-400"
                >
                    Volver a iniciar sesión
                </p>
            </form>
        </AuthLayout>
    );
};

export default VerifyAccount;
