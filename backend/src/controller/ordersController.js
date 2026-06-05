import ordersModel from "../models/orders.js";
import productsModel from "../models/product.js";

// Array de funciones
const ordersController = {};

// SELECT
ordersController.getAllOrders = async (req, res) => {
  try {
    const orders = await ordersModel
      .find()
      .populate("UsersId", "name email")
      .populate("promotionsId")
      .populate("items.productId", "name price");

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
      .populate("UsersId", "name email")
      .populate("promotionsId")
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

// INSERT
ordersController.insertOrder = async (req, res) => {
  try {
    const { UsersId, promotionsId, items, PaymentMethod, ShippingAddress } = req.body;

    // Calcular el total
    let totalAmount = 0;

    for (let i = 0; i < items.length; i++) {
      const productFound = await productsModel.findById(items[i].productId);
      if (productFound) {
        const subtotal = productFound.price * items[i].quantity;
        totalAmount += subtotal;
      }
    }

    const newOrder = new ordersModel({
      UsersId,
      promotionsId,
      items,
      totalAmount,
      Status: true, // O el estado que desees inicializar
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

// UPDATE
ordersController.updateOrder = async (req, res) => {
  try {
    const { UsersId, promotionsId, items, PaymentMethod, ShippingAddress } = req.body;

    // Recalcular el total
    let totalAmount = 0;

    for (let i = 0; i < items.length; i++) {
      const productFound = await productsModel.findById(items[i].productId);
      if (productFound) {
        const subtotal = productFound.price * items[i].quantity;
        totalAmount += subtotal;
      }
    }

    const updatedOrder = await ordersModel.findByIdAndUpdate(
      req.params.id,
      {
        UsersId,
        promotionsId,
        items,
        totalAmount,
        PaymentMethod,
        ShippingAddress,
      },
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