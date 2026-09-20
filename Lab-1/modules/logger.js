// Small helper used for program messages.
module.exports = function log(message) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${message}`);
};
