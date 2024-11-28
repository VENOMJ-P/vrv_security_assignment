const express = require("express");
const UserController = require("../../controllers/user-controller");
const ProductController = require("../../controllers/product-controller");
const {
  validateSignup,
  validateSignin,
  authenticateToken,
  authorizeRoles,
  validatePassword,
  validateUserUpdate,
  validateProduct,
} = require("../../middlewares/index");

const router = express.Router();
const userController = new UserController();
const productController = new ProductController();

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "Ok",
  });
});

/*
    User Routes
*/

// Route for user registration
// Access: Public
router.post("/user/signup", validateSignup, userController.signup);

// Route for user login
// Access: Public
router.post("/user/signin", validateSignin, userController.signin);

// Route to fetch the profile of the logged-in user
// Access: Authenticated users (roles: Admin, Moderator, User)
router.get("/profile", authenticateToken, userController.getUserProfile);

// Route to update the profile of the logged-in user
// Access: Authenticated users (roles: Admin, Moderator, User)
router.patch(
  "/profile",
  authenticateToken,
  validateUserUpdate,
  userController.updateUserProfile
);

// Route to update the password of the logged-in user
// Access: Authenticated users (roles: Admin, Moderator, User)
router.patch(
  "/password",
  authenticateToken,
  validatePassword,
  userController.updatePassword
);

// Admin or Moderator route to update a user's status or role
// Access: Admin (role: 1) and Moderator (role: 2)
router.patch(
  "/user/:id",
  authenticateToken,
  authorizeRoles([1, 2]),
  validateUserUpdate,
  userController.adminUpdateUser
);

// Admin-only route to delete a user
// Access: Admin (role: 1)
router.delete(
  "/user/:id",
  authenticateToken,
  authorizeRoles([1]),
  userController.deleteUserProfile
);

// Route for user logout
// Access: Public

router.post("/user/logout", authenticateToken, userController.logout);

/*
    Product Routes
*/

// Admin-only route to create a new product
// Access: Admin (role: 1)
router.post(
  "/products",
  authenticateToken,
  authorizeRoles([1]),
  validateProduct,
  productController.create
);

// Route to fetch details of a specific product by its ID
// Access: Authenticated users (roles: Admin, Moderator, User)
router.get("/products/:id", authenticateToken, productController.get);

// Admin or Moderator route to update a product
// Access: Admin (role: 1) and Moderator (role: 2)
router.put(
  "/products/:id",
  authenticateToken,
  authorizeRoles([1, 2]),
  validateProduct,
  productController.update
);

// Admin-only route to delete a product
// Access: Admin (role: 1)
router.delete(
  "/products/:id",
  authenticateToken,
  authorizeRoles([1]),
  productController.destroy
);

// Route to fetch all products
// Access: Authenticated users (roles: Admin, Moderator, User)
router.get("/products", authenticateToken, productController.getAllProducts);

module.exports = router;
