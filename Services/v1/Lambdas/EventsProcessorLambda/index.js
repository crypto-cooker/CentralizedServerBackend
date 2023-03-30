'use strict';

const { success, userError } = require("./../../Common/Responses");
const { LoggerHelper } = require("./../../Common/LoggerHelper");

exports.handler = async (event) => {
  const Logger = new LoggerHelper();
  console.log("Hiya2");
  return success(Logger, {'response': 'OK'});
};
