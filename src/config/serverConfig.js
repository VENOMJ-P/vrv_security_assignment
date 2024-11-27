const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALT: bcrypt.genSaltSync(Number(process.env.SALT)),
  JWT_SECRET: process.env.JWT_SECRET,
};
