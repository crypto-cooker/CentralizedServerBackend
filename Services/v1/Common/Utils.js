const RandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
}

const LogRequest = (requestPath, requestBody, userId='n\\a') => {
	console.log(`[userId: ${userId}] Received request: "${requestPath}" with body: ${JSON.stringify(requestBody)}`);
};

module.exports = { RandomCode };