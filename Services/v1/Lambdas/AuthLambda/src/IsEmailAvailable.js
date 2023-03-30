const { success, userError } = require("./../../../Common/Responses");
const { GetUserByEmail } = require("./../../../DataAccessLayer/Users");

const IsEmailAvailable = async (ddb, Logger, email) => {
  if (!email) {
    console.log(`request missing params`);
    return userError(Logger, 400, {'response': 'missing params'});
  }
  const emailAlreadyExists = await GetUserByEmail(ddb, email);
  if (emailAlreadyExists) {
    console.log(`email ${email} already exists`);
    return userError(Logger, 409, {'response': 'email already exists'});
  }

  return success(Logger, {'response': 'OK' });
}

module.exports = { IsEmailAvailable };
