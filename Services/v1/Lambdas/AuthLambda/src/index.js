const { Login } = require("./Login");
const { Logout } = require("./Logout");
const { Register, VerifyEmail, ResendEmailVerification, GamertagReminder } = require("./Register");
const { IsEmailAvailable } = require("./IsEmailAvailable");
const { ForgotPassword, SetNewPassword } = require("./ForgotPassword");

module.exports = { Login, Logout, Register, IsEmailAvailable, ForgotPassword, SetNewPassword, 
	VerifyEmail, ResendEmailVerification, GamertagReminder };