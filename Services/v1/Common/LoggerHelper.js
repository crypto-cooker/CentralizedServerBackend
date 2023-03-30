class LoggerHelper {
  constructor() {
    this.userId = "";
    this.pathParams = "";
    this.query = "";
    this.request = {};
    this.response = {};
  }

  SetUserId(userId) {
    this.userId = userId;
    return this;
  }

  SetPathParams(pathParams) {
    this.pathParams = pathParams;
    return this;
  }

  SetRequest(jsonObj) {
    this.request = JSON.stringify(jsonObj, null, 0);
    return this;
  }

  SetResponse(jsonObj) {
    this.response = JSON.stringify(jsonObj, null, 0);
    return this;
  }

  SetQuery(queryString) {
    this.query = queryString;
  }

  Print() {
    console.log(`Request: ${this.pathParams}, Query: ${this.query}, UserId: ${this.userId}, Request: ${this.request}, Response: ${this.response}`);
  }
}

module.exports = { LoggerHelper };
