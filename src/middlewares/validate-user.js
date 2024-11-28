const { User, Role } = require("../models");
const { Op } = require("sequelize");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function for password strength validation
const validatePasswordStrength = (password) => {
  // At least 8 characters
  // Contains at least one uppercase letter
  // Contains at least one lowercase letter
  // Contains at least one number
  // Contains at least one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateSignup = async (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;

  const validationErrors = [];

  if (!username) {
    validationErrors.push("Username is required");
  } else if (username.length < 5 || username.length > 50) {
    validationErrors.push("Username must be between 5 and 50 characters");
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    validationErrors.push(
      "Username can only contain letters, numbers, and underscores"
    );
  } else {
    try {
      const existingUsername = await User.findOne({
        where: { username },
      });
      if (existingUsername) {
        validationErrors.push("Username is already in use");
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Database error during username validation",
      });
    }
  }

  // Email validation
  if (!email) {
    validationErrors.push("Email is required");
  } else if (!validateEmail(email)) {
    validationErrors.push("Invalid email format");
  } else {
    try {
      const existingEmail = await User.findOne({
        where: { email },
      });
      if (existingEmail) {
        validationErrors.push("Email is already in use");
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Database error during email validation",
      });
    }
  }

  // Password validation
  if (!password) {
    validationErrors.push("Password is required");
  } else if (!validatePasswordStrength(password)) {
    validationErrors.push(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    );
  }

  // First name validation
  if (!firstName) {
    validationErrors.push("First name is required");
  } else if (firstName.length < 2 || firstName.length > 150) {
    validationErrors.push("First name must be between 2 and 150 characters");
  } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
    validationErrors.push("First name can only contain letters");
  }

  // Last name validation
  if (lastName) {
    if (lastName.length < 2 || lastName.length > 150) {
      validationErrors.push("Last name must be between 2 and 150 characters");
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      validationErrors.push("Last name can only contain letters");
    }
  }

  // Check if there are any validation errors
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong in user signup",
      data: {},
      errors: validationErrors,
    });
  }

  next();
};

// middleware/validateSignin.js
const validateSignin = (req, res, next) => {
  const { login, password } = req.body;

  const validationErrors = [];

  // Check if login (username or email) is provided
  if (!login) {
    validationErrors.push("Login (username or email) is required");
  }

  // Check if password is provided
  if (!password) {
    validationErrors.push("Password is required");
  }

  // Check length constraints
  if (login && (login.length < 3 || login.length > 50)) {
    validationErrors.push("Login must be between 3 and 50 characters");
  }

  if (password && (password.length < 8 || password.length > 255)) {
    validationErrors.push("Password must be between 8 and 255 characters");
  }

  // If there are validation errors, return them
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: validationErrors,
    });
  }

  next();
};

// middleware/validateUserUpdate.js

const validateUserUpdate = async (req, res, next) => {
  const { username, email, firstName, lastName, isActive, roleId } = req.body;

  const validationErrors = [];

  // Username validation (if provided)
  if (username) {
    if (username.length < 5 || username.length > 50) {
      validationErrors.push("Username must be between 5 and 50 characters");
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      validationErrors.push(
        "Username can only contain letters, numbers, and underscores"
      );
    } else {
      // Check username uniqueness in database
      try {
        const existingUsername = await User.findOne({
          where: {
            username,
            id: { [Op.ne]: req.user.id }, // Exclude current user
          },
        });
        if (existingUsername) {
          validationErrors.push("Username is already in use");
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Database error during username validation",
        });
      }
    }
  }

  // Email validation (if provided)
  if (email) {
    if (!validateEmail(email)) {
      validationErrors.push("Invalid email format");
    } else {
      // Check email uniqueness in database
      try {
        const existingEmail = await User.findOne({
          where: {
            email,
            id: { [Op.ne]: req.user.id }, // Exclude current user
          },
        });
        if (existingEmail) {
          validationErrors.push("Email is already in use");
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Database error during email validation",
        });
      }
    }
  }

  // First name validation (if provided)
  if (firstName) {
    if (firstName.length < 2 || firstName.length > 150) {
      validationErrors.push("First name must be between 2 and 150 characters");
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      validationErrors.push("First name can only contain letters");
    }
  }

  // Last name validation (if provided)
  if (lastName) {
    if (lastName.length < 2 || lastName.length > 150) {
      validationErrors.push("Last name must be between 2 and 150 characters");
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      validationErrors.push("Last name can only contain letters");
    }
  }

  // isActive validation (if provided)
  if (isActive !== undefined && typeof isActive !== "boolean") {
    validationErrors.push("isActive must be a boolean value");
  }

  // Role validation (if provided)
  if (roleId) {
    // Assuming you have a Role model to check against
    try {
      const role = await Role.findByPk(roleId);
      if (!role) {
        validationErrors.push("Role does not exist");
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Database error during role validation",
      });
    }
  }

  // Check if there are any validation errors
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: validationErrors,
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateSignin,
  validateUserUpdate,
};
