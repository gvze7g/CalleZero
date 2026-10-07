import notificationsModel from "../models/notifications.js";

const notificationsController = {};

// Admin ve las del panel; un cliente ve las suyas y las generales
const filterFor = (user) =>
  user.userType === "admin"
    ? { audience: "admin" }
    : { $or: [{ audience: "user", userId: user.id }, { audience: "users" }] };

// GET /api/notifications
notificationsController.getMine = async (req, res) => {
  try {
    const list = await notificationsModel
      .find(filterFor(req.user))
      .sort({ createdAt: -1 })
      .limit(50);

    const notifications = list.map((n) => ({
      _id: n._id,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      createdAt: n.createdAt,
      read: n.readBy.some((id) => id.toString() === req.user.id),
    }));

    return res.status(200).json({
      notifications,
      unread: notifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/notifications/read-all
notificationsController.readAll = async (req, res) => {
  try {
    await notificationsModel.updateMany(filterFor(req.user), {
      $addToSet: { readBy: req.user.id },
    });
    return res.status(200).json({ message: "Notificaciones leídas" });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/notifications/:id/read
notificationsController.readOne = async (req, res) => {
  try {
    await notificationsModel.updateOne(
      { _id: req.params.id, ...filterFor(req.user) },
      { $addToSet: { readBy: req.user.id } }
    );
    return res.status(200).json({ message: "Notificación leída" });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default notificationsController;
