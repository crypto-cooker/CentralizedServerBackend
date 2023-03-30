'use strict';

const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({region: "us-west-2"});
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-west-2"});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { success, userError } = require("./../../Common/Responses");
const { LoggerHelper } = require("./../../Common/LoggerHelper");
const { isValidPublicRequest, ValidateCredentials } = require("./../../Common/RequestValidation");

const { GetUser, GetUserByIdentifier, GetUserByEmail, SetUser, GenerateGamerTagId } = require("./../../DataAccessLayer/Users");
const { SendEmail } = require("./../../Common/Mailer");
const { Login, Logout, Register, IsEmailAvailable, ForgotPassword, SetNewPassword, VerifyEmail,
  ResendEmailVerification, GamertagReminder } = require("./src");

const jwtSecret = "centralServices123";

exports.handler = async (event) => {
  const Logger = new LoggerHelper();
  const requestBody = JSON.parse(event.body);
  const pathParams = event.pathParameters.proxy;

  const isLoginRequest = (/login/.test(pathParams));
  const isLogoutRequest = (/logout/.test(pathParams));

  const isRegisterRequest = (/register/.test(pathParams));
  const isResendEmailVerification = (/resend-email-verification/.test(pathParams));
  const isGamertagReminderRequest = (/gamertag-reminder/.test(pathParams));
  const isVerifyEmailRequest = (/verify-email/.test(pathParams));

  const isForgotPasswordRequest = (/forgot-password/.test(pathParams));
  const isSetNewPasswordRequest = (/set-new-password/.test(pathParams));
  const isEmailAvailableRequest = (/is-email-available/.test(pathParams));

  Logger.SetPathParams(pathParams).SetRequest(requestBody);

  if (isLoginRequest) {
    const { identifier, password } = requestBody;
    return await Login(ddb, Logger, identifier, password);
  }

  if (isRegisterRequest) {
    const { email, dob, gamertag, password, promotionalOptIn } = requestBody;
    return await Register(ddb, Logger, email, gamertag, password, dob, promotionalOptIn);
  }

  if (isEmailAvailableRequest) {
    const { email } = requestBody;
    return await IsEmailAvailable(ddb, Logger, email);
  }

  if (isForgotPasswordRequest) {
    const { email } = requestBody;
    return await ForgotPassword(ddb, Logger, email);
  }

  if (isSetNewPasswordRequest) {
    const { email, passwordCode, password } = requestBody;
    return await SetNewPassword(ddb, Logger, email, passwordCode, password);
  }

  if (isVerifyEmailRequest) {
    const { email, verificationCode } = requestBody;
    return await VerifyEmail(ddb, Logger, email, verificationCode);
  }

  if (isResendEmailVerification) {
    const { email } = requestBody;
    return await ResendEmailVerification(ddb, Logger, email);
  }

  if (isGamertagReminderRequest) {
    const { email } = requestBody;
    return await GamertagReminder(ddb, Logger, email);
  }

  const validated = await ValidateCredentials(ddb, event);
  if (validated.error == 'no headers') { 
    return userError(Logger, 401, { 'response': '' }); 
  } else if (validated.error == 'expired token') {
    return userError(Logger, 403, { 'response': 'expired token' }); 
  }
  const userId = validated.userId;
  Logger.SetUserId(userId);

  if (isLogoutRequest) {
    return await Logout(ddb, Logger, userId);
  }

  return success(Logger, {'response': 'OK'});
};
