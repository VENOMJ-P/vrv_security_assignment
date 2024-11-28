const express = require("express");
const UserController = require("../../controllers/user-controller");
const {
  validateSignup,
  validateSignin,
  authenticateToken,
  authorizeRoles,
  validatePassword,
  validateUserUpdate,
} = require("../../middlewares/index");

const router = express.Router();
const userController = new UserController();

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "Ok",
  });
});

router.post("/user/signup", validateSignup, userController.signup);
router.post("/user/signin", validateSignin, userController.signin);
// router.post("/user/logout", userController.logout);

// Get user profile (authenticated users)
router.get("/profile", authenticateToken, userController.getUserProfile);

// Update user profile
router.patch(
  "/profile",
  authenticateToken,
  validateUserUpdate,
  userController.updateUserProfile
);

// Update user password
router.patch(
  "/password",
  authenticateToken,
  validatePassword,
  userController.updatePassword
);

// Admin-only route to update user status or role
router.patch(
  "/user/:id",
  authenticateToken,
  authorizeRoles([1, 2]), // Only admin and moderator roles
  validateUserUpdate,
  userController.adminUpdateUser
);

router.delete(
  "/user/:id",
  authenticateToken,
  authorizeRoles([1]),
  userController.deleteUserProfile
);

module.exports = router;
