const jwt = require("jsonwebtoken");
const jwtSecret = "centralServices123";
const { GetUser } = require("./../DataAccessLayer/Users");

const DeserializeToken = (accessToken) => {
  return new Promise( (resolve, reject) => {
    jwt.verify(accessToken, jwtSecret, (err, decoded) => {
      const containsId = (typeof(decoded) !== "undefined" && "id" in decoded);
      if (err || !containsId) {
        console.error(`Failed to extractUserId: ${err.stack}`);
        return resolve(undefined);
      }
      return resolve(decoded);
    });
  });
}

const IsValidPublicRequest = (event) => {
  return (
    event.headers !== null && "Authorization" in event.headers 
    && event.headers.Authorization === "centralServices123"
  );  
}

const ContainsAuthorizationHeaders = (event) => {
  const headersExists = (
    event.headers !== null 
    && "Authorization" in event.headers 
    && event.headers.Authorization.includes("Bearer")
  );
  if (!headersExists) {
    return false;
  }
  const accessToken = event.headers.Authorization.slice(7);
  const accessTokenExists = ( accessToken.length > 0 );
  if (!accessTokenExists) {
    return false;
  }

  return true;
}

const ValidateCredentials = async (ddb, event) => {
  //
  // Takes a lambda event, validate token and returns a { user }
  // Returns an { error: 'errorMsg' } if something goes wrong
  //
  const hasHeaders = await ContainsAuthorizationHeaders(event);
  if (!hasHeaders) { 
    return { error: 'no headers' };
  };

  const deserializedToken = await DeserializeToken(event.headers.Authorization.slice(7));
  console.log(deserializedToken);
  const userId = deserializedToken.id;
  const issuedAt = deserializedToken.iat;

  const user = await GetUser(ddb, userId);
  if (!('lastLogout' in user)) {
    return { userId };
  }

  const lastLogout = user.lastLogout.S;
  console.log(lastLogout, issuedAt)
  if (lastLogout && (issuedAt < lastLogout)) {
    console.log(`This token was issued before the user's lastLogOut - thus it is invalidated. `);
    return { error: 'expired token' };
  }  

  return { userId };
}

module.exports = { ValidateCredentials, IsValidPublicRequest, DeserializeToken };
