const jwt = require("jsonwebtoken");
const { User } = require("../models");

const { JWT_SECRET } = require("../config/serverConfig");
const { StatusCodes } = require("http-status-codes");

const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Verify the token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user associated with the token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "deletedAt"] },
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User not found or token is invalid",
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "User account is not active",
      });
    }

    // Check if the IP matches the one stored in the token (if applicable)
    if (decoded.ip && decoded.ip !== req.ip) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "IP address mismatch",
      });
    }

    // Attach user details to the request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      ip: req.ip, // Include the client's IP for downstream usage
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication token has expired",
      });
    }

    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Failed to authenticate token",
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.roleId)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
