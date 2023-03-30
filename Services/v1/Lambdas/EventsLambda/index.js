'use strict';

const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({region: "us-west-2"});
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-west-2"});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { success, userError } = require("./../../Common/Responses");
const { LoggerHelper } = require("./../../Common/LoggerHelper");
const { isValidPublicRequest, ValidateCredentials } = require("./../../Common/RequestValidation");

const { SetEvent } = require("./src");

const jwtSecret = "centralServices123";

exports.handler = async (event) => {
  const Logger = new LoggerHelper();
  const requestBody = JSON.parse(event.body);
  const pathParams = event.pathParameters.proxy;

  const isSetEventRequest = (pathParams === "/" && event.httpMethod === "PUT");
  const isSetOutcomeRequest = (pathParams === "outcomes" && event.httpMethod === "PUT" );
  const isEditEventRequest = (/event-id\/(.+)/.test(pathParams) && event.httpMethod === "PUT");

  const isGetActiveEventsRequest = (pathParams === "active-events" && event.httpMethod === "GET");
  const isGetEventByIdRequest = (/event-id\/(.+)/.test(pathParams) && event.httpMethod === "GET" );
  const isGetEventByNameRequest = (/event-name\/(.+)/.test(pathParams) && event.httpMethod === "GET" );
  const isGetEventRankingRequest = (/event-id\/(.+)\/ranking/.test(pathParams) && event.httpMethod === "GET" );

  const isDeleteEventRequest = (/event-id\/(.+)\/archive/.test(pathParams)  && event.httpMethod === "DEL" );

  Logger.SetPathParams(pathParams).SetRequest(requestBody).SetQuery(event.queryStringParameters);

  if (isSetEventRequest) {
    const userId = "test";
    const { eventDetails, userId } = requestBody;
    return await SetEvent(ddb, Logger, eventDetails);
  }

  return success(Logger, {'response': 'OK'});
};
