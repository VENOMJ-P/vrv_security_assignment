const { StatusCodes } = require("http-status-codes");

// middleware/validatePassword.js
const validatePassword = (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const errors = [];

  if (!currentPassword) errors.push("Current password is required");
  if (!newPassword) errors.push("New password is required");
  if (!confirmNewPassword) errors.push("Confirm new password is required");
  if (newPassword !== confirmNewPassword)
    errors.push("New passwords do not match");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (newPassword && !passwordRegex.test(newPassword)) {
    errors.push(
      "Password must include uppercase, lowercase, number, and special character"
    );
  }

  if (errors.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, errors });
  }

  next();
};

module.exports = validatePassword;
