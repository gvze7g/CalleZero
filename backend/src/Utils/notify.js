import notificationsModel from "../models/notifications.js";

// Crea una notificacion sin interrumpir la peticion si falla
const notify = async (data) => {
  try {
    await notificationsModel.create(data);
  } catch (error) {
    console.log("Error creando notificacion:", error.message);
  }
};

export default notify;
