const { success, userError } = require("./../../../Common/Responses");
const { RandomCode } = require("./../../../Common/Utils");
const { SendEmail } = require("./../../../Common/Mailer");
const { GetUserByEmail, SetPasswordCode, SetPassword, GetUserByIdentifier } = require("./../../../DataAccessLayer/Users");
const { Login } = require("./Login");

const ForgotPassword = async (ddb, Logger, identifier) => {
  if (!identifier) {
    return userError(Logger, 400, {'response': 'missing params'});
  }

  const user = await GetUserByIdentifier(ddb, identifier);
  if (!user) {
    console.log(`user not found`);
    return userError(Logger, 404, {'response': 'user not found'});
  }

  const userId = user.userId.S;
  const email = user.email.S;
  const passwordCode = String(RandomCode());
  const updateUserResponse = await SetPasswordCode(ddb, userId, passwordCode);
  await SendEmail("forgot-password", { email: email, passwordCode: passwordCode}, "noreply@blocktackle.io", email, "Blocktackle Password Reset");
  return success(Logger, {response: 'OK'});
}

const SetNewPassword = async (ddb, Logger, email, passwordCode, password) => {
  if (!email || !passwordCode || !password) {
    return userError(Logger, 400, {'response': 'missing params'});
  }

  const user = await GetUserByEmail(ddb, email);
  if (!user || !user.passwordCode || user.passwordCode.S !== passwordCode) {
    return userError(Logger, 403, {'response': 'invalid request'});
  }

  const userId = user.userId.S;
  const updatePasswordResponse = await SetPassword(ddb, userId, password);
  return await Login(ddb, Logger, email, password);
};

module.exports = { SetNewPassword, ForgotPassword };
