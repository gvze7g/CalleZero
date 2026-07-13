import ordersModel from "../models/orders.js";
import productsModel from "../models/product.js";

const ordersController = {};

// SELECT (admin)
ordersController.getAllOrders = async (req, res) => {
    try {
        const orders = await ordersModel
            .find()
            .populate("UsersId", "fullName email")
            .populate("items.productId", "name price")
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
            .populate("items.productId", "name price");

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
            .populate("items.productId", "name price")
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
        const { items, PaymentMethod, ShippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío" });
        }

        let totalAmount = 0;

        for (let i = 0; i < items.length; i++) {
            const productFound = await productsModel.findById(items[i].productId);
            if (productFound) {
                const subtotal = productFound.price * items[i].quantity;
                totalAmount += subtotal;
            }
        }

        const newOrder = new ordersModel({
            UsersId: req.user.id,
            items,
            totalAmount,
            OrderStatus: "Pendiente",
            PaymentMethod,
            ShippingAddress,
        });

        await newOrder.save();
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

        return res.status(200).json({ message: "Order updated", order: updatedOrder });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE
ordersController.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await ordersModel.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ message: "Order deleted" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default ordersController;