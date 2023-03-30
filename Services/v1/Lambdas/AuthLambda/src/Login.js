const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { success, userError } = require("./../../../Common/Responses");
const { GetUserByIdentifier } = require("./../../../DataAccessLayer/Users");
const jwtSecret = "centralServices123";

const Login = async (ddb, Logger, identifier, password) => {
  if (!identifier || !password) {
    console.log(`request missing params`);
    return userError(Logger, 400, {'response': 'missing params'});
  }

  const user = await GetUserByIdentifier(ddb, identifier);
  if (!user) {
    console.log(`user not found`);
    return userError(Logger, 404, {'response': 'user not found'});
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password.S);
  if (!isPasswordValid) {
    console.log(`invalid password`);
    return userError(Logger, 401, {'response': 'invalid password'});
  }

  const now = new Date().getTime();
  const token = jwt.sign({ id: user.userId.S, iat: now }, jwtSecret, {
    expiresIn: 86400, // 24 hours
  });

  const gamerTag = `${user.gamerTagName.S}#${user.gamerTagId.N}`;
  const status = user.status.S;

  return success(Logger, { response: { token, gamerTag, status } });
};

module.exports = { Login };