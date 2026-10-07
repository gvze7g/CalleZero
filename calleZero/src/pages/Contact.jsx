import { useState } from "react";
import { toast } from "sonner";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ContactInfoCard from "../components/contact/ContactInfoCard";
import { Mail, MessageCircle, Globe, Camera, X } from "lucide-react";
import { apiFetch } from "../lib/api.js";
import { isEmail, isName, isSafeText, MESSAGES } from "../utils/validators.js";

// Solo se permite escribir lo valido en cada campo
const sanitize = {
    name: (v) => v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g, "").slice(0, 50),
    email: (v) => v.replace(/\s/g, "").slice(0, 100),
    subject: (v) => v.replace(/[<>{}$\\]/g, "").slice(0, 80),
    message: (v) => v.replace(/[<>{}$\\]/g, "").slice(0, 1000),
};

const SOCIALS = {
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
    facebook: "https://www.facebook.com/",
};

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isSending, setIsSending] = useState(false);

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: sanitize[field] ? sanitize[field](value) : value,
        }));
    };

    // Envia el mensaje con POST /api/contact
    const handleSubmit = async () => {
        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.subject.trim() ||
            !form.message.trim()
        ) {
            toast.error("Debes completar todos los campos");
            return;
        }
        if (!isName(form.name)) return toast.error(MESSAGES.name);
        if (!isEmail(form.email)) return toast.error(MESSAGES.email);
        if (!isSafeText(form.subject, 3, 80)) return toast.error("El asunto debe tener entre 3 y 80 caracteres");
        if (!isSafeText(form.message, 10, 1000)) return toast.error("El mensaje debe tener entre 10 y 1000 caracteres");

        setIsSending(true);
        try {
            const res = await apiFetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message);

            toast.success(data.message || "Mensaje enviado correctamente");
            setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            toast.error(error.message || "No se pudo enviar el mensaje");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-black text-white overflow-x-hidden">
            <Navbar />

            <section className="grid gap-10 px-4 py-10 sm:px-6 md:px-10 md:py-14 lg:grid-cols-2 lg:px-16">
                <div>
                    <h1 className="font-[Montserrat] text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl">
                        CONTACTO
                    </h1>

                    <p className="mt-4 max-w-md font-[Open_Sans] text-sm text-gray-400 sm:text-base">
                        Estamos aquí para ayudarte. Escríbenos y nuestro equipo se pondrá en contacto contigo en menos de 24 horas.
                    </p>

                    <div className="mt-8 space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <input
                                value={form.name}
                                onChange={(event) => handleChange("name", event.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none focus:border-purple-500 sm:text-base"
                                placeholder="Ej. Alex Zero"
                            />

                            <input
                                value={form.email}
                                onChange={(event) => handleChange("email", event.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none focus:border-purple-500 sm:text-base"
                                placeholder="alex@callezero.com"
                                type="email"
                            />
                        </div>

                        <input
                            value={form.subject}
                            onChange={(event) => handleChange("subject", event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none focus:border-purple-500 sm:text-base"
                            placeholder="¿En qué podemos ayudarte?"
                        />

                        <textarea
                            value={form.message}
                            onChange={(event) => handleChange("message", event.target.value)}
                            rows="5"
                            className="w-full resize-none rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none focus:border-purple-500 sm:text-base"
                            placeholder="Cuéntanos más detalles..."
                        />

                        <p className="text-right font-[Open_Sans] text-xs text-gray-500">{form.message.length}/1000</p>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSending}
                            className="w-full rounded-lg bg-purple-500 px-6 py-3 font-[Montserrat] text-sm font-semibold text-black disabled:opacity-50 sm:w-auto sm:text-base"
                        >
                            {isSending ? "Enviando..." : "Enviar Mensaje →"}
                        </button>
                    </div>
                </div>

                <div className="space-y-8 rounded-2xl bg-[#111] p-5 sm:p-6">
                    <div>
                        <h2 className="mb-4 font-[Montserrat] text-lg font-bold sm:text-xl">
                            Canales Directos
                        </h2>

                        <div className="space-y-5 text-sm sm:text-base">
                            <ContactInfoCard
                                icon={Mail}
                                title="CORREO ELECTRÓNICO"
                                text="soporte@callezero.com"
                            />

                            <ContactInfoCard
                                icon={MessageCircle}
                                title="CHAT EN VIVO"
                                text="Disponible Lun-Vie"
                            />

                            <ContactInfoCard
                                icon={Globe}
                                title="PRENSA Y COLABORACIONES"
                                text="media@callezero.com"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-3 font-[Montserrat] text-base font-bold sm:text-lg">
                            Nuestra Comunidad
                        </h2>

                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => window.open(SOCIALS.instagram, "_blank", "noopener")} className="flex items-center gap-2 rounded-full border border-purple-500 px-4 py-2 text-xs text-purple-500 transition hover:bg-purple-500 hover:text-black sm:text-sm">
                                <Camera size={16} />
                                Instagram
                            </button>

                            <button type="button" onClick={() => window.open(SOCIALS.x, "_blank", "noopener")} className="flex items-center gap-2 rounded-full border border-purple-500 px-4 py-2 text-xs text-purple-500 transition hover:bg-purple-500 hover:text-black sm:text-sm">
                                <X size={16} />
                                X
                            </button>

                            <button type="button" onClick={() => window.open(SOCIALS.facebook, "_blank", "noopener")} className="flex items-center gap-2 rounded-full border border-purple-500 px-4 py-2 text-xs text-purple-500 transition hover:bg-purple-500 hover:text-black sm:text-sm">
                                <span className="font-bold">F</span>
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;