import { cookieOptions } from "../Utils/cookieOptions.js";

const logoutController = {};

logoutController.logout = async (req, res) => {
  try {
    res.clearCookie("authCookie", cookieOptions());

    return res.status(200).json({
      message: "Sesión cerrada",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default logoutController;