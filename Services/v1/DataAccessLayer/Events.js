const SetEvent = async (docClient, Logger, eventDetails) => {
  const params = {
    TableName: 'prod.CS.events',
    Item: eventDetails
  };
  return new Promise( (resolve, reject) => {
    docClient.put(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject();
      };
      return resolve(eventDetails);
    });
  });
};

module.exports = { SetEvent };
