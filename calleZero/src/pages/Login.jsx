import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthLayout from "../components/auth/AuthLayout";
import AuthFooterText from "../components/auth/AuthFooterText";
import logo from "../assets/logo-1.png";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const {
    navigate,
    isLoading,
    showForgotPassword,
    setShowForgotPassword,
    forgotStep,
    setForgotStep,
    form,
    forgotForm,
    setForgotForm,
    handleChange,
    handleForgotChange,
    handleLogin,
    handleForgotStep1,
    handleForgotStep2,
  } = useLogin();

  if (showForgotPassword) {
    return (
      <AuthLayout>
        <form
          onSubmit={forgotStep === 1 ? handleForgotStep1 : handleForgotStep2}
          className="w-[90%] max-w-sm rounded-2xl bg-[#111]/95 p-6 shadow-[0_10px_40px_rgba(168,85,247,0.25)] backdrop-blur-md sm:p-8"
        >
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} className="mb-2 w-14 sm:w-16" alt="Calle Zero" />
            <h3 className="font-[Montserrat] text-lg font-semibold text-purple-500">
              Calle Zero
            </h3>
          </div>

          <h2 className="text-center font-[Montserrat] text-xl font-bold text-white">
            Recuperar Contraseña
          </h2>

          <p className="mb-6 text-center text-sm text-gray-400">
            {forgotStep === 1
              ? "Ingresa tu correo para recibir un codigo"
              : "Ingresa el codigo y tu nueva contraseña"}
          </p>

          <div className="space-y-4">
            {forgotStep === 1 ? (
              <Input
                label="Correo"
                name="email"
                type="email"
                value={forgotForm.email}
                onChange={handleForgotChange}
                disabled={isLoading}
              />
            ) : (
              <>
                <Input
                  label="Codigo de Verificacion"
                  name="code"
                  type="text"
                  value={forgotForm.code}
                  onChange={handleForgotChange}
                  disabled={isLoading}
                  placeholder="Ingresa el codigo recibido"
                />
                <Input
                  label="Nueva Contraseña"
                  name="newPassword"
                  type="password"
                  value={forgotForm.newPassword}
                  onChange={handleForgotChange}
                  disabled={isLoading}
                />
                <Input
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  value={forgotForm.confirmPassword}
                  onChange={handleForgotChange}
                  disabled={isLoading}
                />
              </>
            )}
          </div>

          <Button
            text={isLoading ? "Cargando..." : forgotStep === 1 ? "Enviar Codigo" : "Actualizar Contraseña"}
            type="submit"
            disabled={isLoading}
          />

          <p
            onClick={() => {
              setShowForgotPassword(false);
              setForgotStep(1);
              setForgotForm({ email: "", code: "", newPassword: "", confirmPassword: "" });
            }}
            className="mt-4 cursor-pointer text-center text-xs text-gray-500 hover:text-purple-400"
          >
            Volver al login
          </p>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleLogin}
        className="w-[90%] max-w-sm rounded-2xl bg-[#111]/95 p-6 shadow-[0_10px_40px_rgba(168,85,247,0.25)] backdrop-blur-md sm:p-8"
      >
        <div className="mb-6 flex flex-col items-center">
          <img src={logo} className="mb-2 w-14 sm:w-16" alt="Calle Zero" />
          <h3 className="font-[Montserrat] text-lg font-semibold text-purple-500">
            Calle Zero
          </h3>
        </div>

        <h2 className="text-center font-[Montserrat] text-xl font-bold text-white">
          Bienvenido de nuevo
        </h2>

        <p className="mb-6 text-center text-sm text-gray-400">
          Accede a tu cuenta
        </p>

        <div className="space-y-4">
          <Input
            label="Correo Electronico"
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
        </div>

        <Button
          text={isLoading ? "Cargando..." : "Iniciar Sesion"}
          type="submit"
          disabled={isLoading}
        />

        <p
          onClick={() => setShowForgotPassword(true)}
          className="mt-3 cursor-pointer text-center text-xs text-gray-500 hover:text-purple-400"
        >
          Olvidaste tu contraseña?
        </p>

        <AuthFooterText
          text="No tienes cuenta?"
          actionText="Crear cuenta"
          onClick={() => navigate("/register")}
        />

        <p
          onClick={() => navigate("/")}
          className="mt-3 cursor-pointer text-center text-xs text-gray-500 hover:text-purple-400"
        >
          Volver a la tienda
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;