const bcrypt = require("bcryptjs");
const uuid = require('uuid');

const GetUser = async (ddb, userId) => {
  const params = {
    TableName: "prod.CS.Users",
    Key: {
      "userId": {"S": userId }
    }
  };

  return new Promise( (resolve, reject) => {
    ddb.getItem(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject();
      }
      return resolve(data.Item);
    });
  });
};

const GetUserByIdentifier = async (ddb, identifier) => {
  if (identifier.includes("@")) {
    const email = identifier;
    return await GetUserByEmail(ddb, email);
  } else {
    const gamerTagSplit = identifier.split("#"); 
    const gamerTagName = gamerTagSplit[0];
    const gamerTagId = gamerTagSplit[1];
    return await GetUserByGamerTag(ddb, gamerTagName, gamerTagId);
  }
};

const GetUserByEmail = async (ddb, email) => {
  const params = {
    TableName: "prod.CS.Users",
    KeyConditionExpression: "email = :email",
    IndexName: "emailIndex",
    ExpressionAttributeValues: {
      ":email": {S: email}
    }
  };
  return new Promise( (resolve, reject) => {
    ddb.query(params, function(err, data) {
      if (err) {
        throw err;
      }
      return resolve(data.Items[0]);
    });
  });
};

const GetUserByGamerTag = async (ddb, gamerTagName, gamerTagId) => {
  const params = {
    TableName: "prod.CS.Users",
    KeyConditionExpression: "gamerTagName = :gamerTagName AND gamerTagId = :gamerTagId",
    IndexName: "gamerTagIndex",
    ExpressionAttributeValues: {
      ":gamerTagName": {S: gamerTagName},
      ":gamerTagId": {N: "1"},
    }
  };
  return new Promise( (resolve, reject) => {
    ddb.query(params, function(err, data) {
      if (err) {
        throw err;
      }
      return resolve(data.Items[0]);
    });
  });
};

const SetUser = async (ddb, email, gamerTagName, gamerTagId, password, dob, verificationCode, promotionalOptIn) => {
  const encryptedPassword = bcrypt.hashSync(password, 8);
  const now = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const userData = {
    userId: {S: uuid.v4()},
    email: {S: email},
    gamerTagName: {S: gamerTagName},
    gamerTagId: {N: "1"},
    password: {S: encryptedPassword},
    createdAt: {S: now},
    dob: {S: dob},
    verificationCode: {S: verificationCode },
    status: {S: 'unverified'}
  };
  if (promotionalOptIn) {
    userData.optIns = {SS: ["promotional"] };
  }
  return new Promise( (resolve, reject) => {
    var params = {
      Item: userData,
      ReturnConsumedCapacity: "TOTAL",
      TableName: "prod.CS.Users"
    };
    ddb.putItem(params, function(err, data) {
      if (err) {
        throw err;
      }
      return resolve(userData);
    });
  });
};

const GenerateGamerTagId = async (ddb, gamerTagName) => {
  return "1";

  let foundValidGamerTag = false;
  let randomInt = null;
  let retryCount = 0;
  let maxRetries = 100;

  while (foundValidGamerTag === false) {
    if (retryCount === maxRetries) {
      throw new Error("Failed to generate random gamerTagId");
    }

    randomInt = String(randomInteger(0, 9999));
    const gamerTagExist = await GetUserByGamerTag(ddb, gamerTagName, randomInt);
    if (!gamerTagExist) {
      foundValidGamerTag = true;
    }
  };
  return randomInt;
};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function SetPasswordCode (ddb, userId, passwordCode) {
  const params = {
    TableName: "prod.CS.Users",
    Key: {
      "userId": { "S": userId }
    },
    UpdateExpression: "SET passwordCode = :pw",
    ExpressionAttributeValues: {
      ":pw": { "S": passwordCode }
    }
  }
  return new Promise( (resolve, reject) => {
    ddb.updateItem(params, function (err, data) {
      if (err) {
        console.log(err.stack);
        return reject();
      }
      return resolve(data);
    });
  });
}

function SetLastLogout (ddb, userId, lastLogout) {
  const params = {
    TableName: "prod.CS.Users",
    Key: {
      "userId": { "S": userId }
    },
    UpdateExpression: "SET lastLogout = :lastLogout",
    ExpressionAttributeValues: {
      ":lastLogout": { "S": lastLogout }
    }
  }
  return new Promise( (resolve, reject) => {
    ddb.updateItem(params, function (err, data) {
      if (err) {
        console.log(err.stack);
        return reject();
      }
      return resolve(data);
    });
  });
}

function SetPassword (ddb, userId, password) {
  const encryptedPassword = bcrypt.hashSync(password, 8);
  const params = {
    TableName: "prod.CS.Users",
    Key: {
      "userId": { "S": userId }
    },
    UpdateExpression: "SET password = :password REMOVE passwordCode",
    ExpressionAttributeValues: {
      ":password": { "S": encryptedPassword }
    }
  }
  return new Promise( (resolve, reject) => {
    ddb.updateItem(params, function (err, data) {
      if (err) {
        console.log(err.stack);
        return reject();
      }
      return resolve(data);
    });
  });
}

function SetUserStatus (ddb, userId, status) {
  const params = {
    TableName: "prod.CS.Users",
    Key: {
      "userId": { "S": userId }
    },
    UpdateExpression: "SET #status = :status REMOVE verificationCode",
    ExpressionAttributeValues: {
      ":status": { "S": status }
    },
    ExpressionAttributeNames: {
      "#status": "status"
    }    
  }
  return new Promise( (resolve, reject) => {
    ddb.updateItem(params, function (err, data) {
      if (err) {
        console.log(err.stack);
        return reject();
      }
      return resolve(data);
    });
  });
}

module.exports = { GetUser, GetUserByEmail, GetUserByGamerTag, GetUserByIdentifier, 
  GenerateGamerTagId, SetUser, SetPasswordCode, SetLastLogout, SetPassword, SetUserStatus };
