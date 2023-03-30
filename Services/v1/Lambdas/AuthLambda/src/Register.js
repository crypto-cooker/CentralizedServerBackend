const { success, userError } = require("./../../../Common/Responses");
const { SendEmail } = require("./../../../Common/Mailer");
const { RandomCode } = require("./../../../Common/Utils");
const { GetUserByEmail, GenerateGamerTagId, SetUser, SetUserStatus } = require("./../../../DataAccessLayer/Users");

const Register = async (ddb, Logger, email, gamertagName, password, dob="1/1/1111", promotionalOptIn=false) => {
  if (!email || !gamertagName || !password) {
    console.log(`request missing params`);
    return userError(Logger, 400, {'response': 'missing params'});
  }

  const emailAlreadyExists = await GetUserByEmail(ddb, email);
  if (emailAlreadyExists) {
    console.log(`email ${email} already exists`);
    return userError(Logger, 409, {'response': 'email already exists'});
  }

  const gamerTagId = await GenerateGamerTagId(ddb, gamertagName);
  console.log(gamerTagId);
  const verificationCode = String(RandomCode());
  console.log(verificationCode)

  const user = await SetUser(ddb, email, gamertagName, gamerTagId, password, dob, verificationCode, promotionalOptIn);
  console.log(user);
  const gamerTag = `${gamertagName}#${gamerTagId}`;

  await SendEmail("signup", { gamerTag, verificationCode, email}, "noreply@blocktackle.io", email, "Welcome to Blocktackle!");

  return success(Logger, {'response': {
    email, dob, gamerTag
  }});
};

const VerifyEmail = async (ddb, Logger, email, verificationCode) => {
  if (!email || !verificationCode) {
    return userError(Logger, 400, {'response': 'missing params'});
  }

  const user = await GetUserByEmail(ddb, email);
  if (!user || !user.verificationCode || user.verificationCode.S !== verificationCode) {
    return userError(Logger, 403, {'response': 'invalid request'});
  }

  const userId = user.userId.S;
  const updateStatusResponse = await SetUserStatus(ddb, userId, 'active');
  return success(Logger, {'response': 'OK'});
};

const ResendEmailVerification = async (ddb, Logger, email) => {
  const user = await GetUserByEmail(ddb, email);
  if (!user || !user.verificationCode) {
    return userError(Logger, 403, {'response': 'invalid request'});
  }
  const gamertagName = user.gamerTagName.S;
  const gamerTagId = user.gamerTagId.N;
  const verificationCode = user.verificationCode.S;
  const gamerTag = `${gamertagName}#${gamerTagId}`;

  await SendEmail("signup", { gamerTag, verificationCode, email}, "noreply@blocktackle.io", email, "Welcome to Blocktackle!");
  return success(Logger, {'response': 'OK'});
};

const GamertagReminder = async (ddb, Logger, email) => {
  const user = await GetUserByEmail(ddb, email);
  if (!user) {
    return userError(Logger, 403, {'response': 'invalid request'});
  }
  const gamertagName = user.gamerTagName.S;
  const gamerTagId = user.gamerTagId.N;
  const gamerTag = `${gamertagName}#${gamerTagId}`;

  await SendEmail("gamertag-reminder", { gamerTag, email}, "noreply@blocktackle.io", email, "Blocktackle GamerTag Reminder");
  return success(Logger, {'response': 'OK'});
};

module.exports = { Register, VerifyEmail, ResendEmailVerification, GamertagReminder };
