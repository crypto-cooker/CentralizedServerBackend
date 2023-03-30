const { success, userError } = require("./../../../Common/Responses");
const { SetEvent } = require("./../../../DataAccessLayer/Events");

const SetEvent = async (docClient, Logger, eventDetails, creatorUserId) => {
  if (!IsValidEvent(eventDetails)) {
    return userError(Logger, 403, {'response': 'invalid event details'});
  }

  const setEventResponse = await SetEvent(docClient, eventDetails, creatorUserId);
  console.log(setEventResponse);
  return success(Logger, {response: 'OK'});
};

const IsValidEvent = (eventDetails) => {
  return true;
};

module.exports = { SetEvent };
