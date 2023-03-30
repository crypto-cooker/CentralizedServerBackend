const userError = (Logger, statusCode, responseBody) => {
  const response = {
    statusCode: statusCode,
    headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    },
    body: JSON.stringify(responseBody)    
  };
  Logger.SetResponse(response).Print();
  return response;
};
const success = (Logger, responseBody) => {
  const response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    },
    body: JSON.stringify(responseBody)    
  };
  Logger.SetResponse(response).Print();
  return response;
};
const serverError = (Logger, responseBody) => {
  const response = {
    statusCode: 500,
    headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    },
    body: JSON.stringify(responseBody)
  };
  Logger.SetResponse(response).Print();
  return response;
};

module.exports = { success, userError, serverError };
