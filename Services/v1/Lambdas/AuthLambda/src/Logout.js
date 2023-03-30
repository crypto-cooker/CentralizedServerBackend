const { success, userError } = require("./../../../Common/Responses");
const { SetLastLogout } = require("./../../../DataAccessLayer/Users");

const Logout = async (ddb, Logger, userId) => {
  const now = String(new Date().getTime());
  const updateUserResponse = await SetLastLogout(ddb, userId, now);
  return success(Logger, {'response': 'OK'});
};

module.exports = { Logout };