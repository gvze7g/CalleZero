import mongoose from "mongoose";
import ordersModel from "../models/orders.js";
import { isSafeText } from "../Utils/validators.js";
import productsModel from "../models/product.js";
import promotionsModel from "../models/promotions.js";
import usersModel from "../models/users.js";
import { checkPromotion } from "./promotionsController.js";
import notify from "../Utils/notify.js";

const shortId = (id) => id.toString().slice(-6).toUpperCase();
const STATUSES = ["Pendiente", "Procesando", "Enviado", "Completado"];
const PAYMENTS = ["Tarjeta", "Efectivo", "Apple Pay", "Simulado - Demo"];
const LOW_STOCK = 5;

const ordersController = {};

// SELECT (admin)
ordersController.getAllOrders = async (req, res) => {
    try {
        const orders = await ordersModel
            .find()
            .populate("UsersId", "fullName email")
            .populate("items.productId", "name price imageUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// SELECT by ID
ordersController.getOrderById = async (req, res) => {
    try {
        const order = await ordersModel
            .findById(req.params.id)
            .populate("UsersId", "fullName email")
            .populate("items.productId", "name price imageUrl");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// GET orders del usuario logueado
ordersController.getMyOrders = async (req, res) => {
    try {
        const orders = await ordersModel
            .find({ UsersId: req.user.id })
            .populate("items.productId", "name price imageUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// INSERT
ordersController.insertOrder = async (req, res) => {
    try {
        const { items, PaymentMethod, ShippingAddress, promoCode } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío" });
        }
        if (items.some((i) => !mongoose.isValidObjectId(i.productId) || !Number.isInteger(Number(i.quantity)) || Number(i.quantity) < 1 || Number(i.quantity) > 99)) {
            return res.status(400).json({ message: "Cantidades no válidas en el carrito" });
        }
        if (!isSafeText(ShippingAddress, 5, 300)) {
            return res.status(400).json({ message: "Ingresa una dirección de envío válida" });
        }
        if (PaymentMethod && !PAYMENTS.includes(PaymentMethod)) {
            return res.status(400).json({ message: "Método de pago no válido" });
        }

        let subtotal = 0;

        // Primero validamos que haya stock suficiente para TODO el carrito
        for (let i = 0; i < items.length; i++) {
            const productFound = await productsModel.findById(items[i].productId);

            if (!productFound) {
                return res.status(404).json({
                    message: `Producto no encontrado: ${items[i].name}`,
                });
            }

            if (productFound.stock < items[i].quantity) {
                return res.status(400).json({
                    message: `Stock insuficiente para "${productFound.name}". Disponible: ${productFound.stock}`,
                });
            }

            // Precio tomado de la base de datos, no del cliente
            items[i].price = productFound.price;
            items[i].name = productFound.name;
            subtotal += productFound.price * items[i].quantity;
        }

        // Codigo promocional
        let discount = 0;
        let appliedCode = "";
        if (promoCode) {
            const result = await checkPromotion(promoCode, subtotal);
            if (result.error) {
                return res.status(400).json({ message: result.error });
            }
            discount = result.discount;
            appliedCode = result.promo.code;
        }

        const totalAmount = Math.round((subtotal - discount) * 100) / 100;

        // Si todo el stock está OK, ahora sí descontamos y guardamos la orden
        const lowStock = [];
        for (let i = 0; i < items.length; i++) {
            const updated = await productsModel.findByIdAndUpdate(
                items[i].productId,
                { $inc: { stock: -items[i].quantity } },
                { new: true }
            );
            if (updated && updated.stock <= LOW_STOCK) lowStock.push(updated);
        }

        const newOrder = new ordersModel({
            UsersId: req.user.id,
            items,
            subtotal,
            discount,
            promoCode: appliedCode,
            totalAmount,
            OrderStatus: "Pendiente",
            PaymentMethod,
            ShippingAddress,
        });

        await newOrder.save();

        if (appliedCode) {
            await promotionsModel.updateOne({ code: appliedCode }, { $inc: { usedCount: 1 } });
        }

        // Notificaciones del pedido
        const buyer = await usersModel.findById(req.user.id).select("fullName");
        const id = shortId(newOrder._id);
        await notify({
            userId: req.user.id,
            audience: "user",
            type: "order",
            title: "Pedido recibido",
            message: `Tu pedido #${id} por $${totalAmount.toFixed(2)} está pendiente.`,
            link: "orders",
        });
        await notify({
            audience: "admin",
            type: "order",
            title: "Nuevo pedido",
            message: `#${id} de ${buyer?.fullName || "un cliente"} por $${totalAmount.toFixed(2)}`,
            link: "/orders",
        });
        for (const p of lowStock) {
            await notify({
                audience: "admin",
                type: "stock",
                title: p.stock <= 0 ? "Producto agotado" : "Stock bajo",
                message: `${p.name} tiene ${p.stock} unidades.`,
                link: "/products",
            });
        }

        return res.status(201).json({ message: "Order saved", order: newOrder });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// UPDATE (admin - cambia estado, dirección, etc.)
ordersController.updateOrder = async (req, res) => {
    try {
        const { OrderStatus, PaymentMethod, ShippingAddress } = req.body;

        if (OrderStatus && !STATUSES.includes(OrderStatus)) {
            return res.status(400).json({ message: "Estado no válido" });
        }

        const updateFields = {};
        if (OrderStatus) updateFields.OrderStatus = OrderStatus;
        if (PaymentMethod) updateFields.PaymentMethod = PaymentMethod;
        if (ShippingAddress) updateFields.ShippingAddress = ShippingAddress;

        const updatedOrder = await ordersModel.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Avisar al cliente del nuevo estado
        if (OrderStatus && updatedOrder.UsersId) {
            await notify({
                userId: updatedOrder.UsersId,
                audience: "user",
                type: "order",
                title: `Pedido ${OrderStatus.toLowerCase()}`,
                message: `Tu pedido #${shortId(updatedOrder._id)} ahora está: ${OrderStatus}.`,
                link: "orders",
            });
        }

        return res.status(200).json({ message: "Order updated", order: updatedOrder });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE
ordersController.deleteOrder = async (req, res) => {
    try {
        const order = await ordersModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Devolver el stock de cada producto antes de borrar la orden
        for (let i = 0; i < order.items.length; i++) {
            await productsModel.findByIdAndUpdate(order.items[i].productId, {
                $inc: { stock: order.items[i].quantity },
            });
        }

        await ordersModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Order deleted" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default ordersController;