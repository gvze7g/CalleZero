import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import useCart from "../hooks/useCart";
import useCheckout from "../hooks/useCheckout";
import useFeaturedProducts from "../hooks/useFeaturedProducts";
import useAuth from "../hooks/useAuth";
import {
    Shield,
    Truck,
    RotateCcw,
    Trash2,
    CreditCard,
    X,
} from "lucide-react";

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const {
        cart,
        updateQuantity,
        removeItem,
        clearCart,
        addToCart,
        subtotal,
        taxes,
        total,
    } = useCart();

    const {
        isCheckoutOpen,
        isSubmitting,
        checkoutForm,
        handleCheckoutChange,
        openCheckout,
        closeCheckout,
        submitCheckout,
    } = useCheckout({ cart, total, clearCart });

    const { products: suggestedProducts } = useFeaturedProducts(4);

    const handleRemove = (productId, size) => {
        removeItem(productId, size);
        toast.error("Producto eliminado del carrito");
    };

    const handleAddSuggested = (item) => {
        if (!isAuthenticated) {
            toast.error("Debes iniciar sesión para agregar productos al carrito");
            navigate("/login");
            return;
        }

        addToCart(item, item.size?.[0] || "Única");
        toast.success(`${item.name} añadido`);
    };

    return (
        <div className="bg-black text-white overflow-x-hidden">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-16 md:px-16">
                <button
                    onClick={() => navigate("/products")}
                    className="font-[Open_Sans] text-sm text-gray-400 hover:text-purple-400"
                >
                    ← Continuar Comprando
                </button>

                <div className="mt-8 flex items-end justify-between border-b border-white/10 pb-6">
                    <h1 className="font-[Montserrat] text-4xl font-black md:text-5xl">
                        TU CARRITO
                    </h1>
                    <p className="font-[Montserrat] text-gray-400">
                        {cart.length} Artículos
                    </p>
                </div>

                <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
                    <div>
                        <div className="space-y-6">
                            {cart.length === 0 ? (
                                <div className="rounded-xl border border-white/10 bg-[#111] p-8 text-center">
                                    <p className="font-[Montserrat] text-xl font-bold">
                                        Tu carrito está vacío
                                    </p>
                                    <button
                                        onClick={() => navigate("/products")}
                                        className="mt-5 rounded-lg bg-purple-500 px-6 py-3 font-[Montserrat] font-bold text-black"
                                    >
                                        Ir a productos
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.size}`}
                                        className="grid gap-4 border-b border-white/10 pb-6 sm:grid-cols-[130px_1fr_auto]"
                                    >
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-32 w-32 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="h-32 w-32 rounded-xl bg-[#222]" />
                                        )}

                                        <div>
                                            <h3 className="font-[Montserrat] text-xl font-black">
                                                {item.name}
                                            </h3>

                                            <span className="mt-2 inline-block rounded-full border border-white/10 px-3 py-1 font-[Open_Sans] text-xs">
                                                Talla: {item.size}
                                            </span>

                                            <div className="mt-3 flex w-fit items-center rounded-full border border-white/10 bg-black">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.productId, item.size, "decrease")
                                                    }
                                                    className="px-3 py-1"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4">{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.productId, item.size, "increase")
                                                    }
                                                    className="px-3 py-1"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-row justify-between gap-5 sm:flex-col sm:items-end">
                                            <p className="font-[Montserrat] text-lg font-bold">
                                                ${item.price.toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => handleRemove(item.productId, item.size)}
                                                className="flex items-center gap-2 font-[Open_Sans] text-xs text-gray-400 hover:text-red-400"
                                            >
                                                <Trash2 size={14} />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-10 grid gap-5 border-b border-white/10 pb-10 md:grid-cols-3">
                            <div className="flex gap-3">
                                <Truck className="text-purple-500" />
                                <div>
                                    <h4 className="font-[Montserrat] text-sm font-bold">ENVÍO GRATUITO</h4>
                                    <p className="text-xs text-gray-400">En pedidos superiores a $150</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Shield className="text-purple-500" />
                                <div>
                                    <h4 className="font-[Montserrat] text-sm font-bold">PAGO SEGURO</h4>
                                    <p className="text-xs text-gray-400">Encriptación SSL 256 bits</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <RotateCcw className="text-purple-500" />
                                <div>
                                    <h4 className="font-[Montserrat] text-sm font-bold">30 DÍAS DE DEVOLUCIÓN</h4>
                                    <p className="text-xs text-gray-400">Garantía total</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <div className="rounded-xl bg-[#1B1B22] p-6">
                            <h3 className="mb-6 font-[Montserrat] text-sm font-bold uppercase tracking-[0.25em]">
                                Resumen del Pedido
                            </h3>

                            <div className="space-y-4 font-[Open_Sans] text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <strong>${subtotal.toFixed(2)}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Envío</span>
                                    <strong>Gratis</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Impuestos</span>
                                    <strong>${taxes.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                                <span className="font-[Montserrat] text-xl font-black">TOTAL</span>
                                <span className="font-[Montserrat] text-3xl font-black text-purple-500">
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={openCheckout}
                                className="mt-6 w-full rounded-lg bg-purple-500 py-4 font-[Montserrat] font-bold text-black"
                            >
                                Finalizar Compra
                            </button>

                            <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
                                <CreditCard size={16} />
                                VISA · MASTERCARD · AMEX · PAYPAL
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#0D0D10] p-6">
                            <h4 className="font-[Montserrat] font-bold">¿NECESITAS AYUDA?</h4>
                            <p className="mt-3 font-[Open_Sans] text-sm text-gray-400">
                                Estamos aquí para ayudarte con tu pedido.
                            </p>
                            <button
                                onClick={() => navigate("/contact")}
                                className="mt-4 font-[Montserrat] text-sm font-bold text-purple-500"
                            >
                                Contactar Soporte
                            </button>
                        </div>
                    </aside>
                </section>

                <section className="mt-16 border-t border-white/10 pt-14">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="font-[Montserrat] text-2xl font-black">COMPLETA TU LOOK</h2>
                        <button
                            onClick={() => navigate("/products")}
                            className="font-[Montserrat] text-sm text-purple-500"
                        >
                            Ver todo ›
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                        {suggestedProducts.map((item) => (
                            <div key={item._id}>
                                {item.imageUrl?.[0] ? (
                                    <img
                                        src={item.imageUrl[0]}
                                        alt={item.name}
                                        className="aspect-square rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="aspect-square rounded-lg bg-[#222]" />
                                )}

                                <h3 className="mt-4 font-[Montserrat] text-sm font-bold">
                                    {item.name}
                                </h3>
                                <p className="mt-1 font-[Open_Sans] text-sm text-gray-400">
                                    ${Number(item.price).toFixed(2)}
                                </p>

                                <button
                                    onClick={() => handleAddSuggested(item)}
                                    className="mt-3 w-full border border-purple-500 py-2 font-[Montserrat] text-sm font-bold text-purple-500"
                                >
                                    Añadir
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {isCheckoutOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                    <form
                        onSubmit={submitCheckout}
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-6"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="font-[Montserrat] text-2xl font-black">Datos de Pago</h2>
                                <p className="mt-1 font-[Open_Sans] text-sm text-gray-400">
                                    Completa los datos para finalizar tu compra.
                                </p>
                            </div>
                            <button type="button" onClick={closeCheckout} className="text-gray-400 hover:text-white">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <input value={checkoutForm.fullName} onChange={(e) => handleCheckoutChange("fullName", e.target.value)} placeholder="Nombre completo" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500" />
                            <input value={checkoutForm.city} onChange={(e) => handleCheckoutChange("city", e.target.value)} placeholder="Ciudad" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500" />
                            <input value={checkoutForm.address} onChange={(e) => handleCheckoutChange("address", e.target.value)} placeholder="Dirección" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500 md:col-span-2" />
                            <input value={checkoutForm.zipCode} onChange={(e) => handleCheckoutChange("zipCode", e.target.value)} placeholder="Código postal" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500" />
                            <input value={checkoutForm.cardName} onChange={(e) => handleCheckoutChange("cardName", e.target.value)} placeholder="Nombre del titular" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500" />
                            <input value={checkoutForm.cardNumber} onChange={(e) => handleCheckoutChange("cardNumber", e.target.value)} placeholder="Número de tarjeta" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500 md:col-span-2" />
                            <input value={checkoutForm.expiryDate} onChange={(e) => handleCheckoutChange("expiryDate", e.target.value)} placeholder="Fecha de vencimiento MM/AA" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500" />
                            <input value={checkoutForm.ccv} onChange={(e) => handleCheckoutChange("ccv", e.target.value)} placeholder="CCV" className="rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-purple-500" />
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                            <span className="font-[Montserrat] text-lg font-bold">Total a pagar</span>
                            <span className="font-[Montserrat] text-2xl font-black text-purple-500">
                                ${total.toFixed(2)}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-6 w-full rounded-lg bg-purple-500 py-4 font-[Montserrat] font-bold text-black disabled:opacity-50"
                        >
                            {isSubmitting ? "Procesando..." : "Confirmar Pago"}
                        </button>
                    </form>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Cart;